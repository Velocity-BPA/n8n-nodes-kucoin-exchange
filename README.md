# n8n-nodes-kucoin-exchange

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

This n8n community node provides seamless integration with KuCoin Exchange, enabling automated cryptocurrency trading, portfolio management, and account operations. With 9 comprehensive resources covering spot trading, margin trading, futures, and account management, this node empowers users to build sophisticated crypto trading workflows and automation strategies.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![KuCoin API](https://img.shields.io/badge/KuCoin-API%20v2-green)
![Crypto Trading](https://img.shields.io/badge/Crypto-Trading-orange)
![Futures Support](https://img.shields.io/badge/Futures-Supported-yellow)

## Features

- **Comprehensive Trading** - Execute spot, margin, and futures orders with full order lifecycle management
- **Account Management** - Access account balances, trading history, and portfolio information across all account types
- **Real-time Market Data** - Retrieve trading pairs, market statistics, and price information
- **Advanced Order Types** - Support for limit, market, stop-loss, and take-profit orders
- **Margin Trading** - Complete margin account operations including borrowing and lending
- **Futures Trading** - Full futures contract management with position tracking
- **Deposit & Withdrawal** - Automated fund management with transaction history
- **Risk Management** - Built-in error handling and rate limiting for safe automation

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-kucoin-exchange`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-kucoin-exchange
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-kucoin-exchange.git
cd n8n-nodes-kucoin-exchange
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-kucoin-exchange
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your KuCoin API key from account settings | Yes |
| Secret Key | Your KuCoin API secret key | Yes |
| Passphrase | Your KuCoin API passphrase | Yes |
| Sandbox | Enable for testing with KuCoin sandbox environment | No |
| Environment | Select 'Production' or 'Sandbox' | Yes |

## Resources & Operations

### 1. Account

| Operation | Description |
|-----------|-------------|
| Get Balance | Retrieve account balances for all currencies |
| Get Account Info | Get detailed account information and settings |
| Get Trading History | Fetch trading history with filtering options |
| Get Deposit History | Retrieve deposit transaction history |
| Get Withdrawal History | Get withdrawal transaction history |

### 2. TradingPair

| Operation | Description |
|-----------|-------------|
| List All | Get all available trading pairs |
| Get Market Stats | Retrieve 24hr statistics for trading pairs |
| Get Order Book | Fetch current order book data |
| Get Trade History | Get recent trade history for a pair |
| Get Candles | Retrieve OHLCV candlestick data |

### 3. Order

| Operation | Description |
|-----------|-------------|
| Create | Place a new spot trading order |
| Cancel | Cancel an existing order |
| Get | Retrieve order details by ID |
| List | Get list of orders with filtering |
| Get Fills | Retrieve order fill history |

### 4. MarginAccount

| Operation | Description |
|-----------|-------------|
| Get Balance | Retrieve margin account balances |
| Get Account Info | Get margin account details and limits |
| Borrow | Initiate margin borrowing |
| Repay | Repay margin debt |
| Get Borrow History | Retrieve borrowing history |

### 5. MarginOrder

| Operation | Description |
|-----------|-------------|
| Create | Place a new margin order |
| Cancel | Cancel an existing margin order |
| Get | Retrieve margin order details |
| List | Get list of margin orders |
| Get Fills | Retrieve margin order fills |

### 6. FuturesAccount

| Operation | Description |
|-----------|-------------|
| Get Balance | Retrieve futures account balance |
| Get Positions | Get current futures positions |
| Get Account Overview | Get futures account overview |
| Transfer | Transfer funds to/from futures account |

### 7. FuturesOrder

| Operation | Description |
|-----------|-------------|
| Create | Place a new futures order |
| Cancel | Cancel an existing futures order |
| Get | Retrieve futures order details |
| List | Get list of futures orders |
| Get Fills | Retrieve futures order fills |

### 8. Deposit

| Operation | Description |
|-----------|-------------|
| Get Address | Get deposit address for a currency |
| Get History | Retrieve deposit transaction history |
| Create Address | Generate new deposit address |

### 9. Withdrawal

| Operation | Description |
|-----------|-------------|
| Create | Initiate a withdrawal |
| Cancel | Cancel a pending withdrawal |
| Get History | Retrieve withdrawal history |
| Get Quotas | Get withdrawal limits and quotas |

## Usage Examples

```javascript
// Place a market buy order for Bitcoin
{
  "symbol": "BTC-USDT",
  "side": "buy",
  "type": "market",
  "funds": "100"
}
```

```javascript
// Get account balance
{
  "currency": "USDT",
  "type": "trade"
}
```

```javascript
// Create a limit sell order with stop loss
{
  "symbol": "ETH-USDT",
  "side": "sell",
  "type": "limit",
  "size": "0.5",
  "price": "2500",
  "stopPrice": "2400"
}
```

```javascript
// Transfer funds to futures account
{
  "currency": "USDT",
  "amount": "1000",
  "from": "main",
  "to": "futures"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 400001 | Invalid API credentials | Verify API key, secret, and passphrase |
| 400100 | Invalid parameter | Check parameter format and requirements |
| 400500 | Insufficient balance | Ensure adequate funds in account |
| 429000 | Rate limit exceeded | Implement delays between requests |
| 500000 | Internal server error | Retry request after delay |
| 200004 | Balance insufficient | Check available balance before trading |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-kucoin-exchange/issues)
- **KuCoin API Documentation**: [KuCoin API Docs](https://docs.kucoin.com/)
- **KuCoin Developer Community**: [KuCoin Developers](https://developers.kucoin.com/)