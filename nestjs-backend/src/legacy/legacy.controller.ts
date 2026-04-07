// =============================================
// متحكم عام للجداول المتبقية
// REST API تلقائي لكل الجداول
// =============================================
import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LegacyService } from './legacy.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('legacy')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('legacy')
export class LegacyController {
  constructor(private readonly svc: LegacyService) {}

  @Get('addtb') @ApiOperation({ summary: 'ADDTB' })
  getAddtb(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getAddtb(+(skip||0), +(take||50)); }
  @Post('addtb') createAddtb(@Body() dto: any) { return this.svc.createAddtb(dto); }
  @Put('addtb/:id') updateAddtb(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateAddtb(id, dto); }
  @Delete('addtb/:id') deleteAddtb(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteAddtb(id); }

  @Get('ahtsr') @ApiOperation({ summary: 'AHTSR' })
  getAhtsr(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getAhtsr(+(skip||0), +(take||50)); }
  @Post('ahtsr') createAhtsr(@Body() dto: any) { return this.svc.createAhtsr(dto); }
  @Put('ahtsr/:id') updateAhtsr(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateAhtsr(id, dto); }
  @Delete('ahtsr/:id') deleteAhtsr(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteAhtsr(id); }

  @Get('akd') @ApiOperation({ summary: 'AKD' })
  getAkd(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getAkd(+(skip||0), +(take||50)); }
  @Post('akd') createAkd(@Body() dto: any) { return this.svc.createAkd(dto); }
  @Put('akd/:id') updateAkd(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateAkd(id, dto); }
  @Delete('akd/:id') deleteAkd(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteAkd(id); }

  @Get('akfaf') @ApiOperation({ summary: 'AKFAF' })
  getAkfaf(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getAkfaf(+(skip||0), +(take||50)); }
  @Post('akfaf') createAkfaf(@Body() dto: any) { return this.svc.createAkfaf(dto); }
  @Put('akfaf/:id') updateAkfaf(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateAkfaf(id, dto); }
  @Delete('akfaf/:id') deleteAkfaf(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteAkfaf(id); }

  @Get('aky') @ApiOperation({ summary: 'AKY' })
  getAky(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getAky(+(skip||0), +(take||50)); }
  @Post('aky') createAky(@Body() dto: any) { return this.svc.createAky(dto); }
  @Put('aky/:id') updateAky(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateAky(id, dto); }
  @Delete('aky/:id') deleteAky(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteAky(id); }

  @Get('amrgrp') @ApiOperation({ summary: 'AMRGRP' })
  getAmrgrp(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getAmrgrp(+(skip||0), +(take||50)); }
  @Post('amrgrp') createAmrgrp(@Body() dto: any) { return this.svc.createAmrgrp(dto); }
  @Put('amrgrp/:id') updateAmrgrp(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateAmrgrp(id, dto); }
  @Delete('amrgrp/:id') deleteAmrgrp(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteAmrgrp(id); }

  @Get('arshf') @ApiOperation({ summary: 'ARSHF' })
  getArshf(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getArshf(+(skip||0), +(take||50)); }
  @Post('arshf') createArshf(@Body() dto: any) { return this.svc.createArshf(dto); }
  @Put('arshf/:id') updateArshf(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateArshf(id, dto); }
  @Delete('arshf/:id') deleteArshf(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteArshf(id); }

  @Get('arsrff') @ApiOperation({ summary: 'ARSRFF' })
  getArsrff(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getArsrff(+(skip||0), +(take||50)); }
  @Post('arsrff') createArsrff(@Body() dto: any) { return this.svc.createArsrff(dto); }
  @Put('arsrff/:id') updateArsrff(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateArsrff(id, dto); }
  @Delete('arsrff/:id') deleteArsrff(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteArsrff(id); }

  @Get('a-g') @ApiOperation({ summary: 'A_G' })
  getAG(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getAG(+(skip||0), +(take||50)); }
  @Post('a-g') createAG(@Body() dto: any) { return this.svc.createAG(dto); }
  @Put('a-g/:id') updateAG(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateAG(id, dto); }
  @Delete('a-g/:id') deleteAG(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteAG(id); }

  @Get('car') @ApiOperation({ summary: 'CAR' })
  getCar(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getCar(+(skip||0), +(take||50)); }
  @Post('car') createCar(@Body() dto: any) { return this.svc.createCar(dto); }
  @Put('car/:id') updateCar(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateCar(id, dto); }
  @Delete('car/:id') deleteCar(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteCar(id); }

  @Get('dar') @ApiOperation({ summary: 'DAR' })
  getDar(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getDar(+(skip||0), +(take||50)); }
  @Post('dar') createDar(@Body() dto: any) { return this.svc.createDar(dto); }
  @Put('dar/:id') updateDar(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateDar(id, dto); }
  @Delete('dar/:id') deleteDar(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteDar(id); }

  @Get('dataffff') @ApiOperation({ summary: 'DATAFFFF' })
  getDataffff(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getDataffff(+(skip||0), +(take||50)); }
  @Post('dataffff') createDataffff(@Body() dto: any) { return this.svc.createDataffff(dto); }
  @Put('dataffff/:id') updateDataffff(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateDataffff(id, dto); }
  @Delete('dataffff/:id') deleteDataffff(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteDataffff(id); }

