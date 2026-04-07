// =============================================
// وحدة الجداول المتبقية
// =============================================
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LegacyService } from './legacy.service';
import { LegacyController } from './legacy.controller';
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

@Module({
  imports: [TypeOrmModule.forFeature([
    AddtbEntity,
    AhtsrEntity,
    AkdEntity,
    AkfafEntity,
    AkyEntity,
    AmrgrpEntity,
    ArshfEntity,
    ArsrffEntity,
    AGEntity,
    CarEntity,
    DarEntity,
    DataffffEntity,
    DataffxEntity,
    DatafxEntity,
    DatafyEntity,
    DatakYearNEntity,
    DatanetEntity,
    DataArEntity,
    DataSnEntity,
    DelREntity,
    FatbfxEntity,
    FinEntity,
    FslsdadEntity,
    FslsdadmsEntity,
    HmhEntity,
    KshEntity,
    KydEntity,
    LovAaEntity,
    MatEntity,
    MemoprEntity,
    MkbEntity,
    Mkb2Entity,
    MmshEntity,
    MolEntity,
    MolfEntity,
    MomomoEntity,
    MrczetEntity,
    MscEntity,
    MsrifEntity,
    MvEntity,
    MvallEntity,
    MztEntity,
    NokEntity,
    Nsdk2Entity,
    NursEntity,
    PrgEntity,
    RedEntity,
    RedmmmEntity,
    RedmmmdEntity,
    RedmmtEntity,
    RedmmwEntity,
    Redmmw2Entity,
    Redmmw2dEntity,
    RedmmwdEntity,
    RedmmzEntity,
    RedmtEntity,
    RedmwEntity,
    RedmwxEntity,
    RedmzEntity,
    RedpEntity,
    RedExEntity,
    RepallEntity,
    RepampEntity,
    RepkhmEntity,
    RepkhxxxEntity,
    RepmsmEntity,
    ReprorhEntity,
    RtfAbEntity,
    RtAbEntity,
    SarshEntity,
    SendsmsEntity,
    SendsmsSEntity,
    Sndk22Entity,
    SndknetfEntity,
    SndkoEntity,
    SndkofEntity,
    SndkrsEntity,
    SndksnEntity,
    SndksnfEntity,
    SndkAEntity,
    Snds22Entity,
    ThoelEntity,
    TrEntity,
    TrhEntity,
    TrmbEntity,
    TssnEntity,
    TssnfEntity,
    TssxEntity,
    Tssx2Entity,
    TtelEntity,
    TyhtEntity,
    TypemsEntity,
    TyMsEntity,
    TRTEntity,
    UsergnEntity,
    UserMnatkEntity,
    UserREntity,
    YsEntity,
  ])],
  controllers: [LegacyController],
  providers: [LegacyService],
  exports: [LegacyService],
})
export class LegacyModule {}
