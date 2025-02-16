import type {
  ApiResponse,
  Client,
  Product
} from '../types/models';
import { RequestType } from '../types/models';
import { BaseDelegate } from './base-delegate';

/**
 * Estimate creation parameters
 */
export interface CreateEstimateParams {
  companyVatCode: string;
  client: Client;
  isDraft?: boolean;
  issueDate?: string;
  seriesName?: string;
  currency?: string;
  exchangeRate?: number;
  language?: string;
  precision?: number;
  dueDate?: string;
  mentions?: string;
  observations?: string;
  products: Product[];
}

export interface EstimateInvoices {
  areInvoicesCreated: boolean;
  invoices: {
    series: string;
    number: string;
  }[];
}

export interface InvoiceCreateResponse {
  series: string;
  number: string;
}

/**
 * Handles estimate-related operations
 */
export class EstimateDelegate extends BaseDelegate {
  /**
   * Creates a new estimate
   */
  async create(params: CreateEstimateParams): Promise<ApiResponse<InvoiceCreateResponse>> {
    return this.makeRequest<InvoiceCreateResponse>(
      '/estimate',
      RequestType.INVOICE_CREATE,
      {
        method: 'POST',
        body: JSON.stringify(params)
      }
    );
  }

  /**
   * Gets invoices created from an estimate
   * @param companyVatCode - The company VAT code
   * @param seriesName - The series name
   * @param number - The number of the estimate
   * @returns The invoices created from the estimate
   */
  async getInvoices(params: {
    companyVatCode: string;
    seriesName: string;
    number: string;
  }): Promise<ApiResponse<EstimateInvoices>> {
    const queryParams = new URLSearchParams({
      cif: params.companyVatCode,
      seriesname: params.seriesName,
      number: params.number
    });

    return this.makeRequest<EstimateInvoices>(
      `/estimate/invoices?${queryParams}`,
      RequestType.ESTIMATE_INVOICES
    );
  }

  /**
   * Deletes an estimate
   * @param companyVatCode - The company VAT code
   * @param seriesName - The series name
   * @param number - The number of the estimate
   * @returns The response from the API
   */
  async delete(params: {
    companyVatCode: string;
    seriesName: string;
    number: string;
  }): Promise<ApiResponse<void>> {
    const queryParams = new URLSearchParams({
      cif: params.companyVatCode,
      seriesname: params.seriesName,
      number: params.number
    });

    return this.makeRequest<void>(
      `/estimate?${queryParams}`,
      RequestType.VOID,
      {
        method: 'DELETE'
      }
    );
  }

  /**
   * Cancels an estimate
   * @param companyVatCode - The company VAT code
   * @param seriesName - The series name
   * @param number - The number of the estimate
   * @returns The response from the API
   */
  async cancel(params: {
    companyVatCode: string;
    seriesName: string;
    number: string;
  }): Promise<ApiResponse<void>> {
    const queryParams = new URLSearchParams({
      cif: params.companyVatCode,
      seriesname: params.seriesName,
      number: params.number
    });

    return this.makeRequest<void>(
      `/estimate/cancel?${queryParams}`,
      RequestType.VOID,
      {
        method: 'PUT'
      }
    );
  }

  /**
   * Restores a canceled estimate
   * @param companyVatCode - The company VAT code
   * @param seriesName - The series name
   * @param number - The number of the estimate
   * @returns The response from the API
   */
  async restore(params: {
    companyVatCode: string;
    seriesName: string;
    number: string;
  }): Promise<ApiResponse<void>> {
    const queryParams = new URLSearchParams({
      cif: params.companyVatCode,
      seriesname: params.seriesName,
      number: params.number
    });

    return this.makeRequest<void>(
      `/estimate/restore?${queryParams}`,
      RequestType.VOID,
      {
        method: 'PUT'
      }
    );
  }
}