  @Get('dataffx') @ApiOperation({ summary: 'DATAFFX' })
  getDataffx(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getDataffx(+(skip||0), +(take||50)); }
  @Post('dataffx') createDataffx(@Body() dto: any) { return this.svc.createDataffx(dto); }
  @Put('dataffx/:id') updateDataffx(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateDataffx(id, dto); }
  @Delete('dataffx/:id') deleteDataffx(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteDataffx(id); }

  @Get('datafx') @ApiOperation({ summary: 'DATAFX' })
  getDatafx(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getDatafx(+(skip||0), +(take||50)); }
  @Post('datafx') createDatafx(@Body() dto: any) { return this.svc.createDatafx(dto); }
  @Put('datafx/:id') updateDatafx(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateDatafx(id, dto); }
  @Delete('datafx/:id') deleteDatafx(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteDatafx(id); }

  @Get('datafy') @ApiOperation({ summary: 'DATAFY' })
  getDatafy(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getDatafy(+(skip||0), +(take||50)); }
  @Post('datafy') createDatafy(@Body() dto: any) { return this.svc.createDatafy(dto); }
  @Put('datafy/:id') updateDatafy(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateDatafy(id, dto); }
  @Delete('datafy/:id') deleteDatafy(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteDatafy(id); }

  @Get('datak-year-n') @ApiOperation({ summary: 'DATAK_YEAR_N' })
  getDatakYearN(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getDatakYearN(+(skip||0), +(take||50)); }
  @Post('datak-year-n') createDatakYearN(@Body() dto: any) { return this.svc.createDatakYearN(dto); }
  @Put('datak-year-n/:id') updateDatakYearN(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateDatakYearN(id, dto); }
  @Delete('datak-year-n/:id') deleteDatakYearN(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteDatakYearN(id); }

  @Get('datanet') @ApiOperation({ summary: 'DATANET' })
  getDatanet(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getDatanet(+(skip||0), +(take||50)); }
  @Post('datanet') createDatanet(@Body() dto: any) { return this.svc.createDatanet(dto); }
  @Put('datanet/:id') updateDatanet(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateDatanet(id, dto); }
  @Delete('datanet/:id') deleteDatanet(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteDatanet(id); }

  @Get('data-ar') @ApiOperation({ summary: 'DATA_AR' })
  getDataAr(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getDataAr(+(skip||0), +(take||50)); }
  @Post('data-ar') createDataAr(@Body() dto: any) { return this.svc.createDataAr(dto); }
  @Put('data-ar/:id') updateDataAr(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateDataAr(id, dto); }
  @Delete('data-ar/:id') deleteDataAr(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteDataAr(id); }

  @Get('data-sn') @ApiOperation({ summary: 'DATA_SN' })
  getDataSn(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getDataSn(+(skip||0), +(take||50)); }
  @Post('data-sn') createDataSn(@Body() dto: any) { return this.svc.createDataSn(dto); }
  @Put('data-sn/:id') updateDataSn(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateDataSn(id, dto); }
  @Delete('data-sn/:id') deleteDataSn(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteDataSn(id); }

  @Get('del-r') @ApiOperation({ summary: 'DEL_R' })
  getDelR(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getDelR(+(skip||0), +(take||50)); }
  @Post('del-r') createDelR(@Body() dto: any) { return this.svc.createDelR(dto); }
  @Put('del-r/:id') updateDelR(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateDelR(id, dto); }
  @Delete('del-r/:id') deleteDelR(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteDelR(id); }

  @Get('fatbfx') @ApiOperation({ summary: 'FATBFX' })
  getFatbfx(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getFatbfx(+(skip||0), +(take||50)); }
  @Post('fatbfx') createFatbfx(@Body() dto: any) { return this.svc.createFatbfx(dto); }
  @Put('fatbfx/:id') updateFatbfx(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateFatbfx(id, dto); }
  @Delete('fatbfx/:id') deleteFatbfx(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteFatbfx(id); }

  @Get('fin') @ApiOperation({ summary: 'FIN' })
  getFin(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getFin(+(skip||0), +(take||50)); }
  @Post('fin') createFin(@Body() dto: any) { return this.svc.createFin(dto); }
  @Put('fin/:id') updateFin(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateFin(id, dto); }
  @Delete('fin/:id') deleteFin(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteFin(id); }

  @Get('fslsdad') @ApiOperation({ summary: 'FSLSDAD' })
  getFslsdad(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getFslsdad(+(skip||0), +(take||50)); }
  @Post('fslsdad') createFslsdad(@Body() dto: any) { return this.svc.createFslsdad(dto); }
  @Put('fslsdad/:id') updateFslsdad(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateFslsdad(id, dto); }
  @Delete('fslsdad/:id') deleteFslsdad(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteFslsdad(id); }

  @Get('fslsdadms') @ApiOperation({ summary: 'FSLSDADMS' })
  getFslsdadms(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getFslsdadms(+(skip||0), +(take||50)); }
  @Post('fslsdadms') createFslsdadms(@Body() dto: any) { return this.svc.createFslsdadms(dto); }
  @Put('fslsdadms/:id') updateFslsdadms(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateFslsdadms(id, dto); }
  @Delete('fslsdadms/:id') deleteFslsdadms(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteFslsdadms(id); }

