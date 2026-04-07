// =============================================
// كيانات الجداول المتبقية - مولّدة تلقائياً من DATASOG.Dmp
// Oracle Export V10.02.01 → TypeORM Entities
// 98 جدول إضافي
// =============================================
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('addtb')
export class AddtbEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nog', type: 'int', nullable: true }) nog: number;
  @Column({ name: 'noadd', type: 'int', nullable: true }) noadd: number;
}

@Entity('ahtsr')
export class AhtsrEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'aht', type: 'varchar', length: 3, nullable: true }) aht: string;
  @Column({ name: 'baht', type: 'varchar', length: 50, nullable: true }) baht: string;
  @Column({ name: 'bahtb', type: 'varchar', length: 50, nullable: true }) bahtb: string;
}

@Entity('akd')
export class AkdEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nor', type: 'int', nullable: true }) nor: number;
  @Column({ name: 'tno', type: 'varchar', length: 300, nullable: true }) tno: string;
}

@Entity('akfaf')
export class AkfafEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'amlh', type: 'int', nullable: true }) amlh: number;
  @Column({ name: 'rsedhy', type: 'decimal', precision: 14, scale: 2, nullable: true }) rsedhy: number;
  @Column({ name: 'rsedha', type: 'decimal', precision: 14, scale: 2, nullable: true }) rsedha: number;
  @Column({ name: 'sars', type: 'decimal', precision: 7, scale: 2, nullable: true }) sars: number;
  @Column({ name: 'fark', type: 'decimal', precision: 14, scale: 2, nullable: true }) fark: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'rsedhyb', type: 'decimal', precision: 14, scale: 2, nullable: true }) rsedhyb: number;
  @Column({ name: 'recno', type: 'int', nullable: true }) recno: number;
  @Column({ name: 'ty', type: 'int', nullable: true }) ty: number;
}

@Entity('aky')
export class AkyEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noky', type: 'int', nullable: true }) noky: number;
  @Column({ name: 'nokt', type: 'int', nullable: true }) nokt: number;
  @Column({ name: 'rh', type: 'decimal', precision: 14, scale: 2, nullable: true }) rh: number;
  @Column({ name: 'noar', type: 'int', nullable: true }) noar: number;
}

@Entity('amrgrp')
export class AmrgrpEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noz', type: 'int', nullable: true }) noz: number;
  @Column({ name: 'nog', type: 'int', nullable: true }) nog: number;
}

@Entity('arshf')
export class ArshfEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'yorzn', type: 'int', nullable: true }) yorzn: number;
  @Column({ name: 'yorzc', type: 'varchar', length: 15, nullable: true }) yorzc: string;
  @Column({ name: 'onof', type: 'int', nullable: true }) onof: number;
}

@Entity('arsrff')
export class ArsrffEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'noan', type: 'int', nullable: true }) noan: number;
  @Column({ name: 'kma', type: 'decimal', precision: 14, scale: 2, nullable: true }) kma: number;
  @Column({ name: 'memos', type: 'varchar', length: 50, nullable: true }) memos: string;
  @Column({ name: 'recno', type: 'int', nullable: true }) recno: number;
  @Column({ name: 'totl', type: 'decimal', precision: 14, scale: 2, nullable: true }) totl: number;
  @Column({ name: 'sara', type: 'decimal', precision: 10, scale: 2, nullable: true }) sara: number;
  @Column({ name: 'upd', type: 'int', nullable: true }) upd: number;
  @Column({ name: 'noz', type: 'int', nullable: true }) noz: number;
}

@Entity('a_g')
export class AGEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nom', type: 'int', nullable: true }) nom: number;
  @Column({ name: 'namem', type: 'varchar', length: 100, nullable: true }) namem: string;
}

@Entity('car')
export class CarEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'no', type: 'int', nullable: true }) no: number;
  @Column({ name: 'name', type: 'varchar', length: 50, nullable: true }) name: string;
  @Column({ name: 'hl', type: 'int', nullable: true }) hl: number;
}

@Entity('dar')
export class DarEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noaddr', type: 'int', nullable: true }) noaddr: number;
  @Column({ name: 'tola', type: 'decimal', precision: 7, scale: 2, nullable: true }) tola: number;
  @Column({ name: 'fkrs', type: 'decimal', precision: 10, scale: 2, nullable: true }) fkrs: number;
  @Column({ name: 'fkmt', type: 'decimal', precision: 10, scale: 2, nullable: true }) fkmt: number;
  @Column({ name: 'redadd', type: 'decimal', precision: 15, scale: 2, nullable: true }) redadd: number;
}

@Entity('dataffff')
export class DataffffEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nof', type: 'int', nullable: true }) nof: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'dates2', type: 'date', nullable: true }) dates2: Date;
  @Column({ name: 'mt', type: 'decimal', precision: 10, scale: 2, nullable: true }) mt: number;
  @Column({ name: 'ks', type: 'decimal', precision: 14, scale: 2, nullable: true }) ks: number;
  @Column({ name: 'kh', type: 'decimal', precision: 14, scale: 2, nullable: true }) kh: number;
  @Column({ name: 'ast', type: 'decimal', precision: 14, scale: 2, nullable: true }) ast: number;
  @Column({ name: 'sk', type: 'decimal', precision: 7, scale: 2, nullable: true }) sk: number;
  @Column({ name: 'hd', type: 'int', nullable: true }) hd: number;
  @Column({ name: 'net', type: 'decimal', precision: 14, scale: 2, nullable: true }) net: number;
  @Column({ name: 'netc', type: 'varchar', length: 500, nullable: true }) netc: string;
  @Column({ name: 'md', type: 'decimal', precision: 10, scale: 2, nullable: true }) md: number;
  @Column({ name: 'aml', type: 'int', nullable: true }) aml: number;
  @Column({ name: 'sars', type: 'decimal', precision: 7, scale: 2, nullable: true }) sars: number;
  @Column({ name: 'kast', type: 'decimal', precision: 14, scale: 2, nullable: true }) kast: number;
}

@Entity('dataffx')
export class DataffxEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'noaon', type: 'int', nullable: true }) noaon: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'recno', type: 'int', nullable: true }) recno: number;
  @Column({ name: 'nosm', type: 'int', nullable: true }) nosm: number;
  @Column({ name: 'nokb', type: 'int', nullable: true }) nokb: number;
  @Column({ name: 'ks', type: 'decimal', precision: 11, scale: 2, nullable: true }) ks: number;
  @Column({ name: 'kh', type: 'decimal', precision: 11, scale: 2, nullable: true }) kh: number;
  @Column({ name: 'ast', type: 'decimal', precision: 9, scale: 2, nullable: true }) ast: number;
  @Column({ name: 'sk', type: 'int', nullable: true }) sk: number;
  @Column({ name: 'kast', type: 'decimal', precision: 10, scale: 2, nullable: true }) kast: number;
  @Column({ name: 'hd', type: 'int', nullable: true }) hd: number;
  @Column({ name: 'mt', type: 'decimal', precision: 10, scale: 2, nullable: true }) mt: number;
  @Column({ name: 'md', type: 'decimal', precision: 10, scale: 2, nullable: true }) md: number;
  @Column({ name: 'dates2', type: 'date', nullable: true }) dates2: Date;
  @Column({ name: 'kasb', type: 'decimal', precision: 11, scale: 2, nullable: true }) kasb: number;
  @Column({ name: 'memoa', type: 'varchar', length: 100, nullable: true }) memoa: string;
  @Column({ name: 'hast', type: 'int', nullable: true }) hast: number;
  @Column({ name: 'asts', type: 'decimal', precision: 9, scale: 2, nullable: true }) asts: number;
  @Column({ name: 'noaddn', type: 'int', nullable: true }) noaddn: number;
  @Column({ name: 'sksb', type: 'int', nullable: true }) sksb: number;
  @Column({ name: 'frkas', type: 'decimal', precision: 10, scale: 2, nullable: true }) frkas: number;
  @Column({ name: 'skm', type: 'int', nullable: true }) skm: number;
  @Column({ name: 'skfm', type: 'int', nullable: true }) skfm: number;
  @Column({ name: 'nofat', type: 'int', nullable: true }) nofat: number;
  @Column({ name: 'rmg', type: 'int', nullable: true }) rmg: number;
  @Column({ name: 'krmg', type: 'decimal', precision: 10, scale: 2, nullable: true }) krmg: number;
  @Column({ name: 'nofsl', type: 'int', nullable: true }) nofsl: number;
  @Column({ name: 'kasd', type: 'int', nullable: true }) kasd: number;
  @Column({ name: 'month', type: 'int', nullable: true }) month: number;
  @Column({ name: 'kmsn', type: 'int', nullable: true }) kmsn: number;
  @Column({ name: 'sn', type: 'int', nullable: true }) sn: number;
  @Column({ name: 'frsn', type: 'decimal', precision: 10, scale: 2, nullable: true }) frsn: number;
  @Column({ name: 'rtr', type: 'decimal', precision: 10, scale: 2, nullable: true }) rtr: number;
  @Column({ name: 'msgg', type: 'int', nullable: true }) msgg: number;
}

