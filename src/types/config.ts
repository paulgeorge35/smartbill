/**
 * SmartBill API Configuration
 */
export interface SmartBillConfig {
  /**
   * API Base URL
   * @default https://ws.smartbill.ro/SBORO/api
   */
  baseUrl?: string;

  /**
   * API Username
   */
  username: string;

  /**
   * API Token/Password
   */
  token: string;
}

/**
 * Common parameters for API requests
 */
export interface CommonRequestParams {
  /**
   * Company VAT code
   */
  companyVatCode: string;
}