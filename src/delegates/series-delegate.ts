import type { ApiResponse } from '../types/models';
import { RequestType } from '../types/models';
import { BaseDelegate } from './base-delegate';

export interface Series {
  name: string;
  nextNumber: string | number;
  type: 'f' | 'p' | 'c'; // f=invoice, p=estimate, c=receipt
}

/**
 * Handles document series operations
 */
export class SeriesDelegate extends BaseDelegate {
  /**
   * Gets available series for a document type
   *
   * @type
   * ```typescript
   * interface GetSeriesParams {
   *   companyVatCode: string;
   *   type: 'f' | 'p' | 'c'; // f=invoice, p=estimate, c=receipt
   * }
   * ```
   *
   * @example
   * ```typescript
   * const series = await client.series.getSeries({
   *   companyVatCode: 'RO12345678',
   *   type: 'f',
   * });
   *
   * console.log(series);
   *
   * // {
   * //   success: true,
   * //   data: [
   * //     {
   * //       name: 'FCT',
   * //       nextNumber: 1,
   * //       type: 'f'
   * //     }
   * //   ]
   * // }
   * ```
   */
  async getSeries(params: {
    companyVatCode: string;
    type: Series['type'];
  }): Promise<ApiResponse<Series[]>> {
    const queryParams = new URLSearchParams({
      cif: params.companyVatCode,
      type: params.type
    });

    return this.makeRequest<Series[]>(
      `/series?${queryParams}`,
      RequestType.SERIES_LIST
    );
  }
}