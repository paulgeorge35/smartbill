/**
 * Custom error class for SmartBill API errors
 */
export class SmartBillError extends Error {
  readonly status: number;
  readonly statusText: string;

  constructor(response: Response) {
    super(`SmartBill API Error: ${response.status} ${response.statusText}`);
    this.status = response.status;
    this.statusText = response.statusText;
    this.name = 'SmartBillError';
  }
}