  @Get('hmh') @ApiOperation({ summary: 'HMH' })
  getHmh(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getHmh(+(skip||0), +(take||50)); }
  @Post('hmh') createHmh(@Body() dto: any) { return this.svc.createHmh(dto); }
  @Put('hmh/:id') updateHmh(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateHmh(id, dto); }
  @Delete('hmh/:id') deleteHmh(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteHmh(id); }

  @Get('ksh') @ApiOperation({ summary: 'KSH' })
  getKsh(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getKsh(+(skip||0), +(take||50)); }
  @Post('ksh') createKsh(@Body() dto: any) { return this.svc.createKsh(dto); }
  @Put('ksh/:id') updateKsh(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateKsh(id, dto); }
  @Delete('ksh/:id') deleteKsh(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteKsh(id); }

  @Get('kyd') @ApiOperation({ summary: 'KYD' })
  getKyd(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getKyd(+(skip||0), +(take||50)); }
  @Post('kyd') createKyd(@Body() dto: any) { return this.svc.createKyd(dto); }
  @Put('kyd/:id') updateKyd(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateKyd(id, dto); }
  @Delete('kyd/:id') deleteKyd(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteKyd(id); }

  @Get('lov-aa') @ApiOperation({ summary: 'LOV_AA' })
  getLovAa(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getLovAa(+(skip||0), +(take||50)); }
  @Post('lov-aa') createLovAa(@Body() dto: any) { return this.svc.createLovAa(dto); }
  @Put('lov-aa/:id') updateLovAa(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateLovAa(id, dto); }
  @Delete('lov-aa/:id') deleteLovAa(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteLovAa(id); }

  @Get('mat') @ApiOperation({ summary: 'MAT' })
  getMat(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getMat(+(skip||0), +(take||50)); }
  @Post('mat') createMat(@Body() dto: any) { return this.svc.createMat(dto); }
  @Put('mat/:id') updateMat(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateMat(id, dto); }
  @Delete('mat/:id') deleteMat(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteMat(id); }

  @Get('memopr') @ApiOperation({ summary: 'MEMOPR' })
  getMemopr(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getMemopr(+(skip||0), +(take||50)); }
  @Post('memopr') createMemopr(@Body() dto: any) { return this.svc.createMemopr(dto); }
  @Put('memopr/:id') updateMemopr(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateMemopr(id, dto); }
  @Delete('memopr/:id') deleteMemopr(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteMemopr(id); }

  @Get('mkb') @ApiOperation({ summary: 'MKB' })
  getMkb(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getMkb(+(skip||0), +(take||50)); }
  @Post('mkb') createMkb(@Body() dto: any) { return this.svc.createMkb(dto); }
  @Put('mkb/:id') updateMkb(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateMkb(id, dto); }
  @Delete('mkb/:id') deleteMkb(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteMkb(id); }

  @Get('mkb2') @ApiOperation({ summary: 'MKB2' })
  getMkb2(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getMkb2(+(skip||0), +(take||50)); }
  @Post('mkb2') createMkb2(@Body() dto: any) { return this.svc.createMkb2(dto); }
  @Put('mkb2/:id') updateMkb2(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateMkb2(id, dto); }
  @Delete('mkb2/:id') deleteMkb2(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteMkb2(id); }

  @Get('mmsh') @ApiOperation({ summary: 'MMSH' })
  getMmsh(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getMmsh(+(skip||0), +(take||50)); }
  @Post('mmsh') createMmsh(@Body() dto: any) { return this.svc.createMmsh(dto); }
  @Put('mmsh/:id') updateMmsh(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateMmsh(id, dto); }
  @Delete('mmsh/:id') deleteMmsh(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteMmsh(id); }

  @Get('mol') @ApiOperation({ summary: 'MOL' })
  getMol(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getMol(+(skip||0), +(take||50)); }
  @Post('mol') createMol(@Body() dto: any) { return this.svc.createMol(dto); }
  @Put('mol/:id') updateMol(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateMol(id, dto); }
  @Delete('mol/:id') deleteMol(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteMol(id); }

  @Get('molf') @ApiOperation({ summary: 'MOLF' })
  getMolf(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getMolf(+(skip||0), +(take||50)); }
  @Post('molf') createMolf(@Body() dto: any) { return this.svc.createMolf(dto); }
  @Put('molf/:id') updateMolf(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateMolf(id, dto); }
  @Delete('molf/:id') deleteMolf(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteMolf(id); }

  @Get('momomo') @ApiOperation({ summary: 'MOMOMO' })
  getMomomo(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getMomomo(+(skip||0), +(take||50)); }
  @Post('momomo') createMomomo(@Body() dto: any) { return this.svc.createMomomo(dto); }
  @Put('momomo/:id') updateMomomo(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateMomomo(id, dto); }
  @Delete('momomo/:id') deleteMomomo(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteMomomo(id); }

  @Get('mrczet') @ApiOperation({ summary: 'MRCZET' })
  getMrczet(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getMrczet(+(skip||0), +(take||50)); }
  @Post('mrczet') createMrczet(@Body() dto: any) { return this.svc.createMrczet(dto); }
  @Put('mrczet/:id') updateMrczet(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateMrczet(id, dto); }
  @Delete('mrczet/:id') deleteMrczet(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteMrczet(id); }

