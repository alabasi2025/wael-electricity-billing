// =============================================
// خدمة المستخدمين (Users Service)
// =============================================
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { SysDataEntity } from './entities/sysdata.entity';
import { CreateUserDto, UpdateUserDto, ChangePasswordDto, UpdatePermissionsDto } from './dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(SysDataEntity)
    private readonly sysDataRepo: Repository<SysDataEntity>,
  ) {}

  // ─── إنشاء مستخدم ───
  async create(dto: CreateUserDto): Promise<UserEntity> {
    // التحقق من عدم وجود مستخدم بنفس الرقم
    const existing = await this.userRepo.findOne({ where: { nou: dto.nou } });
    if (existing) {
      throw new ConflictException(`المستخدم رقم ${dto.nou} موجود مسبقاً`);
    }

    const user = this.userRepo.create({
      ...dto,
      passs: dto.pass,
    });
    const saved = await this.userRepo.save(user);
    this.logger.log(`تم إنشاء المستخدم: ${saved.nameu} (${saved.nou})`);
    return saved;
  }

  // ─── جلب كل المستخدمين مع ترقيم ───
  async findAll(pagination: PaginationDto) {
    const { page, pageSize, skip, sortBy, sortOrder, search } = pagination;

    const queryBuilder = this.userRepo.createQueryBuilder('user');

    // البحث
    if (search) {
      queryBuilder.where(
        'user.nameu LIKE :search OR CAST(user.nou AS TEXT) LIKE :search',
        { search: `%${search}%` },
      );
    }

    // الترتيب
    const orderField = sortBy || 'nou';
    queryBuilder.orderBy(`user.${orderField}`, sortOrder || 'ASC');

    // الترقيم
    queryBuilder.skip(skip).take(pageSize);

    const [data, totalCount] = await queryBuilder.getManyAndCount();

    return {
      data,
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
      message: `تم جلب ${data.length} مستخدم`,
    };
  }

  // ─── جلب مستخدم بالرقم ───
  async findOne(nou: number): Promise<UserEntity> {
    const user = await this.userRepo.findOne({ where: { nou } });
    if (!user) {
      throw new NotFoundException(`المستخدم رقم ${nou} غير موجود`);
    }
    return user;
  }

  // ─── جلب مستخدم بالرقم مع كلمة السر (للمصادقة) ───
  async findOneForAuth(nou: number): Promise<UserEntity | null> {
    return this.userRepo.findOne({ where: { nou, statu: 1 } });
  }

  // ─── تحديث مستخدم ───
  async update(nou: number, dto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOne(nou);
    Object.assign(user, dto);
    if (dto.pass) {
      user.passs = dto.pass;
    }
    const saved = await this.userRepo.save(user);
    this.logger.log(`تم تحديث المستخدم: ${saved.nameu} (${saved.nou})`);
    return saved;
  }

  // ─── حذف مستخدم ───
  async remove(nou: number): Promise<void> {
    const user = await this.findOne(nou);
    if (user.nou === 1) {
      throw new BadRequestException('لا يمكن حذف مدير النظام');
    }
    await this.userRepo.remove(user);
    this.logger.log(`تم حذف المستخدم: ${user.nameu} (${nou})`);
  }

  // ─── تغيير كلمة السر ───
  async changePassword(nou: number, dto: ChangePasswordDto): Promise<void> {
    const user = await this.findOne(nou);
    const isValid = await user.validatePassword(dto.oldPassword);
    if (!isValid) {
      throw new BadRequestException('كلمة السر الحالية غير صحيحة');
    }
    user.pass = dto.newPassword;
    user.passs = dto.newPassword;
    await this.userRepo.save(user);
    this.logger.log(`تم تغيير كلمة سر المستخدم: ${user.nameu}`);
  }

  // ─── تحديث الصلاحيات ───
  async updatePermissions(
    nou: number,
    dto: UpdatePermissionsDto,
  ): Promise<UserEntity> {
    const user = await this.findOne(nou);
    if (dto.ed !== undefined) user.ed = dto.ed;
    if (dto.de !== undefined) user.de = dto.de;
    if (dto.repa !== undefined) user.repa = dto.repa;
    return this.userRepo.save(user);
  }

  // ─── تفعيل/تعطيل مستخدم ───
  async toggleStatus(nou: number): Promise<UserEntity> {
    const user = await this.findOne(nou);
    if (user.nou === 1) {
      throw new BadRequestException('لا يمكن تعطيل مدير النظام');
    }
    user.statu = user.statu === 1 ? 0 : 1;
    return this.userRepo.save(user);
  }

  // ─── سجل النظام ───
  async logAction(userId: number, action: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { nou: userId } });
    const now = new Date();
    const log = this.sysDataRepo.create({
      userId,
      loginTime: now.toLocaleTimeString('en-US', { hour12: true }),
      loginDate: now,
      userName: user?.nameu || 'غير معروف',
      action,
    });
    await this.sysDataRepo.save(log);
  }

  // ─── جلب سجل النظام ───
  async getActivityLog(pagination: PaginationDto) {
    const { page, pageSize, skip } = pagination;

    const [data, totalCount] = await this.sysDataRepo.findAndCount({
      order: { id: 'DESC' },
      skip,
      take: pageSize,
      relations: ['user'],
    });

    return {
      data,
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  }

  // ─── إحصائيات المستخدمين ───
  async getStats() {
    const total = await this.userRepo.count();
    const active = await this.userRepo.count({ where: { statu: 1 } });
    const inactive = await this.userRepo.count({ where: { statu: 0 } });

    return {
      data: { total, active, inactive },
      message: 'إحصائيات المستخدمين',
    };
  }
}
