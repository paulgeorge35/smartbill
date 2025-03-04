/**
 * Base response type for successful API calls
 */
export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Base response type for failed API calls
 */
export interface ErrorResponse {
  success: false;
  data: undefined;
  message: string;
}

/**
 * Union type for all API responses
 */
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

/**
 * Common response structure from SmartBill API
 */
export interface SmartBillResponse {
  errorText: string;
  message: string;
  number?: string;
  series?: string;
  url?: string;
}

/**
 * Client information
 */
export interface Client {
  name: string;
  vatCode?: string;
  code?: string;
  address?: string;
  regCom?: string;
  isTaxPayer?: boolean;
  contact?: string;
  phone?: string;
  city?: string;
  county?: string;
  country: string;
  email?: string;
  bank?: string;
  iban?: string;
  saveToDb?: boolean;
}

/**
 * Product information for invoices
 */
export interface Product {
  name: string;
  code: string;
  productDescription?: string;
  translatedName?: string;
  translatedMeasuringUnit?: string;
  isDiscount: boolean;
  measuringUnitName: string;
  currency: string;
  quantity: number;
  price: number;
  isTaxIncluded?: boolean;
  taxName?: string;
  taxPercentage?: number;
  exchangeRate?: number;
  saveToDb?: boolean;
  warehouseName?: string;
  isService?: boolean;
}

/**
 * Payment information
 */
export interface Payment {
  value: number;
  paymentSeries?: string;
  type: PaymentType;
  isCash?: boolean;
}

export type PaymentType =
  | 'Chitanta'
  | 'Bon'
  | 'Card'
  | 'CEC'
  | 'Bilet ordin'
  | 'Ordin plata'
  | 'Mandat postal'
  | 'Alta incasare';

/**
 * Invoice creation parameters
 */
export interface CreateInvoiceParams {
  companyVatCode: string;
  client: Client;
  isDraft?: boolean;
  issueDate?: string;
  seriesName?: string;
  currency?: string;
  exchangeRate?: number;
  language?: string;
  precision?: number;
  issuerCnp?: string;
  issuerName?: string;
  dueDate?: string;
  mentions?: string;
  observations?: string;
  delegateName?: string;
  delegateIdentityCard?: string;
  delegateAuto?: string;
  deliveryDate?: string;
  paymentDate?: string;
  useStock?: boolean;
  products: Product[];
  payment?: Payment;
}

/**
 * Reverse invoice parameters
 */
export interface ReverseInvoiceParams {
  companyVatCode: string;
  seriesName: string;
  number: string;
  issueDate: string;
}

/**
 * Identifies the type of request to determine response shape
 */
export enum RequestType {
  PDF = 'pdf',
  TAX_LIST = 'tax_list',
  SERIES_LIST = 'series_list',
  STOCK_LIST = 'stock_list',
  PAYMENT_STATUS = 'payment_status',
  ESTIMATE_INVOICES = 'estimate_invoices',
  INVOICE_CREATE = 'invoice_create',
  INVOICE_REVERSE = 'invoice_reverse',
  VOID = 'void',
}

// Add these new types
export interface EstimateReference {
  seriesName: string;
  number: string;
}

export interface CreateInvoiceFromEstimateParams {
  companyVatCode: string;
  isDraft: boolean;
  seriesName: string;
  useEstimateDetails: true;
  estimate: EstimateReference;
  // Optional properties from CreateInvoiceParams
  issueDate?: string;
  currency?: string;
  language?: string;
  precision?: number;
  dueDate?: string;
  mentions?: string;
  observations?: string;
}