  @Get('msc') @ApiOperation({ summary: 'MSC' })
  getMsc(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getMsc(+(skip||0), +(take||50)); }
  @Post('msc') createMsc(@Body() dto: any) { return this.svc.createMsc(dto); }
  @Put('msc/:id') updateMsc(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateMsc(id, dto); }
  @Delete('msc/:id') deleteMsc(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteMsc(id); }

  @Get('msrif') @ApiOperation({ summary: 'MSRIF' })
  getMsrif(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getMsrif(+(skip||0), +(take||50)); }
  @Post('msrif') createMsrif(@Body() dto: any) { return this.svc.createMsrif(dto); }
  @Put('msrif/:id') updateMsrif(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateMsrif(id, dto); }
  @Delete('msrif/:id') deleteMsrif(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteMsrif(id); }

  @Get('mv') @ApiOperation({ summary: 'MV' })
  getMv(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getMv(+(skip||0), +(take||50)); }
  @Post('mv') createMv(@Body() dto: any) { return this.svc.createMv(dto); }
  @Put('mv/:id') updateMv(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateMv(id, dto); }
  @Delete('mv/:id') deleteMv(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteMv(id); }

  @Get('mvall') @ApiOperation({ summary: 'MVALL' })
  getMvall(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getMvall(+(skip||0), +(take||50)); }
  @Post('mvall') createMvall(@Body() dto: any) { return this.svc.createMvall(dto); }
  @Put('mvall/:id') updateMvall(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateMvall(id, dto); }
  @Delete('mvall/:id') deleteMvall(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteMvall(id); }

  @Get('mzt') @ApiOperation({ summary: 'MZT' })
  getMzt(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getMzt(+(skip||0), +(take||50)); }
  @Post('mzt') createMzt(@Body() dto: any) { return this.svc.createMzt(dto); }
  @Put('mzt/:id') updateMzt(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateMzt(id, dto); }
  @Delete('mzt/:id') deleteMzt(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteMzt(id); }

  @Get('nok') @ApiOperation({ summary: 'NOK' })
  getNok(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getNok(+(skip||0), +(take||50)); }
  @Post('nok') createNok(@Body() dto: any) { return this.svc.createNok(dto); }
  @Put('nok/:id') updateNok(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateNok(id, dto); }
  @Delete('nok/:id') deleteNok(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteNok(id); }

  @Get('nsdk2') @ApiOperation({ summary: 'NSDK2' })
  getNsdk2(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getNsdk2(+(skip||0), +(take||50)); }
  @Post('nsdk2') createNsdk2(@Body() dto: any) { return this.svc.createNsdk2(dto); }
  @Put('nsdk2/:id') updateNsdk2(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateNsdk2(id, dto); }
  @Delete('nsdk2/:id') deleteNsdk2(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteNsdk2(id); }

  @Get('nurs') @ApiOperation({ summary: 'NURS' })
  getNurs(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getNurs(+(skip||0), +(take||50)); }
  @Post('nurs') createNurs(@Body() dto: any) { return this.svc.createNurs(dto); }
  @Put('nurs/:id') updateNurs(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateNurs(id, dto); }
  @Delete('nurs/:id') deleteNurs(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteNurs(id); }

  @Get('prg') @ApiOperation({ summary: 'PRG' })
  getPrg(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getPrg(+(skip||0), +(take||50)); }
  @Post('prg') createPrg(@Body() dto: any) { return this.svc.createPrg(dto); }
  @Put('prg/:id') updatePrg(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updatePrg(id, dto); }
  @Delete('prg/:id') deletePrg(@Param('id', ParseIntPipe) id: number) { return this.svc.deletePrg(id); }

  @Get('red') @ApiOperation({ summary: 'RED' })
  getRed(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getRed(+(skip||0), +(take||50)); }
  @Post('red') createRed(@Body() dto: any) { return this.svc.createRed(dto); }
  @Put('red/:id') updateRed(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateRed(id, dto); }
  @Delete('red/:id') deleteRed(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteRed(id); }

  @Get('redmmm') @ApiOperation({ summary: 'REDMMM' })
  getRedmmm(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getRedmmm(+(skip||0), +(take||50)); }
  @Post('redmmm') createRedmmm(@Body() dto: any) { return this.svc.createRedmmm(dto); }
  @Put('redmmm/:id') updateRedmmm(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateRedmmm(id, dto); }
  @Delete('redmmm/:id') deleteRedmmm(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteRedmmm(id); }

  @Get('redmmmd') @ApiOperation({ summary: 'REDMMMD' })
  getRedmmmd(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getRedmmmd(+(skip||0), +(take||50)); }
  @Post('redmmmd') createRedmmmd(@Body() dto: any) { return this.svc.createRedmmmd(dto); }
  @Put('redmmmd/:id') updateRedmmmd(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateRedmmmd(id, dto); }
  @Delete('redmmmd/:id') deleteRedmmmd(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteRedmmmd(id); }

  @Get('redmmt') @ApiOperation({ summary: 'REDMMT' })
  getRedmmt(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getRedmmt(+(skip||0), +(take||50)); }
  @Post('redmmt') createRedmmt(@Body() dto: any) { return this.svc.createRedmmt(dto); }
  @Put('redmmt/:id') updateRedmmt(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateRedmmt(id, dto); }
  @Delete('redmmt/:id') deleteRedmmt(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteRedmmt(id); }