@Entity('datafx')
export class DatafxEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'noson', type: 'int', nullable: true }) noson: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'dates2', type: 'date', nullable: true }) dates2: Date;
  @Column({ name: 'nms', type: 'varchar', length: 30, nullable: true }) nms: string;
  @Column({ name: 'ska', type: 'int', nullable: true }) ska: number;
  @Column({ name: 'skh', type: 'int', nullable: true }) skh: number;
  @Column({ name: 'skfa', type: 'int', nullable: true }) skfa: number;
  @Column({ name: 'dateb', type: 'date', nullable: true }) dateb: Date;
  @Column({ name: 'month', type: 'int', nullable: true }) month: number;
  @Column({ name: 'skasn', type: 'int', nullable: true }) skasn: number;
}

@Entity('datafy')
export class DatafyEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'noaon', type: 'int', nullable: true }) noaon: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'recno', type: 'int', nullable: true }) recno: number;
  @Column({ name: 'nosm', type: 'int', nullable: true }) nosm: number;
  @Column({ name: 'nokb', type: 'int', nullable: true }) nokb: number;
  @Column({ name: 'ks', type: 'decimal', precision: 11, scale: 2, nullable: true }) ks: number;
  @Column({ name: 'kh', type: 'decimal', precision: 11, scale: 2, nullable: true }) kh: number;
  @Column({ name: 'ast', type: 'decimal', precision: 9, scale: 2, nullable: true }) ast: number;
  @Column({ name: 'sk', type: 'int', nullable: true }) sk: number;
  @Column({ name: 'kast', type: 'decimal', precision: 10, scale: 2, nullable: true }) kast: number;
  @Column({ name: 'hd', type: 'int', nullable: true }) hd: number;
  @Column({ name: 'mt', type: 'decimal', precision: 10, scale: 2, nullable: true }) mt: number;
  @Column({ name: 'md', type: 'decimal', precision: 10, scale: 2, nullable: true }) md: number;
  @Column({ name: 'dates2', type: 'date', nullable: true }) dates2: Date;
  @Column({ name: 'kasb', type: 'decimal', precision: 11, scale: 2, nullable: true }) kasb: number;
  @Column({ name: 'memoa', type: 'varchar', length: 100, nullable: true }) memoa: string;
  @Column({ name: 'hast', type: 'int', nullable: true }) hast: number;
  @Column({ name: 'asts', type: 'decimal', precision: 9, scale: 2, nullable: true }) asts: number;
  @Column({ name: 'noaddn', type: 'int', nullable: true }) noaddn: number;
  @Column({ name: 'sksb', type: 'int', nullable: true }) sksb: number;
  @Column({ name: 'frkas', type: 'decimal', precision: 10, scale: 2, nullable: true }) frkas: number;
  @Column({ name: 'skm', type: 'int', nullable: true }) skm: number;
  @Column({ name: 'skfm', type: 'int', nullable: true }) skfm: number;
  @Column({ name: 'nofat', type: 'int', nullable: true }) nofat: number;
  @Column({ name: 'rmg', type: 'int', nullable: true }) rmg: number;
  @Column({ name: 'krmg', type: 'decimal', precision: 10, scale: 2, nullable: true }) krmg: number;
  @Column({ name: 'nofsl', type: 'int', nullable: true }) nofsl: number;
}

@Entity('datak_year_n')
export class DatakYearNEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'nok', type: 'int', nullable: true }) nok: number;
  @Column({ name: 'datemo', type: 'date', nullable: true }) datemo: Date;
  @Column({ name: 'nokall', type: 'int', nullable: true }) nokall: number;
  @Column({ name: 'nokon', type: 'int', nullable: true }) nokon: number;
  @Column({ name: 'recno', type: 'int', nullable: true }) recno: number;
  @Column({ name: 'mdin', type: 'decimal', precision: 14, scale: 2, nullable: true }) mdin: number;
  @Column({ name: 'dan', type: 'decimal', precision: 14, scale: 2, nullable: true }) dan: number;
  @Column({ name: 'noms', type: 'int', nullable: true }) noms: number;
  @Column({ name: 'typems', type: 'int', nullable: true }) typems: number;
  @Column({ name: 'memos', type: 'varchar', length: 300, nullable: true }) memos: string;
  @Column({ name: 'mdinaml', type: 'decimal', precision: 14, scale: 2, nullable: true }) mdinaml: number;
  @Column({ name: 'danaml', type: 'decimal', precision: 14, scale: 2, nullable: true }) danaml: number;
  @Column({ name: 'noaml', type: 'int', nullable: true }) noaml: number;
  @Column({ name: 'namea', type: 'varchar', length: 300, nullable: true }) namea: string;
  @Column({ name: 'noaml2', type: 'int', nullable: true }) noaml2: number;
  @Column({ name: 'tyk', type: 'int', nullable: true }) tyk: number;
  @Column({ name: 'nosnf', type: 'int', nullable: true }) nosnf: number;
  @Column({ name: 'noz', type: 'int', nullable: true }) noz: number;
}

@Entity('datanet')
export class DatanetEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'dates2', type: 'date', nullable: true }) dates2: Date;
  @Column({ name: 'namea', type: 'varchar', length: 50, nullable: true }) namea: string;
  @Column({ name: 'tel', type: 'int', nullable: true }) tel: number;
  @Column({ name: 'kb', type: 'varchar', length: 50, nullable: true }) kb: string;
  @Column({ name: 'noaddn', type: 'int', nullable: true }) noaddn: number;
  @Column({ name: 'ks', type: 'decimal', precision: 11, scale: 2, nullable: true }) ks: number;
  @Column({ name: 'kh', type: 'decimal', precision: 11, scale: 2, nullable: true }) kh: number;
  @Column({ name: 'ast', type: 'decimal', precision: 11, scale: 2, nullable: true }) ast: number;
  @Column({ name: 'kast', type: 'decimal', precision: 10, scale: 2, nullable: true }) kast: number;
  @Column({ name: 'hd', type: 'decimal', precision: 10, scale: 2, nullable: true }) hd: number;
  @Column({ name: 'sk', type: 'int', nullable: true }) sk: number;
  @Column({ name: 'mt', type: 'decimal', precision: 10, scale: 2, nullable: true }) mt: number;
  @Column({ name: 'md', type: 'decimal', precision: 10, scale: 2, nullable: true }) md: number;
  @Column({ name: 'net', type: 'decimal', precision: 20, scale: 2, nullable: true }) net: number;
  @Column({ name: 'nosn', type: 'int', nullable: true }) nosn: number;
  @Column({ name: 'noaon', type: 'int', nullable: true }) noaon: number;
  @Column({ name: 'recno', type: 'int', nullable: true }) recno: number;
}

@Entity('data_ar')
export class DataArEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noaddr', type: 'int', nullable: true }) noaddr: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'dates2', type: 'date', nullable: true }) dates2: Date;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'noson', type: 'int', nullable: true }) noson: number;
  @Column({ name: 'ks', type: 'decimal', precision: 15, scale: 2, nullable: true }) ks: number;
  @Column({ name: 'kh', type: 'decimal', precision: 15, scale: 2, nullable: true }) kh: number;
  @Column({ name: 'ast', type: 'decimal', precision: 15, scale: 2, nullable: true }) ast: number;
  @Column({ name: 'frrs', type: 'decimal', precision: 15, scale: 2, nullable: true }) frrs: number;
  @Column({ name: 'frnors', type: 'decimal', precision: 15, scale: 2, nullable: true }) frnors: number;
}

@Entity('data_sn')
export class DataSnEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nosn', type: 'int', nullable: true }) nosn: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'hls', type: 'int', nullable: true }) hls: number;
}

@Entity('del_r')
export class DelREntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'kh', type: 'decimal', precision: 10, scale: 2, nullable: true }) kh: number;
  @Column({ name: 'tsuh', type: 'decimal', precision: 10, scale: 2, nullable: true }) tsuh: number;
  @Column({ name: 'notsu', type: 'int', nullable: true }) notsu: number;
  @Column({ name: 'memt', type: 'varchar', length: 200, nullable: true }) memt: string;
  @Column({ name: 'kasb', type: 'decimal', precision: 11, scale: 2, nullable: true }) kasb: number;
  @Column({ name: 'noaddn', type: 'int', nullable: true }) noaddn: number;
  @Column({ name: 'ft', type: 'decimal', precision: 20, scale: 2, nullable: true }) ft: number;
  @Column({ name: 'ks', type: 'decimal', precision: 11, scale: 2, nullable: true }) ks: number;
}

@Entity('fatbfx')
export class FatbfxEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'noan', type: 'int', nullable: true }) noan: number;
  @Column({ name: 'totals', type: 'decimal', precision: 12, scale: 2, nullable: true }) totals: number;
  @Column({ name: 'memos', type: 'varchar', length: 80, nullable: true }) memos: string;
  @Column({ name: 'recno', type: 'int', nullable: true }) recno: number;
  @Column({ name: 'noas', type: 'int', nullable: true }) noas: number;
  @Column({ name: 'kma', type: 'decimal', precision: 14, scale: 2, nullable: true }) kma: number;
  @Column({ name: 'sar', type: 'decimal', precision: 10, scale: 2, nullable: true }) sar: number;
  @Column({ name: 'upd', type: 'int', nullable: true }) upd: number;
  @Column({ name: 'sartk', type: 'decimal', precision: 10, scale: 2, nullable: true }) sartk: number;
  @Column({ name: 'nbr', type: 'int', nullable: true }) nbr: number;
  @Column({ name: 'nbh', type: 'int', nullable: true }) nbh: number;
  @Column({ name: 'noz', type: 'int', nullable: true }) noz: number;
  @Column({ name: 'nosfb', type: 'int', nullable: true }) nosfb: number;
}

