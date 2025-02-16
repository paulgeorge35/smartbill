import type {
  ApiResponse,
  CreateInvoiceParams,
  ReverseInvoiceParams
} from '../types/models';
import { RequestType } from '../types/models';
import { BaseDelegate } from './base-delegate';
import type { InvoiceCreateResponse } from './estimate-delegate';

export interface PaymentStatus {
  invoiceTotalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  paid: boolean;
}

export interface ReverseInvoiceResponse {
  series: string;
  number: string;
  documentUrl: string;
  documentId: string;
  documentViewUrl: string;
}

export interface SendToEmailParams {
  companyVatCode: string;
  seriesName: string;
  number: string;
  type: 'factura' | 'proforma';
  subject?: string;
  to?: string;
  cc?: string;
  bcc?: string;
  bodyText?: string;
}

/**
 * Handles invoice-related operations
 */
export class InvoiceDelegate extends BaseDelegate {
  /**
   * Creates a new invoice
   *
   * @example
   * ```typescript
   * const invoice = await client.invoice.create({
   *   {
   *     "companyVatCode": "RO12345678",
   *     "client": {
   *       "name": "Intelligent IT",
   *       "vatCode": "RO12345678",
   *       "address": "str. Sperantei, nr. 5",
   *       "isTaxPayer": false,
   *       "city": "Sibiu",
   *       "county": "Sibiu",
   *       "country": "Romania",
   *       "saveToDb": false
   *     },
   *     "isDraft": false,
   *     "issueDate": "2021-02-19",
   *     "seriesName": "FCT",
   *     "currency": "RON",
   *     "language": "RO",
   *     "precision": 2,
   *     "dueDate": "2021-03-28",
   *     "useEstimateDetails": false,
   *     "estimate": {
   *       "seriesName": "PFCT",
   *       "number": "0203"
   *     },
   *     "products": [
   *       {
   *         "name": "Mapa A4",
   *         "code": "ccd1",
   *         "productDescription": "produse de papetarie",
   *         "isDiscount": false,
   *         "measuringUnitName": "buc",
   *         "currency": "RON",
   *         "quantity": 2,
   *         "price": 40,
   *         "isTaxIncluded": true,
   *         "taxName": "Normala",
   *         "taxPercentage": 19,
   *         "saveToDb": false,
   *         "isService": false
   *       },
   *       {
   *         "name": "Biblioraft Plastifiat",
   *         "code": "ccd2",
   *         "productDescription": "produse de papetarie",
   *         "isDiscount": false,
   *         "measuringUnitName": "buc",
   *         "currency": "RON",
   *         "quantity": 3,
   *         "price": 60,
   *         "isTaxIncluded": true,
   *         "taxName": "Normala",
   *         "taxPercentage": 19,
   *         "saveToDb": false,
   *         "isService": false
   *       },
   *       {
   *         "name": "Discount valoric pe produsul 2",
   *         "isDiscount": true,
   *         "numberOfItems": 1,
   *         "measuringUnitName": "buc",
   *         "currency": "RON",
   *         "isTaxIncluded": true,
   *         "taxName": "Normala",
   *         "taxPercentage": 19,
   *         "discountType": 1,
   *         "discountValue": -15
   *       },
   *       {
   *         "name": "Discount procentual pe produsul 1, 2 si 3",
   *         "isDiscount": true,
   *         "numberOfItems": 3,
   *         "measuringUnitName": "buc",
   *         "currency": "RON",
   *         "isTaxIncluded": true,
   *         "taxName": "Normala",
   *         "taxPercentage": 19,
   *         "discountType": 2,
   *         "discountPercentage": 10
   *       }
   *     ],
   *     "payment": {
   *       "value": 100,
   *       "type": "Ordin plata",
   *       "isCash": false
   *     }
   * });
   */
  async create(params: CreateInvoiceParams): Promise<ApiResponse<InvoiceCreateResponse>> {
    return this.makeRequest<InvoiceCreateResponse>(
      '/invoice',
      RequestType.INVOICE_CREATE,
      {
        method: 'POST',
        body: JSON.stringify(params)
      }
    );
  }

