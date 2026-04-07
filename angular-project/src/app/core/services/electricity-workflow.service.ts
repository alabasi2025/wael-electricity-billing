import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  AccountDetail,
  ApiResponse,
  Center,
  Generator,
  Installation,
  Meter,
  PaginationParams,
  ReceiptVoucher,
  SubAccount,
} from '../models';
import { ApiService } from './api.service';

export interface ElectricityStats {
  meters: number;
  activeMeters: number;
  installations: number;
  generators: number;
  centers: number;
}

export interface ElectricitySubscriberProfile extends SubAccount {
  parentAccount?: {
    noA?: number;
    nameA?: string;
  };
  details?: AccountDetail[];
}

export interface ElectricityMeterRecord extends Meter {
  prevReading?: number;
  noa?: number;
}

export interface ElectricityInstallationRecord extends Installation {
  subscriberName?: string;
  meterId?: number;
}

export interface ElectricityGeneratorRecord extends Generator {
  fuelConsumption?: number;
  workingHours?: number;
}

export interface LegacyBillingRecord {
  id?: number;
  noa?: number;
  noaon?: number;
  dates?: string | Date;
  dates2?: string | Date;
  kh?: number;
  ks?: number;
  ast?: number;
  kast?: number;
  month?: number;
  nofat?: number;
  noaddn?: number;
  memoa?: string;
  rtr?: number;
  msgg?: number;
}

export interface LegacyPostingRecord {
  id?: number;
  nos?: number;
  dates?: string | Date;
  noa?: number;
  noa2?: number;
  totl?: number;
  sara?: number;
  nok?: number;
  nokon?: number;
  nosnf?: number;
  nms?: string;
  memos?: string;
  upd?: number;
}

export interface LegacyCollectionRecord {
  id?: number;
  nos?: number;
  noson?: number;
  dates?: string | Date;
  noa?: number;
  namea?: string;
  total?: number;
  totalm?: number;
  amt?: number;
  memo?: string;
  nms?: string;
  ts?: number;
  detailCount?: number;
  sampleSubscriber?: string;
}

export interface LegacyMessageRecord {
  id?: number;
  noa?: number;
  noan?: number;
  namea?: string;
  rsd?: number;
  da?: string | Date;
  notms?: number;
  typc?: string;
  mem?: string;
  tminall?: number;
  nomo?: number;
  nog?: number;
}

@Injectable({ providedIn: 'root' })
export class ElectricityWorkflowService {
  constructor(private api: ApiService) {}

  getOverviewStats(): Observable<ApiResponse<ElectricityStats>> {
    return this.api.getById<ElectricityStats>('electricity', 'stats');
  }

  getSubscribers(
    pagination: PaginationParams,
  ): Observable<ApiResponse<ElectricitySubscriberProfile[]>> {
    return this.api.getAll<ElectricitySubscriberProfile>('accounts/sub', pagination, {
      typea: 2,
    });
  }

  getSubscriberProfile(
    noa: number,
  ): Observable<ApiResponse<ElectricitySubscriberProfile>> {
    return this.api.getById<ElectricitySubscriberProfile>('accounts/sub', noa);
  }

  getMeters(
    pagination: PaginationParams,
  ): Observable<ApiResponse<ElectricityMeterRecord[]>> {
    return this.api.getAll<ElectricityMeterRecord>('electricity/meters', pagination);
  }

  getMeter(id: number): Observable<ApiResponse<ElectricityMeterRecord>> {
    return this.api.getById<ElectricityMeterRecord>('electricity/meters', id);
  }

  recordReading(
    id: number,
    reading: number,
  ): Observable<ApiResponse<ElectricityMeterRecord>> {
    return this.api.patch<ElectricityMeterRecord>(
      `electricity/meters/${id}/reading`,
      { reading },
    );
  }

  getInstallations(
    pagination: PaginationParams,
  ): Observable<ApiResponse<ElectricityInstallationRecord[]>> {
    return this.api.getAll<ElectricityInstallationRecord>(
      'electricity/installations',
      pagination,
    );
  }

  getGenerators(
    pagination: PaginationParams,
  ): Observable<ApiResponse<ElectricityGeneratorRecord[]>> {
    return this.api.getAll<ElectricityGeneratorRecord>(
      'electricity/generators',
      pagination,
    );
  }

  getCenters(): Observable<ApiResponse<Center[]>> {
    return this.api.getAll<Center>('electricity/centers');
  }

  getLegacyBilling(
    source: 'dataffx' | 'datafy',
    skip = 0,
    take = 30,
  ): Observable<ApiResponse<LegacyBillingRecord[]>> {
    return this.api.getAll<LegacyBillingRecord>(`legacy/${source}`, undefined, {
      skip,
      take,
    });
  }

  getLegacyPosting(
    skip = 0,
    take = 30,
  ): Observable<ApiResponse<LegacyPostingRecord[]>> {
    return this.api.getAll<LegacyPostingRecord>('legacy/thoel', undefined, {
      skip,
      take,
    });
  }

  getLegacyCollections(
    skip = 0,
    take = 30,
  ): Observable<ApiResponse<LegacyCollectionRecord[]>> {
    const page = Math.floor(skip / take) + 1;

    return this.api
      .getAll<ReceiptVoucher>('vouchers/receipt', {
        page,
        pageSize: take,
      })
      .pipe(
        map((response) => ({
          ...response,
          data: response.data.map((voucher) => {
            const details = Array.isArray(voucher.details) ? voucher.details : [];
            const detailTotal = details.reduce(
              (sum, detail) => sum + Number(detail.amount || 0),
              0,
            );
            const firstDetail = details[0];
            const voucherTotal = Number(voucher.totals || 0);

            return {
              id: voucher.nos,
              nos: voucher.nos,
              noson: voucher.noson,
              dates: voucher.dates,
              noa: voucher.noa,
              namea: voucher.namea,
              total: voucherTotal,
              totalm: detailTotal,
              amt:
                details.length === 1
                  ? Number(firstDetail?.amount || 0)
                  : detailTotal || voucherTotal,
              memo: voucher.memos,
              nms: voucher.nms || firstDetail?.nameaf,
              ts: voucher.amr,
              detailCount: details.length,
              sampleSubscriber: firstDetail?.nameaf,
            };
          }),
        })),
      );
  }

  getLegacyMessages(
    skip = 0,
    take = 30,
  ): Observable<ApiResponse<LegacyMessageRecord[]>> {
    return this.api.getAll<LegacyMessageRecord>('legacy/repmsm', undefined, {
      skip,
      take,
    });
  }
}