@Entity('fin')
export class FinEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'fin', type: 'int', nullable: true }) fin: number;
  @Column({ name: 'finc', type: 'varchar', length: 50, nullable: true }) finc: string;
}

@Entity('fslsdad')
export class FslsdadEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'datef', type: 'date', nullable: true }) datef: Date;
  @Column({ name: 'nou', type: 'int', nullable: true }) nou: number;
  @Column({ name: 'datea', type: 'date', nullable: true }) datea: Date;
  @Column({ name: 'pr', type: 'int', nullable: true }) pr: number;
}

@Entity('fslsdadms')
export class FslsdadmsEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'datef', type: 'date', nullable: true }) datef: Date;
  @Column({ name: 'nou', type: 'int', nullable: true }) nou: number;
}

@Entity('hmh')
export class HmhEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'typea', type: 'int', nullable: true }) typea: number;
  @Column({ name: 'nouser', type: 'int', nullable: true }) nouser: number;
  @Column({ name: 'tyh', type: 'int', nullable: true }) tyh: number;
}

@Entity('ksh')
export class KshEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nok', type: 'int', nullable: true }) nok: number;
  @Column({ name: 'tma', type: 'int', nullable: true }) tma: number;
  @Column({ name: 'tda', type: 'int', nullable: true }) tda: number;
}

@Entity('kyd')
export class KydEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'noson', type: 'int', nullable: true }) noson: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'noa1', type: 'int', nullable: true }) noa1: number;
  @Column({ name: 'noa2', type: 'int', nullable: true }) noa2: number;
  @Column({ name: 'totl', type: 'decimal', precision: 14, scale: 2, nullable: true }) totl: number;
  @Column({ name: 'nok', type: 'int', nullable: true }) nok: number;
  @Column({ name: 'nokon', type: 'int', nullable: true }) nokon: number;
  @Column({ name: 'memos1', type: 'varchar', length: 60, nullable: true }) memos1: string;
  @Column({ name: 'memos2', type: 'varchar', length: 60, nullable: true }) memos2: string;
  @Column({ name: 'nms', type: 'varchar', length: 30, nullable: true }) nms: string;
  @Column({ name: 'nokall', type: 'int', nullable: true }) nokall: number;
  @Column({ name: 'nom1', type: 'int', nullable: true }) nom1: number;
  @Column({ name: 'nom2', type: 'int', nullable: true }) nom2: number;
  @Column({ name: 'sars', type: 'decimal', precision: 14, scale: 2, nullable: true }) sars: number;
  @Column({ name: 'totlm', type: 'decimal', precision: 14, scale: 2, nullable: true }) totlm: number;
  @Column({ name: 'amla', type: 'int', nullable: true }) amla: number;
  @Column({ name: 'msys', type: 'int', nullable: true }) msys: number;
  @Column({ name: 'k2020', type: 'int', nullable: true }) k2020: number;
}

@Entity('lov_aa')
export class LovAaEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'namem', type: 'varchar', length: 100, nullable: true }) namem: string;
  @Column({ name: 'red', type: 'decimal', precision: 20, scale: 2, nullable: true }) red: number;
  @Column({ name: 'tyq', type: 'int', nullable: true }) tyq: number;
  @Column({ name: 'ty_ms', type: 'varchar', length: 100, nullable: true }) tyMs: string;
}

@Entity('mat')
export class MatEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'msa', type: 'decimal', precision: 14, scale: 2, nullable: true }) msa: number;
  @Column({ name: 'ard', type: 'decimal', precision: 14, scale: 2, nullable: true }) ard: number;
  @Column({ name: 'thl', type: 'decimal', precision: 14, scale: 2, nullable: true }) thl: number;
}

@Entity('memopr')
export class MemoprEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'datem', type: 'date', nullable: true }) datem: Date;
  @Column({ name: 'memopr', type: 'varchar', length: 100, nullable: true }) memopr: string;
}

@Entity('mkb')
export class MkbEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nom', type: 'int', nullable: true }) nom: number;
  @Column({ name: 'namem', type: 'varchar', length: 50, nullable: true }) namem: string;
  @Column({ name: 'noms', type: 'int', nullable: true }) noms: number;
}

@Entity('mkb2')
export class Mkb2Entity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nom', type: 'int', nullable: true }) nom: number;
  @Column({ name: 'namem', type: 'varchar', length: 100, nullable: true }) namem: string;
}

@Entity('mmsh')
export class MmshEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noms', type: 'int', nullable: true }) noms: number;
  @Column({ name: 'nok', type: 'int', nullable: true }) nok: number;
  @Column({ name: 'memo', type: 'varchar', length: 300, nullable: true }) memo: string;
}

@Entity('mol')
export class MolEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'upd', type: 'int', nullable: true }) upd: number;
  @Column({ name: 'nms', type: 'varchar', length: 30, nullable: true }) nms: string;
  @Column({ name: 'nousx', type: 'int', nullable: true }) nousx: number;
  @Column({ name: 'noson', type: 'int', nullable: true }) noson: number;
  @Column({ name: 'noksnf', type: 'int', nullable: true }) noksnf: number;
  @Column({ name: 'nokonsnf', type: 'int', nullable: true }) nokonsnf: number;
  @Column({ name: 'nok', type: 'int', nullable: true }) nok: number;
  @Column({ name: 'nokon', type: 'int', nullable: true }) nokon: number;
  @Column({ name: 'memos', type: 'varchar', length: 50, nullable: true }) memos: string;
  @Column({ name: 'kh', type: 'decimal', precision: 30, scale: 2, nullable: true }) kh: number;
  @Column({ name: 'ks', type: 'decimal', precision: 30, scale: 2, nullable: true }) ks: number;
  @Column({ name: 'ast', type: 'decimal', precision: 15, scale: 2, nullable: true }) ast: number;
  @Column({ name: 'ty', type: 'int', nullable: true }) ty: number;
  @Column({ name: 'noam', type: 'int', nullable: true }) noam: number;
  @Column({ name: 'ft', type: 'int', nullable: true }) ft: number;
  @Column({ name: 'noz', type: 'int', nullable: true }) noz: number;
  @Column({ name: 'kss', type: 'decimal', precision: 20, scale: 2, nullable: true }) kss: number;
  @Column({ name: 'fark', type: 'decimal', precision: 14, scale: 2, nullable: true }) fark: number;
  @Column({ name: 'ts', type: 'int', nullable: true }) ts: number;
}

@Entity('molf')
export class MolfEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'noan', type: 'int', nullable: true }) noan: number;
  @Column({ name: 'kma', type: 'decimal', precision: 14, scale: 2, nullable: true }) kma: number;
  @Column({ name: 'memos', type: 'varchar', length: 50, nullable: true }) memos: string;
  @Column({ name: 'recno', type: 'int', nullable: true }) recno: number;
  @Column({ name: 'totl', type: 'decimal', precision: 14, scale: 2, nullable: true }) totl: number;
  @Column({ name: 'sara', type: 'decimal', precision: 10, scale: 2, nullable: true }) sara: number;
  @Column({ name: 'upd', type: 'int', nullable: true }) upd: number;
  @Column({ name: 'noz', type: 'int', nullable: true }) noz: number;
  @Column({ name: 'nom', type: 'int', nullable: true }) nom: number;
  @Column({ name: 'tf', type: 'int', nullable: true }) tf: number;
}

@Entity('momomo')
export class MomomoEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'namea', type: 'varchar', length: 50, nullable: true }) namea: string;
  @Column({ name: 'rs', type: 'int', nullable: true }) rs: number;
  @Column({ name: 'da', type: 'date', nullable: true }) da: Date;
  @Column({ name: 'noaa', type: 'int', nullable: true }) noaa: number;
  @Column({ name: 'ty', type: 'int', nullable: true }) ty: number;
  @Column({ name: 'nameam', type: 'varchar', length: 50, nullable: true }) nameam: string;
  @Column({ name: 'nameax', type: 'varchar', length: 50, nullable: true }) nameax: string;
}

@Entity('mrczet')
export class MrczetEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noz1', type: 'int', nullable: true }) noz1: number;
  @Column({ name: 'noz2', type: 'int', nullable: true }) noz2: number;
  @Column({ name: 'kh', type: 'int', nullable: true }) kh: number;
  @Column({ name: 'ft', type: 'int', nullable: true }) ft: number;
  @Column({ name: 'ftk', type: 'int', nullable: true }) ftk: number;
  @Column({ name: 'nameg', type: 'varchar', length: 100, nullable: true }) nameg: string;
  @Column({ name: 'nozx', type: 'int', nullable: true }) nozx: number;
  @Column({ name: 'no_mold', type: 'int', nullable: true }) noMold: number;
}

@Entity('msc')
export class MscEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nox', type: 'int', nullable: true }) nox: number;
  @Column({ name: 't', type: 'int', nullable: true }) t: number;
}

@Entity('msrif')
export class MsrifEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'totals', type: 'decimal', precision: 14, scale: 2, nullable: true }) totals: number;
  @Column({ name: 'memos', type: 'varchar', length: 80, nullable: true }) memos: string;
  @Column({ name: 'rec', type: 'int', nullable: true }) rec: number;
}

