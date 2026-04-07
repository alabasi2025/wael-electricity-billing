// =============================================
// خدمة عامة للجداول المتبقية
// CRUD تلقائي لكل الجداول
// =============================================
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddtbEntity } from './entities/legacy.entity';
import { AhtsrEntity } from './entities/legacy.entity';
import { AkdEntity } from './entities/legacy.entity';
import { AkfafEntity } from './entities/legacy.entity';
import { AkyEntity } from './entities/legacy.entity';
import { AmrgrpEntity } from './entities/legacy.entity';
import { ArshfEntity } from './entities/legacy.entity';
import { ArsrffEntity } from './entities/legacy.entity';
import { AGEntity } from './entities/legacy.entity';
import { CarEntity } from './entities/legacy.entity';
import { DarEntity } from './entities/legacy.entity';
import { DataffffEntity } from './entities/legacy.entity';
import { DataffxEntity } from './entities/legacy.entity';
import { DatafxEntity } from './entities/legacy.entity';
import { DatafyEntity } from './entities/legacy.entity';
import { DatakYearNEntity } from './entities/legacy.entity';
import { DatanetEntity } from './entities/legacy.entity';
import { DataArEntity } from './entities/legacy.entity';
import { DataSnEntity } from './entities/legacy.entity';
import { DelREntity } from './entities/legacy.entity';
import { FatbfxEntity } from './entities/legacy.entity';
import { FinEntity } from './entities/legacy.entity';
import { FslsdadEntity } from './entities/legacy.entity';
import { FslsdadmsEntity } from './entities/legacy.entity';
import { HmhEntity } from './entities/legacy.entity';
import { KshEntity } from './entities/legacy.entity';
import { KydEntity } from './entities/legacy.entity';
import { LovAaEntity } from './entities/legacy.entity';
import { MatEntity } from './entities/legacy.entity';
import { MemoprEntity } from './entities/legacy.entity';
import { MkbEntity } from './entities/legacy.entity';
import { Mkb2Entity } from './entities/legacy.entity';
import { MmshEntity } from './entities/legacy.entity';
import { MolEntity } from './entities/legacy.entity';
import { MolfEntity } from './entities/legacy.entity';
import { MomomoEntity } from './entities/legacy.entity';
import { MrczetEntity } from './entities/legacy.entity';
import { MscEntity } from './entities/legacy.entity';
import { MsrifEntity } from './entities/legacy.entity';
import { MvEntity } from './entities/legacy.entity';
import { MvallEntity } from './entities/legacy.entity';
import { MztEntity } from './entities/legacy.entity';
import { NokEntity } from './entities/legacy.entity';
import { Nsdk2Entity } from './entities/legacy.entity';
import { NursEntity } from './entities/legacy.entity';
import { PrgEntity } from './entities/legacy.entity';
import { RedEntity } from './entities/legacy.entity';
import { RedmmmEntity } from './entities/legacy.entity';
import { RedmmmdEntity } from './entities/legacy.entity';
import { RedmmtEntity } from './entities/legacy.entity';
import { RedmmwEntity } from './entities/legacy.entity';
import { Redmmw2Entity } from './entities/legacy.entity';
import { Redmmw2dEntity } from './entities/legacy.entity';
import { RedmmwdEntity } from './entities/legacy.entity';
import { RedmmzEntity } from './entities/legacy.entity';
import { RedmtEntity } from './entities/legacy.entity';
import { RedmwEntity } from './entities/legacy.entity';
import { RedmwxEntity } from './entities/legacy.entity';
import { RedmzEntity } from './entities/legacy.entity';
import { RedpEntity } from './entities/legacy.entity';
import { RedExEntity } from './entities/legacy.entity';
import { RepallEntity } from './entities/legacy.entity';
import { RepampEntity } from './entities/legacy.entity';
import { RepkhmEntity } from './entities/legacy.entity';
import { RepkhxxxEntity } from './entities/legacy.entity';
import { RepmsmEntity } from './entities/legacy.entity';
import { ReprorhEntity } from './entities/legacy.entity';
import { RtfAbEntity } from './entities/legacy.entity';
import { RtAbEntity } from './entities/legacy.entity';
import { SarshEntity } from './entities/legacy.entity';
import { SendsmsEntity } from './entities/legacy.entity';
import { SendsmsSEntity } from './entities/legacy.entity';
import { Sndk22Entity } from './entities/legacy.entity';
import { SndknetfEntity } from './entities/legacy.entity';
import { SndkoEntity } from './entities/legacy.entity';
import { SndkofEntity } from './entities/legacy.entity';
import { SndkrsEntity } from './entities/legacy.entity';
import { SndksnEntity } from './entities/legacy.entity';
import { SndksnfEntity } from './entities/legacy.entity';
import { SndkAEntity } from './entities/legacy.entity';
import { Snds22Entity } from './entities/legacy.entity';
import { ThoelEntity } from './entities/legacy.entity';
import { TrEntity } from './entities/legacy.entity';
import { TrhEntity } from './entities/legacy.entity';
import { TrmbEntity } from './entities/legacy.entity';
import { TssnEntity } from './entities/legacy.entity';
import { TssnfEntity } from './entities/legacy.entity';
import { TssxEntity } from './entities/legacy.entity';
import { Tssx2Entity } from './entities/legacy.entity';
import { TtelEntity } from './entities/legacy.entity';
import { TyhtEntity } from './entities/legacy.entity';
import { TypemsEntity } from './entities/legacy.entity';
import { TyMsEntity } from './entities/legacy.entity';
import { TRTEntity } from './entities/legacy.entity';
import { UsergnEntity } from './entities/legacy.entity';
import { UserMnatkEntity } from './entities/legacy.entity';
import { UserREntity } from './entities/legacy.entity';
import { YsEntity } from './entities/legacy.entity';

