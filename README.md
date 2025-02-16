# SmartBill TypeScript Client

A modern, type-safe client for integrating with the SmartBill API. This package provides a comprehensive implementation for managing invoices, estimates, payments, and other business documents through the SmartBill platform.

## Features

- 🧾 Complete invoice management
- 📋 Estimate handling
- 💰 Payment processing
- 🛠️ Additional features

## Prerequisites

- Node.js 16+ or Bun runtime
- TypeScript 4.x+ (for type definitions)
- npm, yarn, pnpm, or bun package manager

## Installation

Before installing, you need to configure your package manager to access the GitHub Packages registry.

### GitHub Personal Access Token
First, create a GitHub Personal Access Token with the `read:packages` permission. Add it to your package manager's configuration file.

### Via bun

1. Create or edit `$HOME/.bunfig.toml` and add:
```toml
[install.scopes]
"@paulgeorge35" = { token = "your_github_token", url = "https://npm.pkg.github.com/" }
```

2. Install the package:
```bash
bun add @paulgeorge35/smartbill@latest
```

### Via npm

1. Create or edit `$HOME/.npmrc` and add:
```
//npm.pkg.github.com/:_authToken=your_github_token
```

2. Install the package:
```bash
npm install @paulgeorge35/smartbill@latest
```

### Via yarn

1. Create or edit `$HOME/.yarnrc` and add:
```
//npm.pkg.github.com/:_authToken=your_github_token
```

2. Install the package:
```bash
yarn add @paulgeorge35/smartbill@latest
```

### Via pnpm

1. Create or edit `$HOME/.npmrc` and add:
```
//npm.pkg.github.com/:_authToken=your_github_token
```

2. Install the package:
```bash
pnpm add @paulgeorge35/smartbill@latest
```

## Dependencies

##### Peer Dependencies
- `node` `(>=16.0.0)` - For crypto module support

## Quick Start

```typescript
import { SmartBillClient } from 'smartbill';

// Initialize the client
const client = new SmartBillClient({
  username: 'YOUR_USERNAME',
  token: 'YOUR_TOKEN'
});

// Get payment status
const invoiceStatus = await client.invoice.getPaymentStatus({
  companyVatCode: 'YOUR_COMPANY_VAT_CODE',
  seriesName: 'YOUR_SERIES_NAME',
  number: 'YOUR_NUMBER'
});

console.log(invoiceStatus);
// {
//   success: true,
//   data: {
//     invoiceTotalAmount: 100,
//     paidAmount: 0,
//     unpaidAmount: 100,
//     paid: false
//   }
// }
```

## API Documentation

### Client Configuration

#### `SmartBillConfig`
- `username`: Your SmartBill username
- `token`: Your SmartBill token

### Available Methods

#### `Invoices`
- `create`: Create a new invoice
- `getPaymentStatus`: Get payment status
- `getPdf`: Get invoice PDF
- `delete`: Delete an invoice
- `reverse`: Reverse an invoice
- `cancel`: Cancel an invoice
- `restore`: Restore an invoice
- `sendToEmail`: Send an invoice to email

#### `Payments`
- `create`: Create a new payment
- `getReceipt`: Get receipt content
- `deleteReceipt`: Delete a receipt
- `delete`: Delete a payment

#### `Estimates`
- `create`: Create a new estimate
- `getInvoices`: Get list of invoices generated from an estimate
- `delete`: Delete an estimate
- `cancel`: Cancel an estimate
- `restore`: Restore an estimate

#### `Series Information`
- `getSeries`: Get list of configured document series

#### `Stock Information`
- `getStock`: Get list of stock

#### `Tax Information`
- `getTaxTypes`: Get list of configured tax types

## Error Handling

All methods return a `ApiResponse<T>` type with the following structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Paul George - contact@paulgeorge.dev

Project Link: [https://github.com/paulgeorge35/smartbill](https://github.com/paulgeorge35/smartbill)