@Entity('mv')
export class MvEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'no', type: 'int', nullable: true }) no: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'name', type: 'varchar', length: 88, nullable: true }) name: string;
  @Column({ name: 'dat', type: 'date', nullable: true }) dat: Date;
  @Column({ name: 'bian', type: 'varchar', length: 155, nullable: true }) bian: string;
  @Column({ name: 'day1', type: 'int', nullable: true }) day1: number;
  @Column({ name: 'day2', type: 'int', nullable: true }) day2: number;
  @Column({ name: 'day3', type: 'int', nullable: true }) day3: number;
  @Column({ name: 'day4', type: 'int', nullable: true }) day4: number;
  @Column({ name: 'day5', type: 'int', nullable: true }) day5: number;
  @Column({ name: 'day6', type: 'int', nullable: true }) day6: number;
  @Column({ name: 'day7', type: 'int', nullable: true }) day7: number;
  @Column({ name: 'total', type: 'int', nullable: true }) total: number;
  @Column({ name: 'mrg', type: 'int', nullable: true }) mrg: number;
  @Column({ name: 'type', type: 'int', nullable: true }) type: number;
  @Column({ name: 'scan', type: 'int', nullable: true }) scan: number;
}

@Entity('mvall')
export class MvallEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'no', type: 'int', nullable: true }) no: number;
  @Column({ name: 'mrg', type: 'int', nullable: true }) mrg: number;
  @Column({ name: 'dat', type: 'date', nullable: true }) dat: Date;
  @Column({ name: 'dt1', type: 'date', nullable: true }) dt1: Date;
  @Column({ name: 'dat2', type: 'date', nullable: true }) dat2: Date;
  @Column({ name: 'bian', type: 'varchar', length: 155, nullable: true }) bian: string;
  @Column({ name: 'price', type: 'int', nullable: true }) price: number;
  @Column({ name: 'scan', type: 'int', nullable: true }) scan: number;
}

@Entity('mzt')
export class MztEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noz', type: 'int', nullable: true }) noz: number;
  @Column({ name: 'namez', type: 'varchar', length: 50, nullable: true }) namez: string;
  @Column({ name: 'hl', type: 'int', nullable: true }) hl: number;
  @Column({ name: 'nomz', type: 'decimal', precision: 20, scale: 2, nullable: true }) nomz: number;
  @Column({ name: 'xr', type: 'int', nullable: true }) xr: number;
  @Column({ name: 'nozr', type: 'int', nullable: true }) nozr: number;
}

@Entity('nok')
export class NokEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nok', type: 'int', nullable: true }) nok: number;
}

@Entity('nsdk2')
export class Nsdk2Entity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'dates', type: 'varchar', length: 100, nullable: true }) dates: string;
  @Column({ name: 'noa', type: 'varchar', length: 100, nullable: true }) noa: string;
  @Column({ name: 'mb', type: 'varchar', length: 100, nullable: true }) mb: string;
  @Column({ name: 'nom', type: 'varchar', length: 100, nullable: true }) nom: string;
}

@Entity('nurs')
export class NursEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'no', type: 'int', nullable: true }) no: number;
}

@Entity('prg')
export class PrgEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nopr', type: 'int', nullable: true }) nopr: number;
  @Column({ name: 'naprg', type: 'varchar', length: 20, nullable: true }) naprg: string;
  @Column({ name: 'laprg', type: 'varchar', length: 50, nullable: true }) laprg: string;
  @Column({ name: 'alls', type: 'int', nullable: true }) alls: number;
  @Column({ name: 'hs', type: 'int', nullable: true }) hs: number;
}

@Entity('red')
export class RedEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'namea', type: 'varchar', length: 100, nullable: true }) namea: string;
  @Column({ name: 'no_tblh', type: 'int', nullable: true }) noTblh: number;
  @Column({ name: 'no_mstlm', type: 'int', nullable: true }) noMstlm: number;
  @Column({ name: 'nog', type: 'int', nullable: true }) nog: number;
  @Column({ name: 'no_adad', type: 'int', nullable: true }) noAdad: number;
  @Column({ name: 'ind', type: 'int', nullable: true }) ind: number;
  @Column({ name: 'kh', type: 'decimal', precision: 10, scale: 2, nullable: true }) kh: number;
  @Column({ name: 'ks', type: 'decimal', precision: 10, scale: 2, nullable: true }) ks: number;
  @Column({ name: 'namet', type: 'varchar', length: 50, nullable: true }) namet: string;
  @Column({ name: 'hn', type: 'int', nullable: true }) hn: number;
  @Column({ name: 'asts', type: 'decimal', precision: 10, scale: 2, nullable: true }) asts: number;
  @Column({ name: 'sk', type: 'int', nullable: true }) sk: number;
  @Column({ name: 'mt', type: 'int', nullable: true }) mt: number;
  @Column({ name: 'kmsn', type: 'int', nullable: true }) kmsn: number;
  @Column({ name: 'matm33', type: 'int', nullable: true }) matm33: number;
  @Column({ name: 'rtrdn', type: 'int', nullable: true }) rtrdn: number;
  @Column({ name: 'kbk', type: 'decimal', precision: 10, scale: 2, nullable: true }) kbk: number;
  @Column({ name: 'fredm', type: 'decimal', precision: 10, scale: 2, nullable: true }) fredm: number;
  @Column({ name: 'freds', type: 'decimal', precision: 10, scale: 2, nullable: true }) freds: number;
}

@Entity('redmmm')
export class RedmmmEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'dates2', type: 'date', nullable: true }) dates2: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'ks', type: 'decimal', precision: 20, scale: 2, nullable: true }) ks: number;
  @Column({ name: 'kh', type: 'decimal', precision: 20, scale: 2, nullable: true }) kh: number;
  @Column({ name: 'ast', type: 'decimal', precision: 20, scale: 2, nullable: true }) ast: number;
  @Column({ name: 'recno', type: 'int', nullable: true }) recno: number;
  @Column({ name: 'kh2', type: 'decimal', precision: 20, scale: 2, nullable: true }) kh2: number;
  @Column({ name: 'ks2', type: 'decimal', precision: 20, scale: 2, nullable: true }) ks2: number;
  @Column({ name: 'ast2', type: 'decimal', precision: 20, scale: 2, nullable: true }) ast2: number;
  @Column({ name: 'kh3', type: 'decimal', precision: 20, scale: 2, nullable: true }) kh3: number;
  @Column({ name: 'ks3', type: 'decimal', precision: 20, scale: 2, nullable: true }) ks3: number;
  @Column({ name: 'ast3', type: 'decimal', precision: 20, scale: 2, nullable: true }) ast3: number;
}

@Entity('redmmmd')
export class RedmmmdEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'dates2', type: 'date', nullable: true }) dates2: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'ks', type: 'decimal', precision: 20, scale: 2, nullable: true }) ks: number;
  @Column({ name: 'kh', type: 'decimal', precision: 20, scale: 2, nullable: true }) kh: number;
  @Column({ name: 'ast', type: 'decimal', precision: 20, scale: 2, nullable: true }) ast: number;
  @Column({ name: 'recno', type: 'int', nullable: true }) recno: number;
  @Column({ name: 'kh2', type: 'decimal', precision: 20, scale: 2, nullable: true }) kh2: number;
  @Column({ name: 'ks2', type: 'decimal', precision: 20, scale: 2, nullable: true }) ks2: number;
  @Column({ name: 'ast2', type: 'decimal', precision: 20, scale: 2, nullable: true }) ast2: number;
  @Column({ name: 'kh3', type: 'decimal', precision: 20, scale: 2, nullable: true }) kh3: number;
  @Column({ name: 'ks3', type: 'decimal', precision: 20, scale: 2, nullable: true }) ks3: number;
  @Column({ name: 'ast3', type: 'decimal', precision: 20, scale: 2, nullable: true }) ast3: number;
}

@Entity('redmmt')
export class RedmmtEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'dates2', type: 'date', nullable: true }) dates2: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'ks', type: 'decimal', precision: 20, scale: 2, nullable: true }) ks: number;
  @Column({ name: 'kh', type: 'decimal', precision: 20, scale: 2, nullable: true }) kh: number;
  @Column({ name: 'ast', type: 'decimal', precision: 20, scale: 2, nullable: true }) ast: number;
  @Column({ name: 'khr', type: 'decimal', precision: 20, scale: 2, nullable: true }) khr: number;
  @Column({ name: 'frk', type: 'decimal', precision: 20, scale: 2, nullable: true }) frk: number;
  @Column({ name: 'recno', type: 'int', nullable: true }) recno: number;
  @Column({ name: 'kasb', type: 'decimal', precision: 20, scale: 2, nullable: true }) kasb: number;
  @Column({ name: 'noaddn', type: 'int', nullable: true }) noaddn: number;
}

@Entity('redmmw')
export class RedmmwEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'dates2', type: 'date', nullable: true }) dates2: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'ks', type: 'decimal', precision: 20, scale: 2, nullable: true }) ks: number;
  @Column({ name: 'kh', type: 'decimal', precision: 20, scale: 2, nullable: true }) kh: number;
  @Column({ name: 'ast', type: 'decimal', precision: 20, scale: 2, nullable: true }) ast: number;
  @Column({ name: 'recno', type: 'int', nullable: true }) recno: number;
  @Column({ name: 't_s', type: 'int', nullable: true }) tS: number;
  @Column({ name: 'astd', type: 'decimal', precision: 10, scale: 2, nullable: true }) astd: number;
}