@Injectable()
export class LegacyService {
  constructor(
    @InjectRepository(AddtbEntity) private readonly addtbRepo: Repository<AddtbEntity>,
    @InjectRepository(AhtsrEntity) private readonly ahtsrRepo: Repository<AhtsrEntity>,
    @InjectRepository(AkdEntity) private readonly akdRepo: Repository<AkdEntity>,
    @InjectRepository(AkfafEntity) private readonly akfafRepo: Repository<AkfafEntity>,
    @InjectRepository(AkyEntity) private readonly akyRepo: Repository<AkyEntity>,
    @InjectRepository(AmrgrpEntity) private readonly amrgrpRepo: Repository<AmrgrpEntity>,
    @InjectRepository(ArshfEntity) private readonly arshfRepo: Repository<ArshfEntity>,
    @InjectRepository(ArsrffEntity) private readonly arsrffRepo: Repository<ArsrffEntity>,
    @InjectRepository(AGEntity) private readonly aGRepo: Repository<AGEntity>,
    @InjectRepository(CarEntity) private readonly carRepo: Repository<CarEntity>,
    @InjectRepository(DarEntity) private readonly darRepo: Repository<DarEntity>,
    @InjectRepository(DataffffEntity) private readonly dataffffRepo: Repository<DataffffEntity>,
    @InjectRepository(DataffxEntity) private readonly dataffxRepo: Repository<DataffxEntity>,
    @InjectRepository(DatafxEntity) private readonly datafxRepo: Repository<DatafxEntity>,
    @InjectRepository(DatafyEntity) private readonly datafyRepo: Repository<DatafyEntity>,
    @InjectRepository(DatakYearNEntity) private readonly datakYearNRepo: Repository<DatakYearNEntity>,
    @InjectRepository(DatanetEntity) private readonly datanetRepo: Repository<DatanetEntity>,
    @InjectRepository(DataArEntity) private readonly dataArRepo: Repository<DataArEntity>,
    @InjectRepository(DataSnEntity) private readonly dataSnRepo: Repository<DataSnEntity>,
    @InjectRepository(DelREntity) private readonly delRRepo: Repository<DelREntity>,
    @InjectRepository(FatbfxEntity) private readonly fatbfxRepo: Repository<FatbfxEntity>,
    @InjectRepository(FinEntity) private readonly finRepo: Repository<FinEntity>,
    @InjectRepository(FslsdadEntity) private readonly fslsdadRepo: Repository<FslsdadEntity>,
    @InjectRepository(FslsdadmsEntity) private readonly fslsdadmsRepo: Repository<FslsdadmsEntity>,
    @InjectRepository(HmhEntity) private readonly hmhRepo: Repository<HmhEntity>,
    @InjectRepository(KshEntity) private readonly kshRepo: Repository<KshEntity>,
    @InjectRepository(KydEntity) private readonly kydRepo: Repository<KydEntity>,
    @InjectRepository(LovAaEntity) private readonly lovAaRepo: Repository<LovAaEntity>,
    @InjectRepository(MatEntity) private readonly matRepo: Repository<MatEntity>,
    @InjectRepository(MemoprEntity) private readonly memoprRepo: Repository<MemoprEntity>,
    @InjectRepository(MkbEntity) private readonly mkbRepo: Repository<MkbEntity>,
    @InjectRepository(Mkb2Entity) private readonly mkb2Repo: Repository<Mkb2Entity>,
    @InjectRepository(MmshEntity) private readonly mmshRepo: Repository<MmshEntity>,
    @InjectRepository(MolEntity) private readonly molRepo: Repository<MolEntity>,
    @InjectRepository(MolfEntity) private readonly molfRepo: Repository<MolfEntity>,
    @InjectRepository(MomomoEntity) private readonly momomoRepo: Repository<MomomoEntity>,
    @InjectRepository(MrczetEntity) private readonly mrczetRepo: Repository<MrczetEntity>,
    @InjectRepository(MscEntity) private readonly mscRepo: Repository<MscEntity>,
    @InjectRepository(MsrifEntity) private readonly msrifRepo: Repository<MsrifEntity>,
    @InjectRepository(MvEntity) private readonly mvRepo: Repository<MvEntity>,
    @InjectRepository(MvallEntity) private readonly mvallRepo: Repository<MvallEntity>,
    @InjectRepository(MztEntity) private readonly mztRepo: Repository<MztEntity>,
    @InjectRepository(NokEntity) private readonly nokRepo: Repository<NokEntity>,
    @InjectRepository(Nsdk2Entity) private readonly nsdk2Repo: Repository<Nsdk2Entity>,
    @InjectRepository(NursEntity) private readonly nursRepo: Repository<NursEntity>,
    @InjectRepository(PrgEntity) private readonly prgRepo: Repository<PrgEntity>,
    @InjectRepository(RedEntity) private readonly redRepo: Repository<RedEntity>,
    @InjectRepository(RedmmmEntity) private readonly redmmmRepo: Repository<RedmmmEntity>,
    @InjectRepository(RedmmmdEntity) private readonly redmmmdRepo: Repository<RedmmmdEntity>,
    @InjectRepository(RedmmtEntity) private readonly redmmtRepo: Repository<RedmmtEntity>,
    @InjectRepository(RedmmwEntity) private readonly redmmwRepo: Repository<RedmmwEntity>,
    @InjectRepository(Redmmw2Entity) private readonly redmmw2Repo: Repository<Redmmw2Entity>,
    @InjectRepository(Redmmw2dEntity) private readonly redmmw2dRepo: Repository<Redmmw2dEntity>,
    @InjectRepository(RedmmwdEntity) private readonly redmmwdRepo: Repository<RedmmwdEntity>,
    @InjectRepository(RedmmzEntity) private readonly redmmzRepo: Repository<RedmmzEntity>,
    @InjectRepository(RedmtEntity) private readonly redmtRepo: Repository<RedmtEntity>,
    @InjectRepository(RedmwEntity) private readonly redmwRepo: Repository<RedmwEntity>,
    @InjectRepository(RedmwxEntity) private readonly redmwxRepo: Repository<RedmwxEntity>,
    @InjectRepository(RedmzEntity) private readonly redmzRepo: Repository<RedmzEntity>,
    @InjectRepository(RedpEntity) private readonly redpRepo: Repository<RedpEntity>,
    @InjectRepository(RedExEntity) private readonly redExRepo: Repository<RedExEntity>,
    @InjectRepository(RepallEntity) private readonly repallRepo: Repository<RepallEntity>,
    @InjectRepository(RepampEntity) private readonly repampRepo: Repository<RepampEntity>,
    @InjectRepository(RepkhmEntity) private readonly repkhmRepo: Repository<RepkhmEntity>,
    @InjectRepository(RepkhxxxEntity) private readonly repkhxxxRepo: Repository<RepkhxxxEntity>,
    @InjectRepository(RepmsmEntity) private readonly repmsmRepo: Repository<RepmsmEntity>,
    @InjectRepository(ReprorhEntity) private readonly reprorhRepo: Repository<ReprorhEntity>,
    @InjectRepository(RtfAbEntity) private readonly rtfAbRepo: Repository<RtfAbEntity>,
    @InjectRepository(RtAbEntity) private readonly rtAbRepo: Repository<RtAbEntity>,
    @InjectRepository(SarshEntity) private readonly sarshRepo: Repository<SarshEntity>,
    @InjectRepository(SendsmsEntity) private readonly sendsmsRepo: Repository<SendsmsEntity>,
    @InjectRepository(SendsmsSEntity) private readonly sendsmsSRepo: Repository<SendsmsSEntity>,
    @InjectRepository(Sndk22Entity) private readonly sndk22Repo: Repository<Sndk22Entity>,
    @InjectRepository(SndknetfEntity) private readonly sndknetfRepo: Repository<SndknetfEntity>,
    @InjectRepository(SndkoEntity) private readonly sndkoRepo: Repository<SndkoEntity>,
    @InjectRepository(SndkofEntity) private readonly sndkofRepo: Repository<SndkofEntity>,
    @InjectRepository(SndkrsEntity) private readonly sndkrsRepo: Repository<SndkrsEntity>,
    @InjectRepository(SndksnEntity) private readonly sndksnRepo: Repository<SndksnEntity>,
    @InjectRepository(SndksnfEntity) private readonly sndksnfRepo: Repository<SndksnfEntity>,
    @InjectRepository(SndkAEntity) private readonly sndkARepo: Repository<SndkAEntity>,
    @InjectRepository(Snds22Entity) private readonly snds22Repo: Repository<Snds22Entity>,
    @InjectRepository(ThoelEntity) private readonly thoelRepo: Repository<ThoelEntity>,
    @InjectRepository(TrEntity) private readonly trRepo: Repository<TrEntity>,
    @InjectRepository(TrhEntity) private readonly trhRepo: Repository<TrhEntity>,
    @InjectRepository(TrmbEntity) private readonly trmbRepo: Repository<TrmbEntity>,
    @InjectRepository(TssnEntity) private readonly tssnRepo: Repository<TssnEntity>,
    @InjectRepository(TssnfEntity) private readonly tssnfRepo: Repository<TssnfEntity>,
    @InjectRepository(TssxEntity) private readonly tssxRepo: Repository<TssxEntity>,
    @InjectRepository(Tssx2Entity) private readonly tssx2Repo: Repository<Tssx2Entity>,
    @InjectRepository(TtelEntity) private readonly ttelRepo: Repository<TtelEntity>,
    @InjectRepository(TyhtEntity) private readonly tyhtRepo: Repository<TyhtEntity>,
    @InjectRepository(TypemsEntity) private readonly typemsRepo: Repository<TypemsEntity>,
    @InjectRepository(TyMsEntity) private readonly tyMsRepo: Repository<TyMsEntity>,
    @InjectRepository(TRTEntity) private readonly tRTRepo: Repository<TRTEntity>,
    @InjectRepository(UsergnEntity) private readonly usergnRepo: Repository<UsergnEntity>,
    @InjectRepository(UserMnatkEntity) private readonly userMnatkRepo: Repository<UserMnatkEntity>,
    @InjectRepository(UserREntity) private readonly userRRepo: Repository<UserREntity>,
    @InjectRepository(YsEntity) private readonly ysRepo: Repository<YsEntity>,
  ) {}