  @Get('redmmw') @ApiOperation({ summary: 'REDMMW' })
  getRedmmw(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getRedmmw(+(skip||0), +(take||50)); }
  @Post('redmmw') createRedmmw(@Body() dto: any) { return this.svc.createRedmmw(dto); }
  @Put('redmmw/:id') updateRedmmw(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateRedmmw(id, dto); }
  @Delete('redmmw/:id') deleteRedmmw(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteRedmmw(id); }

  @Get('redmmw2') @ApiOperation({ summary: 'REDMMW2' })
  getRedmmw2(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getRedmmw2(+(skip||0), +(take||50)); }
  @Post('redmmw2') createRedmmw2(@Body() dto: any) { return this.svc.createRedmmw2(dto); }
  @Put('redmmw2/:id') updateRedmmw2(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateRedmmw2(id, dto); }
  @Delete('redmmw2/:id') deleteRedmmw2(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteRedmmw2(id); }

  @Get('redmmw2d') @ApiOperation({ summary: 'REDMMW2D' })
  getRedmmw2d(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getRedmmw2d(+(skip||0), +(take||50)); }
  @Post('redmmw2d') createRedmmw2d(@Body() dto: any) { return this.svc.createRedmmw2d(dto); }
  @Put('redmmw2d/:id') updateRedmmw2d(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateRedmmw2d(id, dto); }
  @Delete('redmmw2d/:id') deleteRedmmw2d(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteRedmmw2d(id); }

  @Get('redmmwd') @ApiOperation({ summary: 'REDMMWD' })
  getRedmmwd(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getRedmmwd(+(skip||0), +(take||50)); }
  @Post('redmmwd') createRedmmwd(@Body() dto: any) { return this.svc.createRedmmwd(dto); }
  @Put('redmmwd/:id') updateRedmmwd(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateRedmmwd(id, dto); }
  @Delete('redmmwd/:id') deleteRedmmwd(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteRedmmwd(id); }

  @Get('redmmz') @ApiOperation({ summary: 'REDMMZ' })
  getRedmmz(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getRedmmz(+(skip||0), +(take||50)); }
  @Post('redmmz') createRedmmz(@Body() dto: any) { return this.svc.createRedmmz(dto); }
  @Put('redmmz/:id') updateRedmmz(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateRedmmz(id, dto); }
  @Delete('redmmz/:id') deleteRedmmz(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteRedmmz(id); }

  @Get('redmt') @ApiOperation({ summary: 'REDMT' })
  getRedmt(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getRedmt(+(skip||0), +(take||50)); }
  @Post('redmt') createRedmt(@Body() dto: any) { return this.svc.createRedmt(dto); }
  @Put('redmt/:id') updateRedmt(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateRedmt(id, dto); }
  @Delete('redmt/:id') deleteRedmt(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteRedmt(id); }

  @Get('redmw') @ApiOperation({ summary: 'REDMW' })
  getRedmw(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getRedmw(+(skip||0), +(take||50)); }
  @Post('redmw') createRedmw(@Body() dto: any) { return this.svc.createRedmw(dto); }
  @Put('redmw/:id') updateRedmw(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateRedmw(id, dto); }
  @Delete('redmw/:id') deleteRedmw(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteRedmw(id); }

  @Get('redmwx') @ApiOperation({ summary: 'REDMWX' })
  getRedmwx(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getRedmwx(+(skip||0), +(take||50)); }
  @Post('redmwx') createRedmwx(@Body() dto: any) { return this.svc.createRedmwx(dto); }
  @Put('redmwx/:id') updateRedmwx(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateRedmwx(id, dto); }
  @Delete('redmwx/:id') deleteRedmwx(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteRedmwx(id); }

  @Get('redmz') @ApiOperation({ summary: 'REDMZ' })
  getRedmz(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getRedmz(+(skip||0), +(take||50)); }
  @Post('redmz') createRedmz(@Body() dto: any) { return this.svc.createRedmz(dto); }
  @Put('redmz/:id') updateRedmz(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateRedmz(id, dto); }
  @Delete('redmz/:id') deleteRedmz(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteRedmz(id); }

  @Get('redp') @ApiOperation({ summary: 'REDP' })
  getRedp(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getRedp(+(skip||0), +(take||50)); }
  @Post('redp') createRedp(@Body() dto: any) { return this.svc.createRedp(dto); }
  @Put('redp/:id') updateRedp(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateRedp(id, dto); }
  @Delete('redp/:id') deleteRedp(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteRedp(id); }

  @Get('red-ex') @ApiOperation({ summary: 'RED_EX' })
  getRedEx(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getRedEx(+(skip||0), +(take||50)); }
  @Post('red-ex') createRedEx(@Body() dto: any) { return this.svc.createRedEx(dto); }
  @Put('red-ex/:id') updateRedEx(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateRedEx(id, dto); }
  @Delete('red-ex/:id') deleteRedEx(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteRedEx(id); }

  @Get('repall') @ApiOperation({ summary: 'REPALL' })
  getRepall(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getRepall(+(skip||0), +(take||50)); }
  @Post('repall') createRepall(@Body() dto: any) { return this.svc.createRepall(dto); }
  @Put('repall/:id') updateRepall(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateRepall(id, dto); }
  @Delete('repall/:id') deleteRepall(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteRepall(id); }