@Entity('redmmw2')
export class Redmmw2Entity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'dates2', type: 'date', nullable: true }) dates2: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'ks', type: 'decimal', precision: 20, scale: 2, nullable: true }) ks: number;
  @Column({ name: 'kh', type: 'decimal', precision: 20, scale: 2, nullable: true }) kh: number;
  @Column({ name: 'ast', type: 'decimal', precision: 20, scale: 2, nullable: true }) ast: number;
  @Column({ name: 'recno', type: 'int', nullable: true }) recno: number;
  @Column({ name: 'kss', type: 'decimal', precision: 20, scale: 2, nullable: true }) kss: number;
  @Column({ name: 'khs', type: 'decimal', precision: 20, scale: 2, nullable: true }) khs: number;
  @Column({ name: 'asts', type: 'decimal', precision: 20, scale: 2, nullable: true }) asts: number;
}

@Entity('redmmw2d')
export class Redmmw2dEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'dates2', type: 'date', nullable: true }) dates2: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'ks', type: 'decimal', precision: 20, scale: 2, nullable: true }) ks: number;
  @Column({ name: 'kh', type: 'decimal', precision: 20, scale: 2, nullable: true }) kh: number;
  @Column({ name: 'ast', type: 'decimal', precision: 20, scale: 2, nullable: true }) ast: number;
  @Column({ name: 'recno', type: 'int', nullable: true }) recno: number;
  @Column({ name: 'kss', type: 'decimal', precision: 20, scale: 2, nullable: true }) kss: number;
  @Column({ name: 'khs', type: 'decimal', precision: 20, scale: 2, nullable: true }) khs: number;
  @Column({ name: 'asts', type: 'decimal', precision: 20, scale: 2, nullable: true }) asts: number;
}

@Entity('redmmwd')
export class RedmmwdEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'dates2', type: 'date', nullable: true }) dates2: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'ks', type: 'decimal', precision: 20, scale: 2, nullable: true }) ks: number;
  @Column({ name: 'kh', type: 'decimal', precision: 20, scale: 2, nullable: true }) kh: number;
  @Column({ name: 'ast', type: 'decimal', precision: 20, scale: 2, nullable: true }) ast: number;
  @Column({ name: 'recno', type: 'int', nullable: true }) recno: number;
}

@Entity('redmmz')
export class RedmmzEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'dates2', type: 'date', nullable: true }) dates2: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'ks', type: 'decimal', precision: 20, scale: 2, nullable: true }) ks: number;
  @Column({ name: 'kh', type: 'decimal', precision: 20, scale: 2, nullable: true }) kh: number;
  @Column({ name: 'ast', type: 'decimal', precision: 20, scale: 2, nullable: true }) ast: number;
  @Column({ name: 'khr', type: 'decimal', precision: 20, scale: 2, nullable: true }) khr: number;
  @Column({ name: 'frk', type: 'decimal', precision: 20, scale: 2, nullable: true }) frk: number;
  @Column({ name: 'recno', type: 'int', nullable: true }) recno: number;
  @Column({ name: 'kasb', type: 'decimal', precision: 20, scale: 2, nullable: true }) kasb: number;
  @Column({ name: 'noaddn', type: 'int', nullable: true }) noaddn: number;
  @Column({ name: 'khz', type: 'decimal', precision: 20, scale: 2, nullable: true }) khz: number;
  @Column({ name: 'frkt', type: 'decimal', precision: 20, scale: 2, nullable: true }) frkt: number;
}

@Entity('redmt')
export class RedmtEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'noson', type: 'int', nullable: true }) noson: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'dates2', type: 'date', nullable: true }) dates2: Date;
}

@Entity('redmw')
export class RedmwEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'noson', type: 'int', nullable: true }) noson: number;
  @Column({ name: 'dates2', type: 'date', nullable: true }) dates2: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'ks', type: 'decimal', precision: 20, scale: 2, nullable: true }) ks: number;
  @Column({ name: 'kh', type: 'decimal', precision: 20, scale: 2, nullable: true }) kh: number;
  @Column({ name: 'ast', type: 'decimal', precision: 20, scale: 2, nullable: true }) ast: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
}

@Entity('redmwx')
export class RedmwxEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'dates2', type: 'date', nullable: true }) dates2: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'recno', type: 'int', nullable: true }) recno: number;
  @Column({ name: 'nosm', type: 'int', nullable: true }) nosm: number;
  @Column({ name: 'nokb', type: 'int', nullable: true }) nokb: number;
  @Column({ name: 'ks', type: 'decimal', precision: 11, scale: 2, nullable: true }) ks: number;
  @Column({ name: 'kh', type: 'decimal', precision: 11, scale: 2, nullable: true }) kh: number;
  @Column({ name: 'ast', type: 'decimal', precision: 9, scale: 2, nullable: true }) ast: number;
  @Column({ name: 'kasb', type: 'decimal', precision: 11, scale: 2, nullable: true }) kasb: number;
  @Column({ name: 'hast', type: 'int', nullable: true }) hast: number;
  @Column({ name: 'asts', type: 'decimal', precision: 9, scale: 2, nullable: true }) asts: number;
  @Column({ name: 'sksb', type: 'int', nullable: true }) sksb: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'noaon', type: 'int', nullable: true }) noaon: number;
}

@Entity('redmz')
export class RedmzEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'noson', type: 'int', nullable: true }) noson: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'dates2', type: 'date', nullable: true }) dates2: Date;
}

@Entity('redp')
export class RedpEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'namea', type: 'varchar', length: 100, nullable: true }) namea: string;
  @Column({ name: 'no_tblh', type: 'int', nullable: true }) noTblh: number;
  @Column({ name: 'no_mstlm', type: 'int', nullable: true }) noMstlm: number;
  @Column({ name: 'nog', type: 'int', nullable: true }) nog: number;
  @Column({ name: 'no_adad', type: 'int', nullable: true }) noAdad: number;
  @Column({ name: 'ind', type: 'int', nullable: true }) ind: number;
  @Column({ name: 'kh', type: 'decimal', precision: 10, scale: 2, nullable: true }) kh: number;
  @Column({ name: 'ks', type: 'decimal', precision: 10, scale: 2, nullable: true }) ks: number;
  @Column({ name: 'namet', type: 'varchar', length: 50, nullable: true }) namet: string;
  @Column({ name: 'hn', type: 'int', nullable: true }) hn: number;
  @Column({ name: 'asts', type: 'decimal', precision: 10, scale: 2, nullable: true }) asts: number;
  @Column({ name: 'sk', type: 'int', nullable: true }) sk: number;
  @Column({ name: 'mt', type: 'int', nullable: true }) mt: number;
  @Column({ name: 'kmsn', type: 'int', nullable: true }) kmsn: number;
  @Column({ name: 'matm33', type: 'int', nullable: true }) matm33: number;
  @Column({ name: 'rtrdn', type: 'int', nullable: true }) rtrdn: number;
  @Column({ name: 'kbk', type: 'decimal', precision: 10, scale: 2, nullable: true }) kbk: number;
  @Column({ name: 'fredm', type: 'decimal', precision: 10, scale: 2, nullable: true }) fredm: number;
  @Column({ name: 'freds', type: 'decimal', precision: 10, scale: 2, nullable: true }) freds: number;
}

@Entity('red_ex')
export class RedExEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'noy', type: 'int', nullable: true }) noy: number;
  @Column({ name: 'red', type: 'decimal', precision: 20, scale: 2, nullable: true }) red: number;
  @Column({ name: 'noad', type: 'int', nullable: true }) noad: number;
  @Column({ name: 'namem', type: 'varchar', length: 200, nullable: true }) namem: string;
}

@Entity('repall')
export class RepallEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'typea', type: 'int', nullable: true }) typea: number;
  @Column({ name: 'rsms', type: 'decimal', precision: 14, scale: 2, nullable: true }) rsms: number;
  @Column({ name: 'rsds', type: 'decimal', precision: 14, scale: 2, nullable: true }) rsds: number;
  @Column({ name: 'rsmm', type: 'decimal', precision: 14, scale: 2, nullable: true }) rsmm: number;
  @Column({ name: 'rsdm', type: 'decimal', precision: 14, scale: 2, nullable: true }) rsdm: number;
  @Column({ name: 'rsmh', type: 'decimal', precision: 14, scale: 2, nullable: true }) rsmh: number;
  @Column({ name: 'rsdh', type: 'decimal', precision: 14, scale: 2, nullable: true }) rsdh: number;
  @Column({ name: 'dateh', type: 'date', nullable: true }) dateh: Date;
  @Column({ name: 'ty', type: 'int', nullable: true }) ty: number;
  @Column({ name: 'namea', type: 'varchar', length: 50, nullable: true }) namea: string;
}

@Entity('repamp')
export class RepampEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'datpr', type: 'date', nullable: true }) datpr: Date;
}