  // ─── ADDTB ───
  async getAddtb(skip=0, take=50) {
    const [data, total] = await this.addtbRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createAddtb(dto: any) {
    return { data: await this.addtbRepo.save(this.addtbRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateAddtb(id: number, dto: any) {
    const e = await this.addtbRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.addtbRepo.save(e), message: 'تم التحديث' };
  }
  async deleteAddtb(id: number) {
    await this.addtbRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── AHTSR ───
  async getAhtsr(skip=0, take=50) {
    const [data, total] = await this.ahtsrRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createAhtsr(dto: any) {
    return { data: await this.ahtsrRepo.save(this.ahtsrRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateAhtsr(id: number, dto: any) {
    const e = await this.ahtsrRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.ahtsrRepo.save(e), message: 'تم التحديث' };
  }
  async deleteAhtsr(id: number) {
    await this.ahtsrRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── AKD ───
  async getAkd(skip=0, take=50) {
    const [data, total] = await this.akdRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createAkd(dto: any) {
    return { data: await this.akdRepo.save(this.akdRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateAkd(id: number, dto: any) {
    const e = await this.akdRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.akdRepo.save(e), message: 'تم التحديث' };
  }
  async deleteAkd(id: number) {
    await this.akdRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── AKFAF ───
  async getAkfaf(skip=0, take=50) {
    const [data, total] = await this.akfafRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createAkfaf(dto: any) {
    return { data: await this.akfafRepo.save(this.akfafRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateAkfaf(id: number, dto: any) {
    const e = await this.akfafRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.akfafRepo.save(e), message: 'تم التحديث' };
  }
  async deleteAkfaf(id: number) {
    await this.akfafRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── AKY ───
  async getAky(skip=0, take=50) {
    const [data, total] = await this.akyRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createAky(dto: any) {
    return { data: await this.akyRepo.save(this.akyRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateAky(id: number, dto: any) {
    const e = await this.akyRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.akyRepo.save(e), message: 'تم التحديث' };
  }
  async deleteAky(id: number) {
    await this.akyRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── AMRGRP ───
  async getAmrgrp(skip=0, take=50) {
    const [data, total] = await this.amrgrpRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createAmrgrp(dto: any) {
    return { data: await this.amrgrpRepo.save(this.amrgrpRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateAmrgrp(id: number, dto: any) {
    const e = await this.amrgrpRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.amrgrpRepo.save(e), message: 'تم التحديث' };
  }
  async deleteAmrgrp(id: number) {
    await this.amrgrpRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── ARSHF ───
  async getArshf(skip=0, take=50) {
    const [data, total] = await this.arshfRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createArshf(dto: any) {
    return { data: await this.arshfRepo.save(this.arshfRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateArshf(id: number, dto: any) {
    const e = await this.arshfRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.arshfRepo.save(e), message: 'تم التحديث' };
  }
  async deleteArshf(id: number) {
    await this.arshfRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── ARSRFF ───
  async getArsrff(skip=0, take=50) {
    const [data, total] = await this.arsrffRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createArsrff(dto: any) {
    return { data: await this.arsrffRepo.save(this.arsrffRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateArsrff(id: number, dto: any) {
    const e = await this.arsrffRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.arsrffRepo.save(e), message: 'تم التحديث' };
  }
  async deleteArsrff(id: number) {
    await this.arsrffRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── A_G ───
  async getAG(skip=0, take=50) {
    const [data, total] = await this.aGRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createAG(dto: any) {
    return { data: await this.aGRepo.save(this.aGRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateAG(id: number, dto: any) {
    const e = await this.aGRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.aGRepo.save(e), message: 'تم التحديث' };
  }
  async deleteAG(id: number) {
    await this.aGRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── CAR ───
  async getCar(skip=0, take=50) {
    const [data, total] = await this.carRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createCar(dto: any) {
    return { data: await this.carRepo.save(this.carRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateCar(id: number, dto: any) {
    const e = await this.carRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.carRepo.save(e), message: 'تم التحديث' };
  }
  async deleteCar(id: number) {
    await this.carRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── DAR ───
  async getDar(skip=0, take=50) {
    const [data, total] = await this.darRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createDar(dto: any) {
    return { data: await this.darRepo.save(this.darRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateDar(id: number, dto: any) {
    const e = await this.darRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.darRepo.save(e), message: 'تم التحديث' };
  }
  async deleteDar(id: number) {
    await this.darRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── DATAFFFF ───
  async getDataffff(skip=0, take=50) {
    const [data, total] = await this.dataffffRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createDataffff(dto: any) {
    return { data: await this.dataffffRepo.save(this.dataffffRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateDataffff(id: number, dto: any) {
    const e = await this.dataffffRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.dataffffRepo.save(e), message: 'تم التحديث' };
  }
  async deleteDataffff(id: number) {
    await this.dataffffRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── DATAFFX ───
  async getDataffx(skip=0, take=50) {
    const [data, total] = await this.dataffxRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createDataffx(dto: any) {
    return { data: await this.dataffxRepo.save(this.dataffxRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateDataffx(id: number, dto: any) {
    const e = await this.dataffxRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.dataffxRepo.save(e), message: 'تم التحديث' };
  }
  async deleteDataffx(id: number) {
    await this.dataffxRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── DATAFX ───
  async getDatafx(skip=0, take=50) {
    const [data, total] = await this.datafxRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createDatafx(dto: any) {
    return { data: await this.datafxRepo.save(this.datafxRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateDatafx(id: number, dto: any) {
    const e = await this.datafxRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.datafxRepo.save(e), message: 'تم التحديث' };
  }
  async deleteDatafx(id: number) {
    await this.datafxRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── DATAFY ───
  async getDatafy(skip=0, take=50) {
    const [data, total] = await this.datafyRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createDatafy(dto: any) {
    return { data: await this.datafyRepo.save(this.datafyRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateDatafy(id: number, dto: any) {
    const e = await this.datafyRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.datafyRepo.save(e), message: 'تم التحديث' };
  }
  async deleteDatafy(id: number) {
    await this.datafyRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── DATAK_YEAR_N ───
  async getDatakYearN(skip=0, take=50) {
    const [data, total] = await this.datakYearNRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createDatakYearN(dto: any) {
    return { data: await this.datakYearNRepo.save(this.datakYearNRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateDatakYearN(id: number, dto: any) {
    const e = await this.datakYearNRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.datakYearNRepo.save(e), message: 'تم التحديث' };
  }
  async deleteDatakYearN(id: number) {
    await this.datakYearNRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── DATANET ───
  async getDatanet(skip=0, take=50) {
    const [data, total] = await this.datanetRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createDatanet(dto: any) {
    return { data: await this.datanetRepo.save(this.datanetRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateDatanet(id: number, dto: any) {
    const e = await this.datanetRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.datanetRepo.save(e), message: 'تم التحديث' };
  }
  async deleteDatanet(id: number) {
    await this.datanetRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── DATA_AR ───
  async getDataAr(skip=0, take=50) {
    const [data, total] = await this.dataArRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createDataAr(dto: any) {
    return { data: await this.dataArRepo.save(this.dataArRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateDataAr(id: number, dto: any) {
    const e = await this.dataArRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.dataArRepo.save(e), message: 'تم التحديث' };
  }
  async deleteDataAr(id: number) {
    await this.dataArRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── DATA_SN ───
  async getDataSn(skip=0, take=50) {
    const [data, total] = await this.dataSnRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createDataSn(dto: any) {
    return { data: await this.dataSnRepo.save(this.dataSnRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateDataSn(id: number, dto: any) {
    const e = await this.dataSnRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.dataSnRepo.save(e), message: 'تم التحديث' };
  }
  async deleteDataSn(id: number) {
    await this.dataSnRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── DEL_R ───
  async getDelR(skip=0, take=50) {
    const [data, total] = await this.delRRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createDelR(dto: any) {
    return { data: await this.delRRepo.save(this.delRRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateDelR(id: number, dto: any) {
    const e = await this.delRRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.delRRepo.save(e), message: 'تم التحديث' };
  }
  async deleteDelR(id: number) {
    await this.delRRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── FATBFX ───
  async getFatbfx(skip=0, take=50) {
    const [data, total] = await this.fatbfxRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createFatbfx(dto: any) {
    return { data: await this.fatbfxRepo.save(this.fatbfxRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateFatbfx(id: number, dto: any) {
    const e = await this.fatbfxRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.fatbfxRepo.save(e), message: 'تم التحديث' };
  }
  async deleteFatbfx(id: number) {
    await this.fatbfxRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── FIN ───
  async getFin(skip=0, take=50) {
    const [data, total] = await this.finRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createFin(dto: any) {
    return { data: await this.finRepo.save(this.finRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateFin(id: number, dto: any) {
    const e = await this.finRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.finRepo.save(e), message: 'تم التحديث' };
  }
  async deleteFin(id: number) {
    await this.finRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── FSLSDAD ───
  async getFslsdad(skip=0, take=50) {
    const [data, total] = await this.fslsdadRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createFslsdad(dto: any) {
    return { data: await this.fslsdadRepo.save(this.fslsdadRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateFslsdad(id: number, dto: any) {
    const e = await this.fslsdadRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.fslsdadRepo.save(e), message: 'تم التحديث' };
  }
  async deleteFslsdad(id: number) {
    await this.fslsdadRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── FSLSDADMS ───
  async getFslsdadms(skip=0, take=50) {
    const [data, total] = await this.fslsdadmsRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createFslsdadms(dto: any) {
    return { data: await this.fslsdadmsRepo.save(this.fslsdadmsRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateFslsdadms(id: number, dto: any) {
    const e = await this.fslsdadmsRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.fslsdadmsRepo.save(e), message: 'تم التحديث' };
  }
  async deleteFslsdadms(id: number) {
    await this.fslsdadmsRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── HMH ───
  async getHmh(skip=0, take=50) {
    const [data, total] = await this.hmhRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createHmh(dto: any) {
    return { data: await this.hmhRepo.save(this.hmhRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateHmh(id: number, dto: any) {
    const e = await this.hmhRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.hmhRepo.save(e), message: 'تم التحديث' };
  }
  async deleteHmh(id: number) {
    await this.hmhRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── KSH ───
  async getKsh(skip=0, take=50) {
    const [data, total] = await this.kshRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createKsh(dto: any) {
    return { data: await this.kshRepo.save(this.kshRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateKsh(id: number, dto: any) {
    const e = await this.kshRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.kshRepo.save(e), message: 'تم التحديث' };
  }
  async deleteKsh(id: number) {
    await this.kshRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── KYD ───
  async getKyd(skip=0, take=50) {
    const [data, total] = await this.kydRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createKyd(dto: any) {
    return { data: await this.kydRepo.save(this.kydRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateKyd(id: number, dto: any) {
    const e = await this.kydRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.kydRepo.save(e), message: 'تم التحديث' };
  }
  async deleteKyd(id: number) {
    await this.kydRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── LOV_AA ───
  async getLovAa(skip=0, take=50) {
    const [data, total] = await this.lovAaRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createLovAa(dto: any) {
    return { data: await this.lovAaRepo.save(this.lovAaRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateLovAa(id: number, dto: any) {
    const e = await this.lovAaRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.lovAaRepo.save(e), message: 'تم التحديث' };
  }
  async deleteLovAa(id: number) {
    await this.lovAaRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── MAT ───
  async getMat(skip=0, take=50) {
    const [data, total] = await this.matRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createMat(dto: any) {
    return { data: await this.matRepo.save(this.matRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateMat(id: number, dto: any) {
    const e = await this.matRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.matRepo.save(e), message: 'تم التحديث' };
  }
  async deleteMat(id: number) {
    await this.matRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── MEMOPR ───
  async getMemopr(skip=0, take=50) {
    const [data, total] = await this.memoprRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createMemopr(dto: any) {
    return { data: await this.memoprRepo.save(this.memoprRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateMemopr(id: number, dto: any) {
    const e = await this.memoprRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.memoprRepo.save(e), message: 'تم التحديث' };
  }
  async deleteMemopr(id: number) {
    await this.memoprRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── MKB ───
  async getMkb(skip=0, take=50) {
    const [data, total] = await this.mkbRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createMkb(dto: any) {
    return { data: await this.mkbRepo.save(this.mkbRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateMkb(id: number, dto: any) {
    const e = await this.mkbRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.mkbRepo.save(e), message: 'تم التحديث' };
  }
  async deleteMkb(id: number) {
    await this.mkbRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── MKB2 ───
  async getMkb2(skip=0, take=50) {
    const [data, total] = await this.mkb2Repo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createMkb2(dto: any) {
    return { data: await this.mkb2Repo.save(this.mkb2Repo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateMkb2(id: number, dto: any) {
    const e = await this.mkb2Repo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.mkb2Repo.save(e), message: 'تم التحديث' };
  }
  async deleteMkb2(id: number) {
    await this.mkb2Repo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── MMSH ───
  async getMmsh(skip=0, take=50) {
    const [data, total] = await this.mmshRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createMmsh(dto: any) {
    return { data: await this.mmshRepo.save(this.mmshRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateMmsh(id: number, dto: any) {
    const e = await this.mmshRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.mmshRepo.save(e), message: 'تم التحديث' };
  }
  async deleteMmsh(id: number) {
    await this.mmshRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── MOL ───
  async getMol(skip=0, take=50) {
    const [data, total] = await this.molRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createMol(dto: any) {
    return { data: await this.molRepo.save(this.molRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateMol(id: number, dto: any) {
    const e = await this.molRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.molRepo.save(e), message: 'تم التحديث' };
  }
  async deleteMol(id: number) {
    await this.molRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── MOLF ───
  async getMolf(skip=0, take=50) {
    const [data, total] = await this.molfRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createMolf(dto: any) {
    return { data: await this.molfRepo.save(this.molfRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateMolf(id: number, dto: any) {
    const e = await this.molfRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.molfRepo.save(e), message: 'تم التحديث' };
  }
  async deleteMolf(id: number) {
    await this.molfRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── MOMOMO ───
  async getMomomo(skip=0, take=50) {
    const [data, total] = await this.momomoRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createMomomo(dto: any) {
    return { data: await this.momomoRepo.save(this.momomoRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateMomomo(id: number, dto: any) {
    const e = await this.momomoRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.momomoRepo.save(e), message: 'تم التحديث' };
  }
  async deleteMomomo(id: number) {
    await this.momomoRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── MRCZET ───
  async getMrczet(skip=0, take=50) {
    const [data, total] = await this.mrczetRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createMrczet(dto: any) {
    return { data: await this.mrczetRepo.save(this.mrczetRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateMrczet(id: number, dto: any) {
    const e = await this.mrczetRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.mrczetRepo.save(e), message: 'تم التحديث' };
  }
  async deleteMrczet(id: number) {
    await this.mrczetRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── MSC ───
  async getMsc(skip=0, take=50) {
    const [data, total] = await this.mscRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createMsc(dto: any) {
    return { data: await this.mscRepo.save(this.mscRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateMsc(id: number, dto: any) {
    const e = await this.mscRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.mscRepo.save(e), message: 'تم التحديث' };
  }
  async deleteMsc(id: number) {
    await this.mscRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── MSRIF ───
  async getMsrif(skip=0, take=50) {
    const [data, total] = await this.msrifRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createMsrif(dto: any) {
    return { data: await this.msrifRepo.save(this.msrifRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateMsrif(id: number, dto: any) {
    const e = await this.msrifRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.msrifRepo.save(e), message: 'تم التحديث' };
  }
  async deleteMsrif(id: number) {
    await this.msrifRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── MV ───
  async getMv(skip=0, take=50) {
    const [data, total] = await this.mvRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createMv(dto: any) {
    return { data: await this.mvRepo.save(this.mvRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateMv(id: number, dto: any) {
    const e = await this.mvRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.mvRepo.save(e), message: 'تم التحديث' };
  }
  async deleteMv(id: number) {
    await this.mvRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── MVALL ───
  async getMvall(skip=0, take=50) {
    const [data, total] = await this.mvallRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createMvall(dto: any) {
    return { data: await this.mvallRepo.save(this.mvallRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateMvall(id: number, dto: any) {
    const e = await this.mvallRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.mvallRepo.save(e), message: 'تم التحديث' };
  }
  async deleteMvall(id: number) {
    await this.mvallRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── MZT ───
  async getMzt(skip=0, take=50) {
    const [data, total] = await this.mztRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createMzt(dto: any) {
    return { data: await this.mztRepo.save(this.mztRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateMzt(id: number, dto: any) {
    const e = await this.mztRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.mztRepo.save(e), message: 'تم التحديث' };
  }
  async deleteMzt(id: number) {
    await this.mztRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── NOK ───
  async getNok(skip=0, take=50) {
    const [data, total] = await this.nokRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createNok(dto: any) {
    return { data: await this.nokRepo.save(this.nokRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateNok(id: number, dto: any) {
    const e = await this.nokRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.nokRepo.save(e), message: 'تم التحديث' };
  }
  async deleteNok(id: number) {
    await this.nokRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── NSDK2 ───
  async getNsdk2(skip=0, take=50) {
    const [data, total] = await this.nsdk2Repo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createNsdk2(dto: any) {
    return { data: await this.nsdk2Repo.save(this.nsdk2Repo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateNsdk2(id: number, dto: any) {
    const e = await this.nsdk2Repo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.nsdk2Repo.save(e), message: 'تم التحديث' };
  }
  async deleteNsdk2(id: number) {
    await this.nsdk2Repo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── NURS ───
  async getNurs(skip=0, take=50) {
    const [data, total] = await this.nursRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createNurs(dto: any) {
    return { data: await this.nursRepo.save(this.nursRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateNurs(id: number, dto: any) {
    const e = await this.nursRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.nursRepo.save(e), message: 'تم التحديث' };
  }
  async deleteNurs(id: number) {
    await this.nursRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── PRG ───
  async getPrg(skip=0, take=50) {
    const [data, total] = await this.prgRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createPrg(dto: any) {
    return { data: await this.prgRepo.save(this.prgRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updatePrg(id: number, dto: any) {
    const e = await this.prgRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.prgRepo.save(e), message: 'تم التحديث' };
  }
  async deletePrg(id: number) {
    await this.prgRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── RED ───
  async getRed(skip=0, take=50) {
    const [data, total] = await this.redRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createRed(dto: any) {
    return { data: await this.redRepo.save(this.redRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateRed(id: number, dto: any) {
    const e = await this.redRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.redRepo.save(e), message: 'تم التحديث' };
  }
  async deleteRed(id: number) {
    await this.redRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── REDMMM ───
  async getRedmmm(skip=0, take=50) {
    const [data, total] = await this.redmmmRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createRedmmm(dto: any) {
    return { data: await this.redmmmRepo.save(this.redmmmRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateRedmmm(id: number, dto: any) {
    const e = await this.redmmmRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.redmmmRepo.save(e), message: 'تم التحديث' };
  }
  async deleteRedmmm(id: number) {
    await this.redmmmRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── REDMMMD ───
  async getRedmmmd(skip=0, take=50) {
    const [data, total] = await this.redmmmdRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createRedmmmd(dto: any) {
    return { data: await this.redmmmdRepo.save(this.redmmmdRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateRedmmmd(id: number, dto: any) {
    const e = await this.redmmmdRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.redmmmdRepo.save(e), message: 'تم التحديث' };
  }
  async deleteRedmmmd(id: number) {
    await this.redmmmdRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── REDMMT ───
  async getRedmmt(skip=0, take=50) {
    const [data, total] = await this.redmmtRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createRedmmt(dto: any) {
    return { data: await this.redmmtRepo.save(this.redmmtRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateRedmmt(id: number, dto: any) {
    const e = await this.redmmtRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.redmmtRepo.save(e), message: 'تم التحديث' };
  }
  async deleteRedmmt(id: number) {
    await this.redmmtRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── REDMMW ───
  async getRedmmw(skip=0, take=50) {
    const [data, total] = await this.redmmwRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createRedmmw(dto: any) {
    return { data: await this.redmmwRepo.save(this.redmmwRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateRedmmw(id: number, dto: any) {
    const e = await this.redmmwRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.redmmwRepo.save(e), message: 'تم التحديث' };
  }
  async deleteRedmmw(id: number) {
    await this.redmmwRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── REDMMW2 ───
  async getRedmmw2(skip=0, take=50) {
    const [data, total] = await this.redmmw2Repo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createRedmmw2(dto: any) {
    return { data: await this.redmmw2Repo.save(this.redmmw2Repo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateRedmmw2(id: number, dto: any) {
    const e = await this.redmmw2Repo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.redmmw2Repo.save(e), message: 'تم التحديث' };
  }
  async deleteRedmmw2(id: number) {
    await this.redmmw2Repo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── REDMMW2D ───
  async getRedmmw2d(skip=0, take=50) {
    const [data, total] = await this.redmmw2dRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createRedmmw2d(dto: any) {
    return { data: await this.redmmw2dRepo.save(this.redmmw2dRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateRedmmw2d(id: number, dto: any) {
    const e = await this.redmmw2dRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.redmmw2dRepo.save(e), message: 'تم التحديث' };
  }
  async deleteRedmmw2d(id: number) {
    await this.redmmw2dRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── REDMMWD ───
  async getRedmmwd(skip=0, take=50) {
    const [data, total] = await this.redmmwdRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createRedmmwd(dto: any) {
    return { data: await this.redmmwdRepo.save(this.redmmwdRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateRedmmwd(id: number, dto: any) {
    const e = await this.redmmwdRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.redmmwdRepo.save(e), message: 'تم التحديث' };
  }
  async deleteRedmmwd(id: number) {
    await this.redmmwdRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── REDMMZ ───
  async getRedmmz(skip=0, take=50) {
    const [data, total] = await this.redmmzRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createRedmmz(dto: any) {
    return { data: await this.redmmzRepo.save(this.redmmzRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateRedmmz(id: number, dto: any) {
    const e = await this.redmmzRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.redmmzRepo.save(e), message: 'تم التحديث' };
  }
  async deleteRedmmz(id: number) {
    await this.redmmzRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── REDMT ───
  async getRedmt(skip=0, take=50) {
    const [data, total] = await this.redmtRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createRedmt(dto: any) {
    return { data: await this.redmtRepo.save(this.redmtRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateRedmt(id: number, dto: any) {
    const e = await this.redmtRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.redmtRepo.save(e), message: 'تم التحديث' };
  }
  async deleteRedmt(id: number) {
    await this.redmtRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── REDMW ───
  async getRedmw(skip=0, take=50) {
    const [data, total] = await this.redmwRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createRedmw(dto: any) {
    return { data: await this.redmwRepo.save(this.redmwRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateRedmw(id: number, dto: any) {
    const e = await this.redmwRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.redmwRepo.save(e), message: 'تم التحديث' };
  }
  async deleteRedmw(id: number) {
    await this.redmwRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── REDMWX ───
  async getRedmwx(skip=0, take=50) {
    const [data, total] = await this.redmwxRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createRedmwx(dto: any) {
    return { data: await this.redmwxRepo.save(this.redmwxRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateRedmwx(id: number, dto: any) {
    const e = await this.redmwxRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.redmwxRepo.save(e), message: 'تم التحديث' };
  }
  async deleteRedmwx(id: number) {
    await this.redmwxRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── REDMZ ───
  async getRedmz(skip=0, take=50) {
    const [data, total] = await this.redmzRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createRedmz(dto: any) {
    return { data: await this.redmzRepo.save(this.redmzRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateRedmz(id: number, dto: any) {
    const e = await this.redmzRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.redmzRepo.save(e), message: 'تم التحديث' };
  }
  async deleteRedmz(id: number) {
    await this.redmzRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── REDP ───
  async getRedp(skip=0, take=50) {
    const [data, total] = await this.redpRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createRedp(dto: any) {
    return { data: await this.redpRepo.save(this.redpRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateRedp(id: number, dto: any) {
    const e = await this.redpRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.redpRepo.save(e), message: 'تم التحديث' };
  }
  async deleteRedp(id: number) {
    await this.redpRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── RED_EX ───
  async getRedEx(skip=0, take=50) {
    const [data, total] = await this.redExRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createRedEx(dto: any) {
    return { data: await this.redExRepo.save(this.redExRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateRedEx(id: number, dto: any) {
    const e = await this.redExRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.redExRepo.save(e), message: 'تم التحديث' };
  }
  async deleteRedEx(id: number) {
    await this.redExRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── REPALL ───
  async getRepall(skip=0, take=50) {
    const [data, total] = await this.repallRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createRepall(dto: any) {
    return { data: await this.repallRepo.save(this.repallRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateRepall(id: number, dto: any) {
    const e = await this.repallRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.repallRepo.save(e), message: 'تم التحديث' };
  }
  async deleteRepall(id: number) {
    await this.repallRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── REPAMP ───
  async getRepamp(skip=0, take=50) {
    const [data, total] = await this.repampRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createRepamp(dto: any) {
    return { data: await this.repampRepo.save(this.repampRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateRepamp(id: number, dto: any) {
    const e = await this.repampRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.repampRepo.save(e), message: 'تم التحديث' };
  }
  async deleteRepamp(id: number) {
    await this.repampRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── REPKHM ───
  async getRepkhm(skip=0, take=50) {
    const [data, total] = await this.repkhmRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createRepkhm(dto: any) {
    return { data: await this.repkhmRepo.save(this.repkhmRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateRepkhm(id: number, dto: any) {
    const e = await this.repkhmRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.repkhmRepo.save(e), message: 'تم التحديث' };
  }
  async deleteRepkhm(id: number) {
    await this.repkhmRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── REPKHXXX ───
  async getRepkhxxx(skip=0, take=50) {
    const [data, total] = await this.repkhxxxRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createRepkhxxx(dto: any) {
    return { data: await this.repkhxxxRepo.save(this.repkhxxxRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateRepkhxxx(id: number, dto: any) {
    const e = await this.repkhxxxRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.repkhxxxRepo.save(e), message: 'تم التحديث' };
  }
  async deleteRepkhxxx(id: number) {
    await this.repkhxxxRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── REPMSM ───
  async getRepmsm(skip=0, take=50) {
    const [data, total] = await this.repmsmRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createRepmsm(dto: any) {
    return { data: await this.repmsmRepo.save(this.repmsmRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateRepmsm(id: number, dto: any) {
    const e = await this.repmsmRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.repmsmRepo.save(e), message: 'تم التحديث' };
  }
  async deleteRepmsm(id: number) {
    await this.repmsmRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── REPRORH ───
  async getReprorh(skip=0, take=50) {
    const [data, total] = await this.reprorhRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createReprorh(dto: any) {
    return { data: await this.reprorhRepo.save(this.reprorhRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateReprorh(id: number, dto: any) {
    const e = await this.reprorhRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.reprorhRepo.save(e), message: 'تم التحديث' };
  }
  async deleteReprorh(id: number) {
    await this.reprorhRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── RTF_AB ───
  async getRtfAb(skip=0, take=50) {
    const [data, total] = await this.rtfAbRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createRtfAb(dto: any) {
    return { data: await this.rtfAbRepo.save(this.rtfAbRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateRtfAb(id: number, dto: any) {
    const e = await this.rtfAbRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.rtfAbRepo.save(e), message: 'تم التحديث' };
  }
  async deleteRtfAb(id: number) {
    await this.rtfAbRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── RT_AB ───
  async getRtAb(skip=0, take=50) {
    const [data, total] = await this.rtAbRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createRtAb(dto: any) {
    return { data: await this.rtAbRepo.save(this.rtAbRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateRtAb(id: number, dto: any) {
    const e = await this.rtAbRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.rtAbRepo.save(e), message: 'تم التحديث' };
  }
  async deleteRtAb(id: number) {
    await this.rtAbRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── SARSH ───
  async getSarsh(skip=0, take=50) {
    const [data, total] = await this.sarshRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createSarsh(dto: any) {
    return { data: await this.sarshRepo.save(this.sarshRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateSarsh(id: number, dto: any) {
    const e = await this.sarshRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.sarshRepo.save(e), message: 'تم التحديث' };
  }
  async deleteSarsh(id: number) {
    await this.sarshRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── SENDSMS ───
  async getSendsms(skip=0, take=50) {
    const [data, total] = await this.sendsmsRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createSendsms(dto: any) {
    return { data: await this.sendsmsRepo.save(this.sendsmsRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateSendsms(id: number, dto: any) {
    const e = await this.sendsmsRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.sendsmsRepo.save(e), message: 'تم التحديث' };
  }
  async deleteSendsms(id: number) {
    await this.sendsmsRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── SENDSMS_S ───
  async getSendsmsS(skip=0, take=50) {
    const [data, total] = await this.sendsmsSRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createSendsmsS(dto: any) {
    return { data: await this.sendsmsSRepo.save(this.sendsmsSRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateSendsmsS(id: number, dto: any) {
    const e = await this.sendsmsSRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.sendsmsSRepo.save(e), message: 'تم التحديث' };
  }
  async deleteSendsmsS(id: number) {
    await this.sendsmsSRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── SNDK22 ───
  async getSndk22(skip=0, take=50) {
    const [data, total] = await this.sndk22Repo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createSndk22(dto: any) {
    return { data: await this.sndk22Repo.save(this.sndk22Repo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateSndk22(id: number, dto: any) {
    const e = await this.sndk22Repo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.sndk22Repo.save(e), message: 'تم التحديث' };
  }
  async deleteSndk22(id: number) {
    await this.sndk22Repo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── SNDKNETF ───
  async getSndknetf(skip=0, take=50) {
    const [data, total] = await this.sndknetfRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createSndknetf(dto: any) {
    return { data: await this.sndknetfRepo.save(this.sndknetfRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateSndknetf(id: number, dto: any) {
    const e = await this.sndknetfRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.sndknetfRepo.save(e), message: 'تم التحديث' };
  }
  async deleteSndknetf(id: number) {
    await this.sndknetfRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── SNDKO ───
  async getSndko(skip=0, take=50) {
    const [data, total] = await this.sndkoRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createSndko(dto: any) {
    return { data: await this.sndkoRepo.save(this.sndkoRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateSndko(id: number, dto: any) {
    const e = await this.sndkoRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.sndkoRepo.save(e), message: 'تم التحديث' };
  }
  async deleteSndko(id: number) {
    await this.sndkoRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── SNDKOF ───
  async getSndkof(skip=0, take=50) {
    const [data, total] = await this.sndkofRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createSndkof(dto: any) {
    return { data: await this.sndkofRepo.save(this.sndkofRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateSndkof(id: number, dto: any) {
    const e = await this.sndkofRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.sndkofRepo.save(e), message: 'تم التحديث' };
  }
  async deleteSndkof(id: number) {
    await this.sndkofRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── SNDKRS ───
  async getSndkrs(skip=0, take=50) {
    const [data, total] = await this.sndkrsRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createSndkrs(dto: any) {
    return { data: await this.sndkrsRepo.save(this.sndkrsRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateSndkrs(id: number, dto: any) {
    const e = await this.sndkrsRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.sndkrsRepo.save(e), message: 'تم التحديث' };
  }
  async deleteSndkrs(id: number) {
    await this.sndkrsRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── SNDKSN ───
  async getSndksn(skip=0, take=50) {
    const [data, total] = await this.sndksnRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createSndksn(dto: any) {
    return { data: await this.sndksnRepo.save(this.sndksnRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateSndksn(id: number, dto: any) {
    const e = await this.sndksnRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.sndksnRepo.save(e), message: 'تم التحديث' };
  }
  async deleteSndksn(id: number) {
    await this.sndksnRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── SNDKSNF ───
  async getSndksnf(skip=0, take=50) {
    const [data, total] = await this.sndksnfRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createSndksnf(dto: any) {
    return { data: await this.sndksnfRepo.save(this.sndksnfRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateSndksnf(id: number, dto: any) {
    const e = await this.sndksnfRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.sndksnfRepo.save(e), message: 'تم التحديث' };
  }
  async deleteSndksnf(id: number) {
    await this.sndksnfRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── SNDK_A ───
  async getSndkA(skip=0, take=50) {
    const [data, total] = await this.sndkARepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createSndkA(dto: any) {
    return { data: await this.sndkARepo.save(this.sndkARepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateSndkA(id: number, dto: any) {
    const e = await this.sndkARepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.sndkARepo.save(e), message: 'تم التحديث' };
  }
  async deleteSndkA(id: number) {
    await this.sndkARepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── SNDS22 ───
  async getSnds22(skip=0, take=50) {
    const [data, total] = await this.snds22Repo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createSnds22(dto: any) {
    return { data: await this.snds22Repo.save(this.snds22Repo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateSnds22(id: number, dto: any) {
    const e = await this.snds22Repo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.snds22Repo.save(e), message: 'تم التحديث' };
  }
  async deleteSnds22(id: number) {
    await this.snds22Repo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── THOEL ───
  async getThoel(skip=0, take=50) {
    const [data, total] = await this.thoelRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createThoel(dto: any) {
    return { data: await this.thoelRepo.save(this.thoelRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateThoel(id: number, dto: any) {
    const e = await this.thoelRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.thoelRepo.save(e), message: 'تم التحديث' };
  }
  async deleteThoel(id: number) {
    await this.thoelRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── TR ───
  async getTr(skip=0, take=50) {
    const [data, total] = await this.trRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createTr(dto: any) {
    return { data: await this.trRepo.save(this.trRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateTr(id: number, dto: any) {
    const e = await this.trRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.trRepo.save(e), message: 'تم التحديث' };
  }
  async deleteTr(id: number) {
    await this.trRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── TRH ───
  async getTrh(skip=0, take=50) {
    const [data, total] = await this.trhRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createTrh(dto: any) {
    return { data: await this.trhRepo.save(this.trhRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateTrh(id: number, dto: any) {
    const e = await this.trhRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.trhRepo.save(e), message: 'تم التحديث' };
  }
  async deleteTrh(id: number) {
    await this.trhRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── TRMB ───
  async getTrmb(skip=0, take=50) {
    const [data, total] = await this.trmbRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createTrmb(dto: any) {
    return { data: await this.trmbRepo.save(this.trmbRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateTrmb(id: number, dto: any) {
    const e = await this.trmbRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.trmbRepo.save(e), message: 'تم التحديث' };
  }
  async deleteTrmb(id: number) {
    await this.trmbRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── TSSN ───
  async getTssn(skip=0, take=50) {
    const [data, total] = await this.tssnRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createTssn(dto: any) {
    return { data: await this.tssnRepo.save(this.tssnRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateTssn(id: number, dto: any) {
    const e = await this.tssnRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.tssnRepo.save(e), message: 'تم التحديث' };
  }
  async deleteTssn(id: number) {
    await this.tssnRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── TSSNF ───
  async getTssnf(skip=0, take=50) {
    const [data, total] = await this.tssnfRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createTssnf(dto: any) {
    return { data: await this.tssnfRepo.save(this.tssnfRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateTssnf(id: number, dto: any) {
    const e = await this.tssnfRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.tssnfRepo.save(e), message: 'تم التحديث' };
  }
  async deleteTssnf(id: number) {
    await this.tssnfRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── TSSX ───
  async getTssx(skip=0, take=50) {
    const [data, total] = await this.tssxRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createTssx(dto: any) {
    return { data: await this.tssxRepo.save(this.tssxRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateTssx(id: number, dto: any) {
    const e = await this.tssxRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.tssxRepo.save(e), message: 'تم التحديث' };
  }
  async deleteTssx(id: number) {
    await this.tssxRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── TSSX2 ───
  async getTssx2(skip=0, take=50) {
    const [data, total] = await this.tssx2Repo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createTssx2(dto: any) {
    return { data: await this.tssx2Repo.save(this.tssx2Repo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateTssx2(id: number, dto: any) {
    const e = await this.tssx2Repo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.tssx2Repo.save(e), message: 'تم التحديث' };
  }
  async deleteTssx2(id: number) {
    await this.tssx2Repo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── TTEL ───
  async getTtel(skip=0, take=50) {
    const [data, total] = await this.ttelRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createTtel(dto: any) {
    return { data: await this.ttelRepo.save(this.ttelRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateTtel(id: number, dto: any) {
    const e = await this.ttelRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.ttelRepo.save(e), message: 'تم التحديث' };
  }
  async deleteTtel(id: number) {
    await this.ttelRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── TYHT ───
  async getTyht(skip=0, take=50) {
    const [data, total] = await this.tyhtRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createTyht(dto: any) {
    return { data: await this.tyhtRepo.save(this.tyhtRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateTyht(id: number, dto: any) {
    const e = await this.tyhtRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.tyhtRepo.save(e), message: 'تم التحديث' };
  }
  async deleteTyht(id: number) {
    await this.tyhtRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── TYPEMS ───
  async getTypems(skip=0, take=50) {
    const [data, total] = await this.typemsRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createTypems(dto: any) {
    return { data: await this.typemsRepo.save(this.typemsRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateTypems(id: number, dto: any) {
    const e = await this.typemsRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.typemsRepo.save(e), message: 'تم التحديث' };
  }
  async deleteTypems(id: number) {
    await this.typemsRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── TY_MS ───
  async getTyMs(skip=0, take=50) {
    const [data, total] = await this.tyMsRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createTyMs(dto: any) {
    return { data: await this.tyMsRepo.save(this.tyMsRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateTyMs(id: number, dto: any) {
    const e = await this.tyMsRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.tyMsRepo.save(e), message: 'تم التحديث' };
  }
  async deleteTyMs(id: number) {
    await this.tyMsRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── T_R_T ───
  async getTRT(skip=0, take=50) {
    const [data, total] = await this.tRTRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createTRT(dto: any) {
    return { data: await this.tRTRepo.save(this.tRTRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateTRT(id: number, dto: any) {
    const e = await this.tRTRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.tRTRepo.save(e), message: 'تم التحديث' };
  }
  async deleteTRT(id: number) {
    await this.tRTRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── USERGN ───
  async getUsergn(skip=0, take=50) {
    const [data, total] = await this.usergnRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createUsergn(dto: any) {
    return { data: await this.usergnRepo.save(this.usergnRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateUsergn(id: number, dto: any) {
    const e = await this.usergnRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.usergnRepo.save(e), message: 'تم التحديث' };
  }
  async deleteUsergn(id: number) {
    await this.usergnRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── USER_MNATK ───
  async getUserMnatk(skip=0, take=50) {
    const [data, total] = await this.userMnatkRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createUserMnatk(dto: any) {
    return { data: await this.userMnatkRepo.save(this.userMnatkRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateUserMnatk(id: number, dto: any) {
    const e = await this.userMnatkRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.userMnatkRepo.save(e), message: 'تم التحديث' };
  }
  async deleteUserMnatk(id: number) {
    await this.userMnatkRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── USER_R ───
  async getUserR(skip=0, take=50) {
    const [data, total] = await this.userRRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createUserR(dto: any) {
    return { data: await this.userRRepo.save(this.userRRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateUserR(id: number, dto: any) {
    const e = await this.userRRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.userRRepo.save(e), message: 'تم التحديث' };
  }
  async deleteUserR(id: number) {
    await this.userRRepo.delete(id);
    return { message: 'تم الحذف' };
  }

  // ─── YS ───
  async getYs(skip=0, take=50) {
    const [data, total] = await this.ysRepo.findAndCount({ skip, take, order: { id: 'DESC' } });
    return { data, totalCount: total };
  }
  async createYs(dto: any) {
    return { data: await this.ysRepo.save(this.ysRepo.create(dto)), message: 'تم الإنشاء' };
  }
  async updateYs(id: number, dto: any) {
    const e = await this.ysRepo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('غير موجود');
    Object.assign(e, dto);
    return { data: await this.ysRepo.save(e), message: 'تم التحديث' };
  }
  async deleteYs(id: number) {
    await this.ysRepo.delete(id);
    return { message: 'تم الحذف' };
  }
}