  @Get('repamp') @ApiOperation({ summary: 'REPAMP' })
  getRepamp(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getRepamp(+(skip||0), +(take||50)); }
  @Post('repamp') createRepamp(@Body() dto: any) { return this.svc.createRepamp(dto); }
  @Put('repamp/:id') updateRepamp(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateRepamp(id, dto); }
  @Delete('repamp/:id') deleteRepamp(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteRepamp(id); }

  @Get('repkhm') @ApiOperation({ summary: 'REPKHM' })
  getRepkhm(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getRepkhm(+(skip||0), +(take||50)); }
  @Post('repkhm') createRepkhm(@Body() dto: any) { return this.svc.createRepkhm(dto); }
  @Put('repkhm/:id') updateRepkhm(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateRepkhm(id, dto); }
  @Delete('repkhm/:id') deleteRepkhm(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteRepkhm(id); }

  @Get('repkhxxx') @ApiOperation({ summary: 'REPKHXXX' })
  getRepkhxxx(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getRepkhxxx(+(skip||0), +(take||50)); }
  @Post('repkhxxx') createRepkhxxx(@Body() dto: any) { return this.svc.createRepkhxxx(dto); }
  @Put('repkhxxx/:id') updateRepkhxxx(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateRepkhxxx(id, dto); }
  @Delete('repkhxxx/:id') deleteRepkhxxx(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteRepkhxxx(id); }

  @Get('repmsm') @ApiOperation({ summary: 'REPMSM' })
  getRepmsm(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getRepmsm(+(skip||0), +(take||50)); }
  @Post('repmsm') createRepmsm(@Body() dto: any) { return this.svc.createRepmsm(dto); }
  @Put('repmsm/:id') updateRepmsm(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateRepmsm(id, dto); }
  @Delete('repmsm/:id') deleteRepmsm(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteRepmsm(id); }

  @Get('reprorh') @ApiOperation({ summary: 'REPRORH' })
  getReprorh(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getReprorh(+(skip||0), +(take||50)); }
  @Post('reprorh') createReprorh(@Body() dto: any) { return this.svc.createReprorh(dto); }
  @Put('reprorh/:id') updateReprorh(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateReprorh(id, dto); }
  @Delete('reprorh/:id') deleteReprorh(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteReprorh(id); }

  @Get('rtf-ab') @ApiOperation({ summary: 'RTF_AB' })
  getRtfAb(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getRtfAb(+(skip||0), +(take||50)); }
  @Post('rtf-ab') createRtfAb(@Body() dto: any) { return this.svc.createRtfAb(dto); }
  @Put('rtf-ab/:id') updateRtfAb(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateRtfAb(id, dto); }
  @Delete('rtf-ab/:id') deleteRtfAb(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteRtfAb(id); }

  @Get('rt-ab') @ApiOperation({ summary: 'RT_AB' })
  getRtAb(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getRtAb(+(skip||0), +(take||50)); }
  @Post('rt-ab') createRtAb(@Body() dto: any) { return this.svc.createRtAb(dto); }
  @Put('rt-ab/:id') updateRtAb(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateRtAb(id, dto); }
  @Delete('rt-ab/:id') deleteRtAb(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteRtAb(id); }

  @Get('sarsh') @ApiOperation({ summary: 'SARSH' })
  getSarsh(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getSarsh(+(skip||0), +(take||50)); }
  @Post('sarsh') createSarsh(@Body() dto: any) { return this.svc.createSarsh(dto); }
  @Put('sarsh/:id') updateSarsh(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateSarsh(id, dto); }
  @Delete('sarsh/:id') deleteSarsh(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteSarsh(id); }

  @Get('sendsms') @ApiOperation({ summary: 'SENDSMS' })
  getSendsms(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getSendsms(+(skip||0), +(take||50)); }
  @Post('sendsms') createSendsms(@Body() dto: any) { return this.svc.createSendsms(dto); }
  @Put('sendsms/:id') updateSendsms(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateSendsms(id, dto); }
  @Delete('sendsms/:id') deleteSendsms(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteSendsms(id); }

  @Get('sendsms-s') @ApiOperation({ summary: 'SENDSMS_S' })
  getSendsmsS(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getSendsmsS(+(skip||0), +(take||50)); }
  @Post('sendsms-s') createSendsmsS(@Body() dto: any) { return this.svc.createSendsmsS(dto); }
  @Put('sendsms-s/:id') updateSendsmsS(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateSendsmsS(id, dto); }
  @Delete('sendsms-s/:id') deleteSendsmsS(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteSendsmsS(id); }

  @Get('sndk22') @ApiOperation({ summary: 'SNDK22' })
  getSndk22(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getSndk22(+(skip||0), +(take||50)); }
  @Post('sndk22') createSndk22(@Body() dto: any) { return this.svc.createSndk22(dto); }
  @Put('sndk22/:id') updateSndk22(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateSndk22(id, dto); }
  @Delete('sndk22/:id') deleteSndk22(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteSndk22(id); }