@Entity('repkhm')
export class RepkhmEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'namea', type: 'varchar', length: 50, nullable: true }) namea: string;
  @Column({ name: 'noan', type: 'int', nullable: true }) noan: number;
  @Column({ name: 'rsd', type: 'int', nullable: true }) rsd: number;
  @Column({ name: 'da', type: 'date', nullable: true }) da: Date;
  @Column({ name: 'nameg', type: 'varchar', length: 20, nullable: true }) nameg: string;
  @Column({ name: 'nameh', type: 'varchar', length: 10, nullable: true }) nameh: string;
  @Column({ name: 'noak', type: 'varchar', length: 80, nullable: true }) noak: string;
  @Column({ name: 'tmin', type: 'int', nullable: true }) tmin: number;
  @Column({ name: 'tmin2', type: 'int', nullable: true }) tmin2: number;
  @Column({ name: 'tl', type: 'varchar', length: 30, nullable: true }) tl: string;
  @Column({ name: 'nomo', type: 'bigint', nullable: true }) nomo: string | number;
  @Column({ name: 'hl', type: 'int', nullable: true }) hl: number;
  @Column({ name: 'gkm', type: 'int', nullable: true }) gkm: number;
  @Column({ name: 'typ', type: 'int', nullable: true }) typ: number;
  @Column({ name: 'prfg', type: 'int', nullable: true }) prfg: number;
  @Column({ name: 'nog', type: 'int', nullable: true }) nog: number;
  @Column({ name: 'indxx', type: 'varchar', length: 80, nullable: true }) indxx: string;
  @Column({ name: 'typc', type: 'varchar', length: 10, nullable: true }) typc: string;
  @Column({ name: 'mem', type: 'varchar', length: 100, nullable: true }) mem: string;
  @Column({ name: 'tminall', type: 'decimal', precision: 14, scale: 2, nullable: true }) tminall: number;
  @Column({ name: 'frtm', type: 'decimal', precision: 14, scale: 2, nullable: true }) frtm: number;
  @Column({ name: 'da1', type: 'date', nullable: true }) da1: Date;
  @Column({ name: 'rm', type: 'int', nullable: true }) rm: number;
  @Column({ name: 'rd', type: 'int', nullable: true }) rd: number;
}

@Entity('repkhxxx')
export class RepkhxxxEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'rsd', type: 'int', nullable: true }) rsd: number;
  @Column({ name: 'kn', type: 'int', nullable: true }) kn: number;
  @Column({ name: 'hl', type: 'int', nullable: true }) hl: number;
  @Column({ name: 'tmina', type: 'int', nullable: true }) tmina: number;
  @Column({ name: 'tmxx', type: 'int', nullable: true }) tmxx: number;
}

@Entity('repmsm')
export class RepmsmEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'namea', type: 'varchar', length: 50, nullable: true }) namea: string;
  @Column({ name: 'noan', type: 'int', nullable: true }) noan: number;
  @Column({ name: 'rsd', type: 'int', nullable: true }) rsd: number;
  @Column({ name: 'da', type: 'date', nullable: true }) da: Date;
  @Column({ name: 'nameg', type: 'varchar', length: 20, nullable: true }) nameg: string;
  @Column({ name: 'nameh', type: 'varchar', length: 10, nullable: true }) nameh: string;
  @Column({ name: 'noak', type: 'varchar', length: 80, nullable: true }) noak: string;
  @Column({ name: 'tmin', type: 'int', nullable: true }) tmin: number;
  @Column({ name: 'tmin2', type: 'int', nullable: true }) tmin2: number;
  @Column({ name: 'tl', type: 'varchar', length: 30, nullable: true }) tl: string;
  @Column({ name: 'nomo', type: 'int', nullable: true }) nomo: number;
  @Column({ name: 'hl', type: 'int', nullable: true }) hl: number;
  @Column({ name: 'gkm', type: 'int', nullable: true }) gkm: number;
  @Column({ name: 'typ', type: 'int', nullable: true }) typ: number;
  @Column({ name: 'prfg', type: 'int', nullable: true }) prfg: number;
  @Column({ name: 'nog', type: 'int', nullable: true }) nog: number;
  @Column({ name: 'indxx', type: 'varchar', length: 80, nullable: true }) indxx: string;
  @Column({ name: 'notms', type: 'int', nullable: true }) notms: number;
  @Column({ name: 'typc', type: 'varchar', length: 10, nullable: true }) typc: string;
  @Column({ name: 'mem', type: 'varchar', length: 100, nullable: true }) mem: string;
  @Column({ name: 'tminall', type: 'decimal', precision: 14, scale: 2, nullable: true }) tminall: number;
  @Column({ name: 'frtm', type: 'decimal', precision: 14, scale: 2, nullable: true }) frtm: number;
  @Column({ name: 'da1', type: 'date', nullable: true }) da1: Date;
  @Column({ name: 'rm', type: 'int', nullable: true }) rm: number;
  @Column({ name: 'rd', type: 'int', nullable: true }) rd: number;
}

@Entity('reprorh')
export class ReprorhEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'namea', type: 'varchar', length: 50, nullable: true }) namea: string;
  @Column({ name: 'noan', type: 'int', nullable: true }) noan: number;
  @Column({ name: 'rsd', type: 'int', nullable: true }) rsd: number;
  @Column({ name: 'mdin', type: 'int', nullable: true }) mdin: number;
  @Column({ name: 'dan', type: 'int', nullable: true }) dan: number;
  @Column({ name: 'memoa', type: 'varchar', length: 300, nullable: true }) memoa: string;
  @Column({ name: 'typ', type: 'int', nullable: true }) typ: number;
}

@Entity('rtf_ab')
export class RtfAbEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'rsdl', type: 'decimal', precision: 14, scale: 2, nullable: true }) rsdl: number;
  @Column({ name: 'rsdn', type: 'decimal', precision: 14, scale: 2, nullable: true }) rsdn: number;
  @Column({ name: 'rt300', type: 'decimal', precision: 14, scale: 2, nullable: true }) rt300: number;
  @Column({ name: 'rtn', type: 'decimal', precision: 14, scale: 2, nullable: true }) rtn: number;
  @Column({ name: 'mt', type: 'decimal', precision: 14, scale: 2, nullable: true }) mt: number;
  @Column({ name: 'recno', type: 'int', nullable: true }) recno: number;
  @Column({ name: 'memos', type: 'varchar', length: 300, nullable: true }) memos: string;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'rst', type: 'decimal', precision: 14, scale: 2, nullable: true }) rst: number;
}

@Entity('rt_ab')
export class RtAbEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'noson', type: 'int', nullable: true }) noson: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'nok', type: 'int', nullable: true }) nok: number;
  @Column({ name: 'nokon', type: 'int', nullable: true }) nokon: number;
  @Column({ name: 'nms', type: 'varchar', length: 40, nullable: true }) nms: string;
  @Column({ name: 'frsk', type: 'int', nullable: true }) frsk: number;
  @Column({ name: 'nousx', type: 'int', nullable: true }) nousx: number;
  @Column({ name: 'smhfy', type: 'int', nullable: true }) smhfy: number;
  @Column({ name: 'monts', type: 'int', nullable: true }) monts: number;
  @Column({ name: 'sk', type: 'int', nullable: true }) sk: number;
  @Column({ name: 'memos', type: 'varchar', length: 100, nullable: true }) memos: string;
  @Column({ name: 'dateb', type: 'date', nullable: true }) dateb: Date;
  @Column({ name: 'nodr', type: 'int', nullable: true }) nodr: number;
}

@Entity('sarsh')
export class SarshEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
}

@Entity('sendsms')
export class SendsmsEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'customern', type: 'int', nullable: true }) customern: number;
  @Column({ name: 'phoneno', type: 'int', nullable: true }) phoneno: number;
  @Column({ name: 'customername', type: 'varchar', length: 120, nullable: true }) customername: string;
  @Column({ name: 'ms1', type: 'varchar', length: 1000, nullable: true }) ms1: string;
  @Column({ name: 'ms2', type: 'varchar', length: 1000, nullable: true }) ms2: string;
  @Column({ name: 'issent', type: 'int', nullable: true }) issent: number;
  @Column({ name: 'time_', type: 'varchar', length: 20, nullable: true }) time: string;
  @Column({ name: 'date_', type: 'varchar', length: 20, nullable: true }) date: string;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'f_p_h', type: 'varchar', length: 2000, nullable: true }) fPH: string;
}

@Entity('sendsms_s')
export class SendsmsSEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'customern', type: 'int', nullable: true }) customern: number;
  @Column({ name: 'phoneno', type: 'int', nullable: true }) phoneno: number;
  @Column({ name: 'customername', type: 'varchar', length: 150, nullable: true }) customername: string;
  @Column({ name: 'sms', type: 'varchar', length: 2000, nullable: true }) sms: string;
  @Column({ name: 'datesms', type: 'varchar', length: 20, nullable: true }) datesms: string;
  @Column({ name: 'timesms', type: 'varchar', length: 20, nullable: true }) timesms: string;
  @Column({ name: 'typesms', type: 'int', nullable: true }) typesms: number;
  @Column({ name: 'st', type: 'int', nullable: true }) st: number;
  @Column({ name: 'f', type: 'varchar', length: 10, nullable: true }) f: string;
  @Column({ name: 'd', type: 'date', nullable: true }) d: Date;
  @Column({ name: 't_m', type: 'int', nullable: true }) tM: number;
  @Column({ name: 't_m2', type: 'int', nullable: true }) tM2: number;
  @Column({ name: 'f_p_h', type: 'varchar', length: 2000, nullable: true }) fPH: string;
}

