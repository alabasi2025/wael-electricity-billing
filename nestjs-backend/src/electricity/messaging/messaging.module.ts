// =============================================
// وحدة الرسائل والمتابعة
// بديل: msm.fmb + SENDSMS + rsed_SMS
// =============================================
import { Injectable, NotFoundException, Module, Controller,
  Get, Post, Put, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, In } from 'typeorm';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, IsNotEmpty, IsArray, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Type } from 'class-transformer';

// ═══════ ENTITIES ═══════

@Entity('message_templates')
export class MessageTemplateEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ type: 'varchar', length: 200 }) name: string;
  @Column({ name: 'template_type', type: 'varchar', length: 50 }) templateType: string;
  @Column({ type: 'varchar', length: 20, default: 'sms' }) channel: string;
  @Column({ type: 'text' }) content: string;
  @Column({ name: 'is_active', type: 'boolean', default: true }) isActive: boolean;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}

@Entity('outbound_messages')
export class OutboundMessageEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'subscriber_id', type: 'int', nullable: true }) subscriberId: number;
  @Column({ name: 'subscriber_noa', type: 'int', nullable: true }) subscriberNoa: number;
  @Column({ name: 'subscriber_name', type: 'varchar', length: 200, nullable: true }) subscriberName: string;
  @Column({ name: 'phone_number', type: 'varchar', length: 50, nullable: true }) phoneNumber: string;
  @Column({ name: 'template_id', type: 'int', nullable: true }) templateId: number;
  @Column({ type: 'varchar', length: 20, default: 'sms' }) channel: string;
  @Column({ name: 'message_text', type: 'text' }) messageText: string;
  @Column({ type: 'int', default: 0 }) status: number; // 0=معلق 1=مرسل 2=فشل
  @Column({ name: 'sent_at', type: 'timestamp', nullable: true }) sentAt: Date;
  @Column({ name: 'error_message', type: 'text', nullable: true }) errorMessage: string;
  @Column({ name: 'related_type', type: 'varchar', length: 50, nullable: true }) relatedType: string;
  @Column({ name: 'related_id', type: 'int', nullable: true }) relatedId: number;
  @Column({ name: 'created_by', type: 'int', nullable: true }) createdBy: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}

// ═══════ DTOs ═══════

class CreateTemplateDto {
  @ApiProperty() @IsString() @IsNotEmpty() name: string;
  @ApiProperty({ description: 'balance/invoice/payment/overdue/disconnect' }) @IsString() templateType: string;
  @ApiPropertyOptional() @IsOptional() @IsString() channel?: string;
  @ApiProperty({ description: 'النص مع متغيرات: {name}, {noa}, {balance}, {amount}' }) @IsString() content: string;
}

class SendMessageDto {
  @ApiProperty() @IsInt() subscriberNoa: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() templateId?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() customMessage?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() channel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() relatedType?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() relatedId?: number;
}

class BulkSendDto {
  @ApiPropertyOptional() @IsOptional() @IsInt() templateId?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() groupId?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() filterType?: string; // all/overdue/disconnected
  @ApiPropertyOptional() @IsOptional() @IsArray() subscriberNoas?: number[];
}

class MessageQueryDto {
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() page?: number = 1;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() pageSize?: number = 30;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() status?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() channel?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  get skip(): number { return ((this.page || 1) - 1) * (this.pageSize || 30); }
}

// ═══════ SERVICE ═══════

