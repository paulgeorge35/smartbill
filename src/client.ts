import { EstimateDelegate } from './delegates/estimate-delegate';
import { InvoiceDelegate } from './delegates/invoice-delegate';
import { PaymentDelegate } from './delegates/payment-delegate';
import { SeriesDelegate } from './delegates/series-delegate';
import { StockDelegate } from './delegates/stock-delegate';
import { TaxDelegate } from './delegates/tax-delegate';
import type { SmartBillConfig } from './types/config';

/**
 * SmartBill API Client
 * Main entry point for interacting with the SmartBill API
 */
export class SmartBillClient {
  private readonly config: SmartBillConfig;
  
  public readonly invoice: InvoiceDelegate;
  public readonly payment: PaymentDelegate;
  public readonly estimate: EstimateDelegate;
  public readonly tax: TaxDelegate;
  public readonly series: SeriesDelegate;
  public readonly stock: StockDelegate;

  constructor(config: SmartBillConfig) {
    this.config = config;
    
    // Initialize delegates
    this.invoice = new InvoiceDelegate(this.config);
    this.payment = new PaymentDelegate(this.config);
    this.estimate = new EstimateDelegate(this.config);
    this.tax = new TaxDelegate(this.config);
    this.series = new SeriesDelegate(this.config);
    this.stock = new StockDelegate(this.config);
  }
} 