@Entity('sndk22')
export class Sndk22Entity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'noson', type: 'int', nullable: true }) noson: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'nok', type: 'int', nullable: true }) nok: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'noas', type: 'int', nullable: true }) noas: number;
  @Column({ name: 'nosf', type: 'int', nullable: true }) nosf: number;
  @Column({ name: 'sars', type: 'decimal', precision: 7, scale: 2, nullable: true }) sars: number;
  @Column({ name: 'nms', type: 'varchar', length: 50, nullable: true }) nms: string;
  @Column({ name: 'noues', type: 'int', nullable: true }) noues: number;
  @Column({ name: 'nokall', type: 'int', nullable: true }) nokall: number;
  @Column({ name: 'totalm', type: 'decimal', precision: 14, scale: 2, nullable: true }) totalm: number;
  @Column({ name: 'total', type: 'decimal', precision: 14, scale: 2, nullable: true }) total: number;
  @Column({ name: 'memo', type: 'varchar', length: 100, nullable: true }) memo: string;
  @Column({ name: 'noam', type: 'int', nullable: true }) noam: number;
  @Column({ name: 'nom', type: 'int', nullable: true }) nom: number;
  @Column({ name: 'nokon', type: 'int', nullable: true }) nokon: number;
  @Column({ name: 'nom2', type: 'int', nullable: true }) nom2: number;
  @Column({ name: 'k2020', type: 'int', nullable: true }) k2020: number;
  @Column({ name: 'amt', type: 'decimal', precision: 10, scale: 2, nullable: true }) amt: number;
  @Column({ name: 'nbm', type: 'varchar', length: 30, nullable: true }) nbm: string;
  @Column({ name: 'ts', type: 'int', nullable: true }) ts: number;
}

@Entity('sndknetf')
export class SndknetfEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'nosn', type: 'int', nullable: true }) nosn: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'mb', type: 'int', nullable: true }) mb: number;
  @Column({ name: 'nom', type: 'int', nullable: true }) nom: number;
  @Column({ name: 'noaon', type: 'int', nullable: true }) noaon: number;
  @Column({ name: 'baki', type: 'decimal', precision: 14, scale: 2, nullable: true }) baki: number;
  @Column({ name: 'recno', type: 'int', nullable: true }) recno: number;
  @Column({ name: 'namem', type: 'varchar', length: 100, nullable: true }) namem: string;
}

@Entity('sndko')
export class SndkoEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'noson', type: 'int', nullable: true }) noson: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'nok', type: 'int', nullable: true }) nok: number;
  @Column({ name: 'memos', type: 'varchar', length: 50, nullable: true }) memos: string;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'totals', type: 'decimal', precision: 14, scale: 2, nullable: true }) totals: number;
  @Column({ name: 'noas', type: 'decimal', precision: 14, scale: 2, nullable: true }) noas: number;
  @Column({ name: 'nms', type: 'varchar', length: 30, nullable: true }) nms: string;
  @Column({ name: 'nokon', type: 'int', nullable: true }) nokon: number;
  @Column({ name: 'nousx', type: 'int', nullable: true }) nousx: number;
}

@Entity('sndkof')
export class SndkofEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'totals', type: 'decimal', precision: 12, scale: 2, nullable: true }) totals: number;
  @Column({ name: 'memos', type: 'varchar', length: 80, nullable: true }) memos: string;
  @Column({ name: 'recno', type: 'int', nullable: true }) recno: number;
  @Column({ name: 'noas', type: 'int', nullable: true }) noas: number;
  @Column({ name: 'noftor', type: 'int', nullable: true }) noftor: number;
  @Column({ name: 'mbf', type: 'decimal', precision: 10, scale: 2, nullable: true }) mbf: number;
  @Column({ name: 'hsm', type: 'decimal', precision: 10, scale: 2, nullable: true }) hsm: number;
  @Column({ name: 'kfl', type: 'int', nullable: true }) kfl: number;
}

@Entity('sndkrs')
export class SndkrsEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'totals', type: 'int', nullable: true }) totals: number;
}

@Entity('sndksn')
export class SndksnEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'noson', type: 'int', nullable: true }) noson: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'nok', type: 'int', nullable: true }) nok: number;
  @Column({ name: 'nokon', type: 'int', nullable: true }) nokon: number;
  @Column({ name: 'nms', type: 'varchar', length: 40, nullable: true }) nms: string;
  @Column({ name: 'frsk', type: 'int', nullable: true }) frsk: number;
  @Column({ name: 'nousx', type: 'int', nullable: true }) nousx: number;
  @Column({ name: 'smhfy', type: 'int', nullable: true }) smhfy: number;
  @Column({ name: 'monts', type: 'int', nullable: true }) monts: number;
  @Column({ name: 'sk', type: 'int', nullable: true }) sk: number;
  @Column({ name: 'memos', type: 'varchar', length: 100, nullable: true }) memos: string;
  @Column({ name: 'dateb', type: 'date', nullable: true }) dateb: Date;
  @Column({ name: 'nodr', type: 'int', nullable: true }) nodr: number;
  @Column({ name: 'noas', type: 'int', nullable: true }) noas: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'upi', type: 'int', nullable: true }) upi: number;
  @Column({ name: 'nodd', type: 'int', nullable: true }) nodd: number;
  @Column({ name: 'dated', type: 'date', nullable: true }) dated: Date;
}

@Entity('sndksnf')
export class SndksnfEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'rmont', type: 'int', nullable: true }) rmont: number;
  @Column({ name: 'totl', type: 'decimal', precision: 14, scale: 2, nullable: true }) totl: number;
  @Column({ name: 'rtr', type: 'int', nullable: true }) rtr: number;
  @Column({ name: 'recno', type: 'int', nullable: true }) recno: number;
  @Column({ name: 'memos', type: 'varchar', length: 300, nullable: true }) memos: string;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'mn', type: 'int', nullable: true }) mn: number;
}

@Entity('sndk_a')
export class SndkAEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 2, nullable: true }) amount: number;
  @Column({ name: 'noaml', type: 'int', nullable: true }) noaml: number;
  @Column({ name: 'sarsf', type: 'decimal', precision: 10, scale: 2, nullable: true }) sarsf: number;
  @Column({ name: 'memo', type: 'varchar', length: 200, nullable: true }) memo: string;
  @Column({ name: 'no_box', type: 'int', nullable: true }) noBox: number;
  @Column({ name: 'memo_box', type: 'varchar', length: 200, nullable: true }) memoBox: string;
  @Column({ name: 'stat', type: 'int', nullable: true }) stat: number;
  @Column({ name: 'bin', type: 'varchar', length: 100, nullable: true }) bin: string;
  @Column({ name: 'date1', type: 'date', nullable: true }) date1: Date;
  @Column({ name: 'date2', type: 'date', nullable: true }) date2: Date;
  @Column({ name: 'nokall', type: 'int', nullable: true }) nokall: number;
}

@Entity('snds22')
export class Snds22Entity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'noson', type: 'int', nullable: true }) noson: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'nok', type: 'int', nullable: true }) nok: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'noas', type: 'int', nullable: true }) noas: number;
  @Column({ name: 'nosf', type: 'int', nullable: true }) nosf: number;
  @Column({ name: 'sars', type: 'decimal', precision: 7, scale: 2, nullable: true }) sars: number;
  @Column({ name: 'nms', type: 'varchar', length: 50, nullable: true }) nms: string;
  @Column({ name: 'noues', type: 'int', nullable: true }) noues: number;
  @Column({ name: 'nokall', type: 'int', nullable: true }) nokall: number;
  @Column({ name: 'totalm', type: 'decimal', precision: 14, scale: 2, nullable: true }) totalm: number;
  @Column({ name: 'total', type: 'decimal', precision: 14, scale: 2, nullable: true }) total: number;
  @Column({ name: 'memo', type: 'varchar', length: 100, nullable: true }) memo: string;
  @Column({ name: 'noam', type: 'int', nullable: true }) noam: number;
  @Column({ name: 'nom', type: 'int', nullable: true }) nom: number;
  @Column({ name: 'nokon', type: 'int', nullable: true }) nokon: number;
  @Column({ name: 'nom2', type: 'int', nullable: true }) nom2: number;
  @Column({ name: 'nbm', type: 'varchar', length: 30, nullable: true }) nbm: string;
  @Column({ name: 'ts', type: 'int', nullable: true }) ts: number;
  @Column({ name: 'k2020', type: 'int', nullable: true }) k2020: number;
  @Column({ name: 'amt', type: 'decimal', precision: 10, scale: 2, nullable: true }) amt: number;
}

@Entity('thoel')
export class ThoelEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'noa2', type: 'int', nullable: true }) noa2: number;
  @Column({ name: 'kma', type: 'decimal', precision: 14, scale: 2, nullable: true }) kma: number;
  @Column({ name: 'totl', type: 'decimal', precision: 14, scale: 2, nullable: true }) totl: number;
  @Column({ name: 'sara', type: 'decimal', precision: 14, scale: 2, nullable: true }) sara: number;
  @Column({ name: 'upd', type: 'int', nullable: true }) upd: number;
  @Column({ name: 'nms', type: 'varchar', length: 30, nullable: true }) nms: string;
  @Column({ name: 'noson', type: 'int', nullable: true }) noson: number;
  @Column({ name: 'nousx', type: 'int', nullable: true }) nousx: number;
  @Column({ name: 'noksnf', type: 'int', nullable: true }) noksnf: number;
  @Column({ name: 'nokonsnf', type: 'int', nullable: true }) nokonsnf: number;
  @Column({ name: 'nok', type: 'int', nullable: true }) nok: number;
  @Column({ name: 'nokon', type: 'int', nullable: true }) nokon: number;
  @Column({ name: 'memos', type: 'varchar', length: 50, nullable: true }) memos: string;
  @Column({ name: 'nosnf', type: 'int', nullable: true }) nosnf: number;
}

