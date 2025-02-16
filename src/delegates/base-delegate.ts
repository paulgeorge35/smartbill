import type { SmartBillConfig } from '../types/config';
import type { ApiResponse, SmartBillResponse, SuccessResponse } from '../types/models';
import { RequestType } from '../types/models';
import type { InvoiceCreateResponse } from './estimate-delegate';
import type { ReverseInvoiceResponse } from './invoice-delegate';

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

interface TaxResponse {
  taxes: unknown[];
}

interface ListResponse {
  list: unknown[];
}

interface PaymentStatusResponse extends SmartBillResponse {
  invoiceTotalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  paid: boolean;
}

interface EstimateInvoicesResponse extends SmartBillResponse {
  areInvoicesCreated: boolean;
  invoices: {
    series: string;
    number: string;
  }[];
}

/**
 * Base delegate class with common functionality
 */
export abstract class BaseDelegate {
  protected readonly config: SmartBillConfig;
  protected readonly baseUrl: string;

  constructor(config: SmartBillConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://ws.smartbill.ro/SBORO/api';
  }

  /**
   * Creates authorization header value
   */
  protected getAuthHeader(): string {
    const credentials = `${this.config.username}:${this.config.token}`;
    return `Basic ${btoa(credentials)}`;
  }

  /**
   * Makes an API request with proper headers
   */
  protected async makeRequest<T>(
    endpoint: string,
    requestType: RequestType,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': this.getAuthHeader(),
        ...options.headers,
      };

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json() as SmartBillResponse;
        return {
          success: false,
          data: undefined,
          message: error.errorText || error.message || `HTTP error ${response.status}: ${response.statusText}`,
        };
      }

      switch (requestType) {
        case RequestType.INVOICE_CREATE: {
          const rawData = await response.json() as InvoiceCreateResponse;
          return {
            success: true,
            data: {
              series: rawData.series,
              number: rawData.number,
            } as T
          };
        }

        case RequestType.INVOICE_REVERSE: {
          const rawData = await response.json() as ReverseInvoiceResponse;
          return {
            success: true,
            data: {
              series: rawData.series,
              number: rawData.number,
              documentUrl: rawData.documentUrl,
              documentId: rawData.documentId,
              documentViewUrl: rawData.documentViewUrl,
            } as T
          };
        }

        case RequestType.PDF: {
          const blob = await response.blob();
          return {
            success: true,
            data: blob as unknown as T
          };
        }

        case RequestType.TAX_LIST: {
          const rawData = await response.json() as TaxResponse;
          return {
            success: true,
            data: rawData.taxes as T
          };
        }

        case RequestType.SERIES_LIST:
        case RequestType.STOCK_LIST: {
          const rawData = await response.json() as ListResponse;
          return {
            success: true,
            data: rawData.list as T
          };
        }

        case RequestType.PAYMENT_STATUS: {
          const rawData = await response.json() as PaymentStatusResponse;
          return {
            success: true,
            data: {
              invoiceTotalAmount: rawData.invoiceTotalAmount,
              paidAmount: rawData.paidAmount,
              unpaidAmount: rawData.unpaidAmount,
              paid: rawData.paid
            } as T
          };
        }

        case RequestType.ESTIMATE_INVOICES: {
          const rawData = await response.json() as EstimateInvoicesResponse;
          return {
            success: true,
            data: {
              areInvoicesCreated: rawData.areInvoicesCreated,
              invoices: rawData.invoices
            } as T
          };
        }

        default: {
          const rawData = await response.json() as SuccessResponse<undefined>;
          return {
            success: true,
            data: undefined as unknown as T,
            message: rawData.message
          };
        }
      }
    } catch (error) {
      return {
        success: false,
        data: undefined,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }
}