  @Get('sndknetf') @ApiOperation({ summary: 'SNDKNETF' })
  getSndknetf(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getSndknetf(+(skip||0), +(take||50)); }
  @Post('sndknetf') createSndknetf(@Body() dto: any) { return this.svc.createSndknetf(dto); }
  @Put('sndknetf/:id') updateSndknetf(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateSndknetf(id, dto); }
  @Delete('sndknetf/:id') deleteSndknetf(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteSndknetf(id); }

  @Get('sndko') @ApiOperation({ summary: 'SNDKO' })
  getSndko(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getSndko(+(skip||0), +(take||50)); }
  @Post('sndko') createSndko(@Body() dto: any) { return this.svc.createSndko(dto); }
  @Put('sndko/:id') updateSndko(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateSndko(id, dto); }
  @Delete('sndko/:id') deleteSndko(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteSndko(id); }

  @Get('sndkof') @ApiOperation({ summary: 'SNDKOF' })
  getSndkof(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getSndkof(+(skip||0), +(take||50)); }
  @Post('sndkof') createSndkof(@Body() dto: any) { return this.svc.createSndkof(dto); }
  @Put('sndkof/:id') updateSndkof(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateSndkof(id, dto); }
  @Delete('sndkof/:id') deleteSndkof(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteSndkof(id); }

  @Get('sndkrs') @ApiOperation({ summary: 'SNDKRS' })
  getSndkrs(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getSndkrs(+(skip||0), +(take||50)); }
  @Post('sndkrs') createSndkrs(@Body() dto: any) { return this.svc.createSndkrs(dto); }
  @Put('sndkrs/:id') updateSndkrs(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateSndkrs(id, dto); }
  @Delete('sndkrs/:id') deleteSndkrs(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteSndkrs(id); }

  @Get('sndksn') @ApiOperation({ summary: 'SNDKSN' })
  getSndksn(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getSndksn(+(skip||0), +(take||50)); }
  @Post('sndksn') createSndksn(@Body() dto: any) { return this.svc.createSndksn(dto); }
  @Put('sndksn/:id') updateSndksn(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateSndksn(id, dto); }
  @Delete('sndksn/:id') deleteSndksn(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteSndksn(id); }

  @Get('sndksnf') @ApiOperation({ summary: 'SNDKSNF' })
  getSndksnf(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getSndksnf(+(skip||0), +(take||50)); }
  @Post('sndksnf') createSndksnf(@Body() dto: any) { return this.svc.createSndksnf(dto); }
  @Put('sndksnf/:id') updateSndksnf(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateSndksnf(id, dto); }
  @Delete('sndksnf/:id') deleteSndksnf(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteSndksnf(id); }

  @Get('sndk-a') @ApiOperation({ summary: 'SNDK_A' })
  getSndkA(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getSndkA(+(skip||0), +(take||50)); }
  @Post('sndk-a') createSndkA(@Body() dto: any) { return this.svc.createSndkA(dto); }
  @Put('sndk-a/:id') updateSndkA(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateSndkA(id, dto); }
  @Delete('sndk-a/:id') deleteSndkA(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteSndkA(id); }

  @Get('snds22') @ApiOperation({ summary: 'SNDS22' })
  getSnds22(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getSnds22(+(skip||0), +(take||50)); }
  @Post('snds22') createSnds22(@Body() dto: any) { return this.svc.createSnds22(dto); }
  @Put('snds22/:id') updateSnds22(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateSnds22(id, dto); }
  @Delete('snds22/:id') deleteSnds22(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteSnds22(id); }

  @Get('thoel') @ApiOperation({ summary: 'THOEL' })
  getThoel(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getThoel(+(skip||0), +(take||50)); }
  @Post('thoel') createThoel(@Body() dto: any) { return this.svc.createThoel(dto); }
  @Put('thoel/:id') updateThoel(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateThoel(id, dto); }
  @Delete('thoel/:id') deleteThoel(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteThoel(id); }

  @Get('tr') @ApiOperation({ summary: 'TR' })
  getTr(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getTr(+(skip||0), +(take||50)); }
  @Post('tr') createTr(@Body() dto: any) { return this.svc.createTr(dto); }
  @Put('tr/:id') updateTr(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateTr(id, dto); }
  @Delete('tr/:id') deleteTr(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteTr(id); }

  @Get('trh') @ApiOperation({ summary: 'TRH' })
  getTrh(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getTrh(+(skip||0), +(take||50)); }
  @Post('trh') createTrh(@Body() dto: any) { return this.svc.createTrh(dto); }
  @Put('trh/:id') updateTrh(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateTrh(id, dto); }
  @Delete('trh/:id') deleteTrh(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteTrh(id); }

  @Get('trmb') @ApiOperation({ summary: 'TRMB' })
  getTrmb(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getTrmb(+(skip||0), +(take||50)); }
  @Post('trmb') createTrmb(@Body() dto: any) { return this.svc.createTrmb(dto); }
  @Put('trmb/:id') updateTrmb(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateTrmb(id, dto); }
  @Delete('trmb/:id') deleteTrmb(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteTrmb(id); }

  @Get('tssn') @ApiOperation({ summary: 'TSSN' })
  getTssn(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getTssn(+(skip||0), +(take||50)); }
  @Post('tssn') createTssn(@Body() dto: any) { return this.svc.createTssn(dto); }
  @Put('tssn/:id') updateTssn(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateTssn(id, dto); }
  @Delete('tssn/:id') deleteTssn(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteTssn(id); }

