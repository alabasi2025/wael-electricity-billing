import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import {
  SalesInvoiceEntity, SalesInvoiceDetailEntity,
  PurchaseInvoiceEntity, PurchaseInvoiceDetailEntity,
} from './entities/invoice.entity';
import { SubAccountEntity } from '../accounts/entities/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SalesInvoiceEntity,
      SalesInvoiceDetailEntity,
      PurchaseInvoiceEntity,
      PurchaseInvoiceDetailEntity,
      SubAccountEntity,
    ]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