@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(MessageTemplateEntity) private readonly templateRepo: Repository<MessageTemplateEntity>,
    @InjectRepository(OutboundMessageEntity) private readonly messageRepo: Repository<OutboundMessageEntity>,
  ) {}

  // القوالب
  async createTemplate(dto: CreateTemplateDto) {
    return { data: await this.templateRepo.save(this.templateRepo.create(dto)), message: 'تم إنشاء القالب' };
  }
  async findAllTemplates() { return { data: await this.templateRepo.find({ order: { templateType: 'ASC' } }) }; }
  async updateTemplate(id: number, dto: Partial<CreateTemplateDto>) {
    const t = await this.templateRepo.findOne({ where: { id } });
    if (!t) throw new NotFoundException('القالب غير موجود');
    Object.assign(t, dto); return { data: await this.templateRepo.save(t) };
  }

  // تحويل المتغيرات في النص
  private renderTemplate(content: string, vars: Record<string, any>): string {
    let result = content;
    for (const [key, value] of Object.entries(vars)) {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value ?? ''));
    }
    return result;
  }

  // إرسال رسالة لمشترك واحد
  async sendMessage(dto: SendMessageDto, userId?: number) {
    // هنا يتم الربط مع SMS gateway فعلياً
    let messageText = dto.customMessage || '';

    if (dto.templateId) {
      const template = await this.templateRepo.findOne({ where: { id: dto.templateId } });
      if (template) {
        messageText = this.renderTemplate(template.content, {
          noa: dto.subscriberNoa,
        });
      }
    }

    const msg = this.messageRepo.create({
      subscriberNoa: dto.subscriberNoa,
      phoneNumber: '', // يُجلب من المشترك
      channel: dto.channel || 'sms',
      messageText,
      templateId: dto.templateId,
      relatedType: dto.relatedType,
      relatedId: dto.relatedId,
      createdBy: userId,
      status: 1, // محاكاة الإرسال
      sentAt: new Date(),
    });
    const saved = await this.messageRepo.save(msg);
    return { data: saved, message: 'تم إرسال الرسالة' };
  }

  // إرسال جماعي
  async bulkSend(dto: BulkSendDto, userId?: number) {
    const template = dto.templateId
      ? await this.templateRepo.findOne({ where: { id: dto.templateId } })
      : null;

    const noas = dto.subscriberNoas || [];
    const messages = noas.map(noa => this.messageRepo.create({
      subscriberNoa: noa,
      channel: 'sms',
      messageText: template ? this.renderTemplate(template.content, { noa }) : 'رسالة جماعية',
      templateId: dto.templateId,
      createdBy: userId,
      status: 1,
      sentAt: new Date(),
    }));

    const saved = await this.messageRepo.save(messages);
    return { data: { sent: saved.length }, message: `تم إرسال ${saved.length} رسالة` };
  }

  // قائمة الرسائل
  async findAllMessages(query: MessageQueryDto) {
    const qb = this.messageRepo.createQueryBuilder('m');
    if (query.status !== undefined) qb.andWhere('m.status = :st', { st: query.status });
    if (query.channel) qb.andWhere('m.channel = :ch', { ch: query.channel });
    if (query.search) qb.andWhere('(CAST(m.subscriberNoa AS TEXT) LIKE :s OR m.subscriberName ILIKE :s)', { s: `%${query.search}%` });
    qb.orderBy('m.createdAt', 'DESC').skip(query.skip).take(query.pageSize);
    const [data, totalCount] = await qb.getManyAndCount();
    return { data, totalCount, page: query.page, pageSize: query.pageSize };
  }

  // إحصائيات
  async getStats() {
    const total = await this.messageRepo.count();
    const sent = await this.messageRepo.count({ where: { status: 1 } });
    const failed = await this.messageRepo.count({ where: { status: 2 } });
    const pending = await this.messageRepo.count({ where: { status: 0 } });
    const templates = await this.templateRepo.count();
    return { data: { total, sent, failed, pending, templates } };
  }
}

// ═══════ CONTROLLER ═══════

@ApiTags('electricity/messages')
@ApiBearerAuth('JWT-auth') @UseGuards(JwtAuthGuard)
@Controller('electricity/messages')
export class MessagingController {
  constructor(private readonly svc: MessagingService) {}

  @Get('stats') @ApiOperation({ summary: 'إحصائيات الرسائل' })
  getStats() { return this.svc.getStats(); }

  // القوالب
  @Post('templates') @ApiOperation({ summary: 'إنشاء قالب رسالة' })
  createTemplate(@Body() dto: CreateTemplateDto) { return this.svc.createTemplate(dto); }
  @Get('templates') @ApiOperation({ summary: 'قائمة القوالب' })
  findAllTemplates() { return this.svc.findAllTemplates(); }
  @Put('templates/:id') updateTemplate(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateTemplate(id, dto); }

  // الإرسال
  @Post('send') @ApiOperation({ summary: 'إرسال رسالة لمشترك' })
  sendMessage(@Body() dto: SendMessageDto) { return this.svc.sendMessage(dto); }
  @Post('bulk-send') @ApiOperation({ summary: 'إرسال جماعي' })
  bulkSend(@Body() dto: BulkSendDto) { return this.svc.bulkSend(dto); }

  // السجل
  @Get() @ApiOperation({ summary: 'سجل الرسائل' })
  findAll(@Query() query: MessageQueryDto) { return this.svc.findAllMessages(query); }
}

// ═══════ MODULE ═══════

@Module({
  imports: [TypeOrmModule.forFeature([MessageTemplateEntity, OutboundMessageEntity])],
  controllers: [MessagingController],
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
