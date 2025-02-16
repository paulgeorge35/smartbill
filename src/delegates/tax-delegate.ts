import type { ApiResponse } from '../types/models';
import { RequestType } from '../types/models';
import { BaseDelegate } from './base-delegate';

export interface Tax {
  name: string;
  percentage: number;
}

/**
 * Handles tax-related operations
 */
export class TaxDelegate extends BaseDelegate {
  /**
   * Gets available tax types
   *
   * @param companyVatCode - The VAT code of the company
   *
   * @example
   * ```typescript
   * const taxTypes = await client.tax.getTaxTypes('RO12345678');
   *
   * console.log(taxTypes);
   *
   * // {
   * //   success: true,
   * //   data: [
   * //     {
   * //       name: 'VAT',
   * //       percentage: 19,
   * //     }
   * //   ]
   * // }
   * ```
   */
  async getTaxTypes(companyVatCode: string): Promise<ApiResponse<Tax[]>> {
    const queryParams = new URLSearchParams({
      cif: companyVatCode
    });

    return this.makeRequest<Tax[]>(
      `/tax?${queryParams}`,
      RequestType.TAX_LIST
    );
  }
}