@Entity('tr')
export class TrEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'r', type: 'int', nullable: true }) r: number;
  @Column({ name: 's', type: 'int', nullable: true }) s: number;
  @Column({ name: 'd', type: 'date', nullable: true }) d: Date;
  @Column({ name: 'ast', type: 'int', nullable: true }) ast: number;
  @Column({ name: 'm', type: 'int', nullable: true }) m: number;
  @Column({ name: 'y1', type: 'int', nullable: true }) y1: number;
  @Column({ name: 'y2', type: 'int', nullable: true }) y2: number;
}

@Entity('trh')
export class TrhEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'trh', type: 'decimal', precision: 14, scale: 2, nullable: true }) trh: number;
}

@Entity('trmb')
export class TrmbEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nog', type: 'int', nullable: true }) nog: number;
  @Column({ name: 'nameg', type: 'varchar', length: 50, nullable: true }) nameg: string;
  @Column({ name: 'reda', type: 'decimal', precision: 30, scale: 2, nullable: true }) reda: number;
  @Column({ name: 'hl', type: 'int', nullable: true }) hl: number;
}

@Entity('tssn')
export class TssnEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'noson', type: 'int', nullable: true }) noson: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'nok', type: 'int', nullable: true }) nok: number;
  @Column({ name: 'nokon', type: 'int', nullable: true }) nokon: number;
  @Column({ name: 'nms', type: 'varchar', length: 40, nullable: true }) nms: string;
  @Column({ name: 'frsk', type: 'int', nullable: true }) frsk: number;
  @Column({ name: 'nousx', type: 'int', nullable: true }) nousx: number;
  @Column({ name: 'smhfy', type: 'int', nullable: true }) smhfy: number;
  @Column({ name: 'monts', type: 'int', nullable: true }) monts: number;
  @Column({ name: 'sk', type: 'int', nullable: true }) sk: number;
  @Column({ name: 'memos', type: 'varchar', length: 100, nullable: true }) memos: string;
  @Column({ name: 'dateb', type: 'date', nullable: true }) dateb: Date;
  @Column({ name: 'nodr', type: 'int', nullable: true }) nodr: number;
  @Column({ name: 'r300r', type: 'int', nullable: true }) r300r: number;
}

@Entity('tssnf')
export class TssnfEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'rsdl', type: 'decimal', precision: 14, scale: 2, nullable: true }) rsdl: number;
  @Column({ name: 'rsdn', type: 'decimal', precision: 14, scale: 2, nullable: true }) rsdn: number;
  @Column({ name: 'rt300', type: 'decimal', precision: 14, scale: 2, nullable: true }) rt300: number;
  @Column({ name: 'rtn', type: 'decimal', precision: 14, scale: 2, nullable: true }) rtn: number;
  @Column({ name: 'mt', type: 'decimal', precision: 14, scale: 2, nullable: true }) mt: number;
  @Column({ name: 'recno', type: 'int', nullable: true }) recno: number;
  @Column({ name: 'memos', type: 'varchar', length: 300, nullable: true }) memos: string;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'rst', type: 'decimal', precision: 14, scale: 2, nullable: true }) rst: number;
}

@Entity('tssx')
export class TssxEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'namea', type: 'varchar', length: 100, nullable: true }) namea: string;
  @Column({ name: 'kmsn', type: 'int', nullable: true }) kmsn: number;
  @Column({ name: 'zzzzz', type: 'int', nullable: true }) zzzzz: number;
  @Column({ name: 'z', type: 'int', nullable: true }) z: number;
  @Column({ name: 'zx', type: 'int', nullable: true }) zx: number;
  @Column({ name: 'datet', type: 'date', nullable: true }) datet: Date;
  @Column({ name: 'tradd', type: 'int', nullable: true }) tradd: number;
  @Column({ name: 'ntradd', type: 'int', nullable: true }) ntradd: number;
  @Column({ name: 'm', type: 'int', nullable: true }) m: number;
  @Column({ name: 'am', type: 'int', nullable: true }) am: number;
  @Column({ name: 'tbk', type: 'int', nullable: true }) tbk: number;
  @Column({ name: 'asd', type: 'int', nullable: true }) asd: number;
  @Column({ name: 'hsm', type: 'int', nullable: true }) hsm: number;
  @Column({ name: 'n1', type: 'int', nullable: true }) n1: number;
  @Column({ name: 'n2', type: 'int', nullable: true }) n2: number;
  @Column({ name: 'n3', type: 'int', nullable: true }) n3: number;
  @Column({ name: 'n4', type: 'int', nullable: true }) n4: number;
}

@Entity('tssx2')
export class Tssx2Entity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'total', type: 'int', nullable: true }) total: number;
  @Column({ name: 'ty', type: 'int', nullable: true }) ty: number;
  @Column({ name: 'memos', type: 'varchar', length: 100, nullable: true }) memos: string;
}

@Entity('ttel')
export class TtelEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'notl', type: 'int', nullable: true }) notl: number;
  @Column({ name: 'natl', type: 'int', nullable: true }) natl: number;
}

@Entity('tyht')
export class TyhtEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noh', type: 'int', nullable: true }) noh: number;
  @Column({ name: 'nameh', type: 'varchar', length: 10, nullable: true }) nameh: string;
}

@Entity('typems')
export class TypemsEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'noty', type: 'int', nullable: true }) noty: number;
  @Column({ name: 'naty', type: 'varchar', length: 15, nullable: true }) naty: string;
  @Column({ name: 'rep', type: 'int', nullable: true }) rep: number;
}

@Entity('ty_ms')
export class TyMsEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nom', type: 'int', nullable: true }) nom: number;
  @Column({ name: 'namem', type: 'varchar', length: 50, nullable: true }) namem: string;
}

@Entity('t_r_t')
export class TRTEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nos', type: 'int', nullable: true }) nos: number;
  @Column({ name: 'noson', type: 'int', nullable: true }) noson: number;
  @Column({ name: 'dates', type: 'date', nullable: true }) dates: Date;
  @Column({ name: 'nok', type: 'int', nullable: true }) nok: number;
  @Column({ name: 'nokon', type: 'int', nullable: true }) nokon: number;
  @Column({ name: 'nms', type: 'varchar', length: 40, nullable: true }) nms: string;
  @Column({ name: 'nousx', type: 'int', nullable: true }) nousx: number;
  @Column({ name: 'memos', type: 'varchar', length: 200, nullable: true }) memos: string;
  @Column({ name: 'mdin', type: 'int', nullable: true }) mdin: number;
  @Column({ name: 'dan', type: 'decimal', precision: 10, scale: 2, nullable: true }) dan: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
}

@Entity('usergn')
export class UsergnEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nou', type: 'int', nullable: true }) nou: number;
  @Column({ name: 'nopr', type: 'int', nullable: true }) nopr: number;
}

@Entity('user_mnatk')
export class UserMnatkEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nou', type: 'int', nullable: true }) nou: number;
  @Column({ name: 'no_mstlm', type: 'int', nullable: true }) noMstlm: number;
  @Column({ name: 'red', type: 'int', nullable: true }) red: number;
  @Column({ name: 'sdad', type: 'int', nullable: true }) sdad: number;
}

@Entity('user_r')
export class UserREntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nou', type: 'int', nullable: true }) nou: number;
  @Column({ name: 'name_u', type: 'varchar', length: 100, nullable: true }) nameU: string;
  @Column({ name: 'pass', type: 'varchar', length: 20, nullable: true }) pass: string;
  @Column({ name: 'sys', type: 'int', nullable: true }) sys: number;
  @Column({ name: 'ed', type: 'int', nullable: true }) ed: number;
  @Column({ name: 'de', type: 'int', nullable: true }) de: number;
  @Column({ name: 's_k', type: 'int', nullable: true }) sK: number;
  @Column({ name: 's_s', type: 'int', nullable: true }) sS: number;
  @Column({ name: 'rep', type: 'int', nullable: true }) rep: number;
  @Column({ name: 'noa', type: 'int', nullable: true }) noa: number;
  @Column({ name: 'h', type: 'int', nullable: true }) h: number;
  @Column({ name: 'appld', type: 'varchar', length: 50, nullable: true }) appld: string;
}

@Entity('ys')
export class YsEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ name: 'nosys', type: 'int', nullable: true }) nosys: number;
  @Column({ name: 'namea', type: 'varchar', length: 50, nullable: true }) namea: string;
  @Column({ name: 'rys', type: 'decimal', precision: 14, scale: 2, nullable: true }) rys: number;
  @Column({ name: 'rsw', type: 'decimal', precision: 14, scale: 2, nullable: true }) rsw: number;
  @Column({ name: 'fr', type: 'decimal', precision: 14, scale: 2, nullable: true }) fr: number;
}
