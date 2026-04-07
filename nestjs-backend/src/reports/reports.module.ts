import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { JournalEntryEntity, VoucherEntity } from './entities/report.entity';
import { SalesInvoiceEntity, PurchaseInvoiceEntity } from '../invoices/entities/invoice.entity';
import { SubAccountEntity } from '../accounts/entities/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JournalEntryEntity,
      VoucherEntity,
      SalesInvoiceEntity,
      PurchaseInvoiceEntity,
      SubAccountEntity,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
