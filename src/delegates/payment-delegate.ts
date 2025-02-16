import type {
  ApiResponse,
  Client,
  Payment,
  PaymentType
} from '../types/models';
import { RequestType } from '../types/models';
import { BaseDelegate } from './base-delegate';

/**
 * Payment creation parameters
 */
export interface CreatePaymentParams {
  companyVatCode: string;
  client: Client;
  issueDate?: string;
  currency?: string;
  language?: string;
  exchangeRate?: number;
  precision?: number;
  value: number;
  type: Payment['type'];
  isCash?: boolean;
  text?: string;
  translatedText?: string;
  isDraft?: boolean;
  observation?: string;
  useInvoiceDetails?: boolean;
  invoicesList?: {
    seriesName: string;
    number: string;
  }[];
}

export type DeletePaymentParams = {
  companyVatCode: string;
  paymentType: Exclude<PaymentType, 'Chitanta'>;
  invoiceSeries: string;
  invoiceNumber: string;
} | {
  companyVatCode: string;
  paymentType: Exclude<PaymentType, 'Chitanta'>;
  paymentDate: string;
  paymentValue: string;
  clientName: string;
  clientCif: string;
}

/**
 * Handles payment-related operations
 */
export class PaymentDelegate extends BaseDelegate {
  /**
   * Creates a new payment
   *
   * @example
   * ```typescript
   * const payment = await client.payment.create({
   *   companyVatCode: 'RO12345678',
   *   client: { name: 'John Doe', cif: '1234567890' },
   *   value: 100,
   *   type: 'Chitanta',
   *   isCash: true,
   *   text: 'Payment for invoice 1234567890',
   *   translatedText: 'Plata pentru factura 1234567890',
   *   isDraft: false,
   *   observation: 'Payment for invoice 1234567890',
   *   useInvoiceDetails: true,
   *   invoicesList: [{ seriesName: 'FCT', number: '0203' }],
   * });
   */
  async create(params: CreatePaymentParams): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(
      '/payment',
      RequestType.VOID,
      {
        method: 'POST',
        body: JSON.stringify(params)
      }
    );
  }

  /**
   * Get receipt
   *
   * @example
   * ```typescript
   * const receipt = await client.payment.getReceipt({
   *   cif: 'RO12345678',
   *   id: '1234567890',
   * });
   *
   * @returns The receipt encoded in base64
   */
  async getReceipt(params: {
    cif: string;
    id: string;
  }): Promise<ApiResponse<void>> {
    const queryParams = new URLSearchParams({
      cif: params.cif,
      id: params.id
    });

    return this.makeRequest<void>(
      `/payment/text?${queryParams}`,
      RequestType.VOID,
      {
        method: 'GET'
      }
    );
  }

  /**
   * Deletes a receipt
   *
   * @example
   * ```typescript
   * await client.payment.deleteReceipt({
   *   companyVatCode: 'RO12345678',
   *   seriesName: 'FCT',
   *   number: '0203',
   * });
   * ```
   */
  async deleteReceipt(params: {
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
      `/payment/chitanta?${queryParams}`,
      RequestType.VOID,
      {
        method: 'DELETE'
      }
    );
  }

  /**
   * Delete other types of payments
   *
   * @example
   * ```typescript
   * await client.payment.delete({
   *   companyVatCode: 'RO12345678',
   *   paymentType: 'Chitanta',
   *   invoiceSeries: 'FCT',
   *   invoiceNumber: '0203',
   * });
   * ```
   */
  async delete(params: DeletePaymentParams): Promise<ApiResponse<void>> {
    const queryParams = new URLSearchParams({
      companyVatCode: params.companyVatCode,
      paymentType: params.paymentType,
      ...('invoiceSeries' in params && { invoiceSeries: params.invoiceSeries }),
      ...('invoiceNumber' in params && { invoiceNumber: params.invoiceNumber }),
      ...('paymentDate' in params && { paymentDate: params.paymentDate }),
      ...('paymentValue' in params && { paymentValue: params.paymentValue }),
      ...('clientName' in params && { clientName: params.clientName }),
      ...('clientCif' in params && { clientCif: params.clientCif }),
    });

    return this.makeRequest<void>(
      `/payment/v2?${queryParams}`,
      RequestType.VOID,
      {
        method: 'DELETE'
      }
    );
  }
}