  /**
   * Fetches an invoice PDF
   *
   * @example
   * ```typescript
   * const pdf = await client.invoice.getPdf({
   *   companyVatCode: 'RO12345678',
   *   seriesName: 'FCT',
   *   number: '0203'
   * });
   */
  async getPdf(params: {
    companyVatCode: string;
    seriesName: string;
    number: string;
  }): Promise<ApiResponse<Blob>> {
    const queryParams = new URLSearchParams({
      cif: params.companyVatCode,
      seriesname: params.seriesName,
      number: params.number
    });

    return this.makeRequest<Blob>(
      `/invoice/pdf?${queryParams}`,
      RequestType.PDF,
      {
        headers: {
          'Accept': 'application/octet-stream',
        }
      }
    );
  }

  /**
   * Gets payment status for an invoice
   *
   * @example
   * ```typescript
   * const paymentStatus = await client.invoice.getPaymentStatus({
   *   companyVatCode: 'RO12345678',
   *   seriesName: 'FCT',
   *   number: '0203'
   * });
   */
  async getPaymentStatus(params: {
    companyVatCode: string;
    seriesName: string;
    number: string;
  }): Promise<ApiResponse<PaymentStatus>> {
    const queryParams = new URLSearchParams({
      cif: params.companyVatCode,
      seriesname: params.seriesName,
      number: params.number
    });

    return this.makeRequest<PaymentStatus>(
      `/invoice/paymentstatus?${queryParams}`,
      RequestType.PAYMENT_STATUS
    );
  }

  /**
   * Deletes an invoice
   *
   * @example
   * ```typescript
   * await client.invoice.delete({
   *   companyVatCode: 'RO12345678',
   *   seriesName: 'FCT',
   *   number: '0203'
   * });
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
      `/invoice?${queryParams}`,
      RequestType.VOID,
      {
        method: 'DELETE'
      }
    );
  }

  /**
   * Reverse an invoice
   *
   * @example
   * ```typescript
   * await client.invoice.reverse({
   *   companyVatCode: 'RO12345678',
   *   seriesName: 'FCT',
   *   number: '0203'
   * });
   */

  async reverse(params: ReverseInvoiceParams): Promise<ApiResponse<ReverseInvoiceResponse>> {
    return this.makeRequest<ReverseInvoiceResponse>(
      '/invoice/reverse',
      RequestType.INVOICE_REVERSE,
      {
        method: 'POST',
        body: JSON.stringify(params)
      }
    );
  }

  /**
   * Cancels an invoice
   *
   * @example
   * ```typescript
   * await client.invoice.cancel({
   *   companyVatCode: 'RO12345678',
   *   seriesName: 'FCT',
   *   number: '0203'
   * });
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
      `/invoice/cancel?${queryParams}`,
      RequestType.VOID,
      {
        method: 'PUT'
      }
    );
  }

  /**
   * Restores an invoice
   *
   * @example
   * ```typescript
   * await client.invoice.restore({
   *   companyVatCode: 'RO12345678',
   *   seriesName: 'FCT',
   *   number: '0203'
   * });
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
      `/invoice/restore?${queryParams}`,
      RequestType.VOID,
      {
        method: 'PUT'
      }
    );
  }

  /**
   * Send document to email
   *
   * @description
   * `subject` and `bodyText` are expected to be raw text, not encoded, we're handling the encoding to base64 ourselves.
   *
   * @type
   * ```typescript
   * interface SendToEmailParams {
   *   companyVatCode: string;
   *   seriesName: string;
   *   number: string;
   *   type: 'factura' | 'proforma';
   *   subject?: string; // Optional, default is the one configured on your SmartBill account
   *   to?: string; // Optional, default is the email of the client
   *   cc?: string;
   *   bcc?: string;
   *   bodyText?: string; // Optional, default is the one configured on your SmartBill account
   * }
   * ```
   *
   * @example
   * ```typescript
   * await client.invoice.sendToEmail({
   *   companyVatCode: 'RO12345678',
   *   seriesName: 'FCT',
   *   number: '0203',
   *   type: 'factura',
   *   subject: 'Factura',
   *   to: 'test@test.com',
   *   cc: 'test2@test.com',
   *   bcc: 'test3@test.com',
   *   bodyText: 'Factura'
   * });
   */

  async sendToEmail(params: SendToEmailParams): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(
      '/document/send',
      RequestType.VOID,
      {
        method: 'POST',
        body: JSON.stringify({
          ...params,
          subject: params.subject ? btoa(params.subject) : undefined,
          bodyText: params.bodyText ? btoa(params.bodyText) : undefined,
        })
      }
    );
  }
}