  @Get('tssnf') @ApiOperation({ summary: 'TSSNF' })
  getTssnf(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getTssnf(+(skip||0), +(take||50)); }
  @Post('tssnf') createTssnf(@Body() dto: any) { return this.svc.createTssnf(dto); }
  @Put('tssnf/:id') updateTssnf(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateTssnf(id, dto); }
  @Delete('tssnf/:id') deleteTssnf(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteTssnf(id); }

  @Get('tssx') @ApiOperation({ summary: 'TSSX' })
  getTssx(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getTssx(+(skip||0), +(take||50)); }
  @Post('tssx') createTssx(@Body() dto: any) { return this.svc.createTssx(dto); }
  @Put('tssx/:id') updateTssx(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateTssx(id, dto); }
  @Delete('tssx/:id') deleteTssx(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteTssx(id); }

  @Get('tssx2') @ApiOperation({ summary: 'TSSX2' })
  getTssx2(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getTssx2(+(skip||0), +(take||50)); }
  @Post('tssx2') createTssx2(@Body() dto: any) { return this.svc.createTssx2(dto); }
  @Put('tssx2/:id') updateTssx2(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateTssx2(id, dto); }
  @Delete('tssx2/:id') deleteTssx2(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteTssx2(id); }

  @Get('ttel') @ApiOperation({ summary: 'TTEL' })
  getTtel(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getTtel(+(skip||0), +(take||50)); }
  @Post('ttel') createTtel(@Body() dto: any) { return this.svc.createTtel(dto); }
  @Put('ttel/:id') updateTtel(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateTtel(id, dto); }
  @Delete('ttel/:id') deleteTtel(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteTtel(id); }

  @Get('tyht') @ApiOperation({ summary: 'TYHT' })
  getTyht(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getTyht(+(skip||0), +(take||50)); }
  @Post('tyht') createTyht(@Body() dto: any) { return this.svc.createTyht(dto); }
  @Put('tyht/:id') updateTyht(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateTyht(id, dto); }
  @Delete('tyht/:id') deleteTyht(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteTyht(id); }

  @Get('typems') @ApiOperation({ summary: 'TYPEMS' })
  getTypems(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getTypems(+(skip||0), +(take||50)); }
  @Post('typems') createTypems(@Body() dto: any) { return this.svc.createTypems(dto); }
  @Put('typems/:id') updateTypems(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateTypems(id, dto); }
  @Delete('typems/:id') deleteTypems(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteTypems(id); }

  @Get('ty-ms') @ApiOperation({ summary: 'TY_MS' })
  getTyMs(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getTyMs(+(skip||0), +(take||50)); }
  @Post('ty-ms') createTyMs(@Body() dto: any) { return this.svc.createTyMs(dto); }
  @Put('ty-ms/:id') updateTyMs(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateTyMs(id, dto); }
  @Delete('ty-ms/:id') deleteTyMs(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteTyMs(id); }

  @Get('t-r-t') @ApiOperation({ summary: 'T_R_T' })
  getTRT(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getTRT(+(skip||0), +(take||50)); }
  @Post('t-r-t') createTRT(@Body() dto: any) { return this.svc.createTRT(dto); }
  @Put('t-r-t/:id') updateTRT(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateTRT(id, dto); }
  @Delete('t-r-t/:id') deleteTRT(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteTRT(id); }

  @Get('usergn') @ApiOperation({ summary: 'USERGN' })
  getUsergn(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getUsergn(+(skip||0), +(take||50)); }
  @Post('usergn') createUsergn(@Body() dto: any) { return this.svc.createUsergn(dto); }
  @Put('usergn/:id') updateUsergn(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateUsergn(id, dto); }
  @Delete('usergn/:id') deleteUsergn(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteUsergn(id); }

  @Get('user-mnatk') @ApiOperation({ summary: 'USER_MNATK' })
  getUserMnatk(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getUserMnatk(+(skip||0), +(take||50)); }
  @Post('user-mnatk') createUserMnatk(@Body() dto: any) { return this.svc.createUserMnatk(dto); }
  @Put('user-mnatk/:id') updateUserMnatk(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateUserMnatk(id, dto); }
  @Delete('user-mnatk/:id') deleteUserMnatk(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteUserMnatk(id); }

  @Get('user-r') @ApiOperation({ summary: 'USER_R' })
  getUserR(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getUserR(+(skip||0), +(take||50)); }
  @Post('user-r') createUserR(@Body() dto: any) { return this.svc.createUserR(dto); }
  @Put('user-r/:id') updateUserR(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateUserR(id, dto); }
  @Delete('user-r/:id') deleteUserR(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteUserR(id); }

  @Get('ys') @ApiOperation({ summary: 'YS' })
  getYs(@Query('skip') skip?: number, @Query('take') take?: number) { return this.svc.getYs(+(skip||0), +(take||50)); }
  @Post('ys') createYs(@Body() dto: any) { return this.svc.createYs(dto); }
  @Put('ys/:id') updateYs(@Param('id', ParseIntPipe) id: number, @Body() dto: any) { return this.svc.updateYs(id, dto); }
  @Delete('ys/:id') deleteYs(@Param('id', ParseIntPipe) id: number) { return this.svc.deleteYs(id); }
}
