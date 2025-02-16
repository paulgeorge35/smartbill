import type { ApiResponse } from '../types/models';
import { RequestType } from '../types/models';
import { BaseDelegate } from './base-delegate';

export interface StockProduct {
  measuringUnit: string;
  productCode: string;
  productName: string;
  quantity: number;
}

export interface Warehouse {
  warehouseName: string;
  warehouseType: string;
  products: StockProduct[];
}

export interface GetStockParams {
  companyVatCode: string;
  date?: string;
  warehouseName?: string;
  productName?: string;
  productCode?: string;
}

/**
 * Handles stock-related operations
 */
export class StockDelegate extends BaseDelegate {
  /**
   * Gets product stock information
   *
   * @type
   * ```typescript
   * interface GetStockParams {
   *   companyVatCode: string;
   *   date?: string;
   *   warehouseName?: string;
   *   productName?: string;
   *   productCode?: string;
   * }
   * ```
   *
   * @example
   * ```typescript
   * const stock = await client.stock.getStock({
   *   companyVatCode: 'RO12345678',
   * });
   *
   * console.log(stock);
   *
   * // {
   * //   success: true,
   * //   data: [
   * //     {
   * //       warehouseName: 'Warehouse 1',
   * //       warehouseType: 'Warehouse',
   * //       products: [
   * //         {
   * //           measuringUnit: 'kg',
   * //           productCode: '1234567890',
   * //           productName: 'Product 1',
   * //           quantity: 100,
   * //         }
   * //       ]
   * //     }
   * //   ]
   * // }
   * ```
   */
  async getStock(params: GetStockParams): Promise<ApiResponse<Warehouse[]>> {
    const queryParams = new URLSearchParams({
      cif: params.companyVatCode,
      ...(params.date && { date: params.date }),
      ...(params.warehouseName && { warehouseName: params.warehouseName }),
      ...(params.productName && { productName: params.productName }),
      ...(params.productCode && { productCode: params.productCode })
    });

    return this.makeRequest<Warehouse[]>(
      `/stocks?${queryParams}`,
      RequestType.STOCK_LIST
    );
  }
}