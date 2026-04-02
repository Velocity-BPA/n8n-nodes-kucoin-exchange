/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-kucoinexchange/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

import * as crypto from 'crypto';
import { createHmac } from 'crypto';

export class KuCoinExchange implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'KuCoin Exchange',
    name: 'kucoinexchange',
    icon: 'file:kucoinexchange.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the KuCoin Exchange API',
    defaults: {
      name: 'KuCoin Exchange',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'kucoinexchangeApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Account',
            value: 'account',
          },
          {
            name: 'TradingPair',
            value: 'tradingPair',
          },
          {
            name: 'Order',
            value: 'order',
          },
          {
            name: 'MarginAccount',
            value: 'marginAccount',
          },
          {
            name: 'MarginOrder',
            value: 'marginOrder',
          },
          {
            name: 'FuturesAccount',
            value: 'futuresAccount',
          },
          {
            name: 'FuturesOrder',
            value: 'futuresOrder',
          },
          {
            name: 'Deposit',
            value: 'deposit',
          },
          {
            name: 'Withdrawal',
            value: 'withdrawal',
          }
        ],
        default: 'account',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['account'] } },
  options: [
    { name: 'Get Accounts', value: 'getAccounts', description: 'Get list of accounts', action: 'Get accounts' },
    { name: 'Get Account', value: 'getAccount', description: 'Get single account details', action: 'Get account details' },
    { name: 'Transfer Funds', value: 'transferFunds', description: 'Transfer between accounts', action: 'Transfer funds between accounts' },
    { name: 'Get Ledgers', value: 'getLedgers', description: 'Get account ledger history', action: 'Get account ledger history' }
  ],
  default: 'getAccounts',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['tradingPair'] } },
  options: [
    { name: 'Get Trading Pairs', value: 'getTradingPairs', description: 'Get all trading pairs', action: 'Get trading pairs' },
    { name: 'Get Ticker', value: 'getTicker', description: 'Get ticker for symbol', action: 'Get ticker' },
    { name: 'Get All Tickers', value: 'getAllTickers', description: 'Get all tickers', action: 'Get all tickers' },
    { name: 'Get 24hr Stats', value: 'get24hrStats', description: 'Get 24hr statistics', action: 'Get 24hr stats' },
    { name: 'Get Order Book', value: 'getOrderBook', description: 'Get order book', action: 'Get order book' },
  ],
  default: 'getTradingPairs',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['order'] } },
  options: [
    { name: 'Create Order', value: 'createOrder', description: 'Place a new spot trading order', action: 'Create order' },
    { name: 'Cancel Order', value: 'cancelOrder', description: 'Cancel a specific order', action: 'Cancel order' },
    { name: 'Cancel All Orders', value: 'cancelAllOrders', description: 'Cancel all orders', action: 'Cancel all orders' },
    { name: 'Get Orders', value: 'getOrders', description: 'Get order list', action: 'Get orders' },
    { name: 'Get Order', value: 'getOrder', description: 'Get single order details', action: 'Get order' },
    { name: 'Get Fills', value: 'getFills', description: 'Get trade history', action: 'Get fills' },
  ],
  default: 'createOrder',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['marginAccount'] } },
  options: [
    { name: 'Get Margin Account Info', value: 'getMarginAccount', description: 'Get margin account information', action: 'Get margin account info' },
    { name: 'Borrow Margin Funds', value: 'borrowMargin', description: 'Borrow funds for margin trading', action: 'Borrow margin funds' },
    { name: 'Repay Margin Funds', value: 'repayMargin', description: 'Repay borrowed funds', action: 'Repay margin funds' },
    { name: 'Get Outstanding Records', value: 'getOutstandingRecords', description: 'Get outstanding borrow records', action: 'Get outstanding records' },
    { name: 'Get Borrow History', value: 'getBorrowHistory', description: 'Get margin borrow history', action: 'Get borrow history' },
  ],
  default: 'getMarginAccount',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['marginOrder'] } },
  options: [
    { name: 'Create Margin Order', value: 'createMarginOrder', description: 'Place a new margin order', action: 'Create margin order' },
    { name: 'Get Margin Orders', value: 'getMarginOrders', description: 'Get list of margin orders', action: 'Get margin orders' },
    { name: 'Cancel Margin Order', value: 'cancelMarginOrder', description: 'Cancel a specific margin order', action: 'Cancel margin order' },
    { name: 'Get Margin Fills', value: 'getMarginFills', description: 'Get margin trade history', action: 'Get margin fills' },
  ],
  default: 'createMarginOrder',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['futuresAccount'] } },
  options: [
    { name: 'Get Futures Account Overview', value: 'getFuturesAccount', description: 'Get futures account overview', action: 'Get futures account overview' },
    { name: 'Get Positions', value: 'getPositions', description: 'Get position details', action: 'Get positions' },
    { name: 'Add Margin', value: 'addMargin', description: 'Add margin to position', action: 'Add margin to position' },
    { name: 'Get Funding History', value: 'getFundingHistory', description: 'Get funding history', action: 'Get funding history' }
  ],
  default: 'getFuturesAccount',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['futuresOrder'] } },
  options: [
    { name: 'Create Futures Order', value: 'createFuturesOrder', description: 'Place a futures trading order', action: 'Create futures order' },
    { name: 'Cancel Futures Order', value: 'cancelFuturesOrder', description: 'Cancel a futures order', action: 'Cancel futures order' },
    { name: 'Get Futures Orders', value: 'getFuturesOrders', description: 'Get list of futures orders', action: 'Get futures orders' },
    { name: 'Get Futures Fills', value: 'getFuturesFills', description: 'Get futures trade history', action: 'Get futures fills' },
    { name: 'Create Stop Order', value: 'createStopOrder', description: 'Create a stop order', action: 'Create stop order' }
  ],
  default: 'createFuturesOrder',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['deposit'] } },
  options: [
    { name: 'Get Deposit Address', value: 'getDepositAddress', description: 'Get deposit address for a currency', action: 'Get deposit address' },
    { name: 'Create Deposit Address', value: 'createDepositAddress', description: 'Create deposit address for a currency', action: 'Create deposit address' },
    { name: 'Get Deposits', value: 'getDeposits', description: 'Get deposit history', action: 'Get deposits' }
  ],
  default: 'getDepositAddress',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['withdrawal'] } },
  options: [
    { name: 'Create Withdrawal', value: 'createWithdrawal', description: 'Create a new withdrawal', action: 'Create withdrawal' },
    { name: 'Cancel Withdrawal', value: 'cancelWithdrawal', description: 'Cancel an existing withdrawal', action: 'Cancel withdrawal' },
    { name: 'Get Withdrawals', value: 'getWithdrawals', description: 'Get withdrawal history', action: 'Get withdrawals' },
    { name: 'Get Withdrawal Quotas', value: 'getWithdrawalQuotas', description: 'Get withdrawal quotas', action: 'Get withdrawal quotas' },
  ],
  default: 'createWithdrawal',
},
{
  displayName: 'Currency',
  name: 'currency',
  type: 'string',
  default: '',
  description: 'Currency code to filter accounts',
  displayOptions: { show: { resource: ['account'], operation: ['getAccounts'] } },
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  options: [
    { name: 'Main', value: 'main' },
    { name: 'Trade', value: 'trade' },
    { name: 'Margin', value: 'margin' }
  ],
  default: 'main',
  description: 'Account type',
  displayOptions: { show: { resource: ['account'], operation: ['getAccounts'] } },
},
{
  displayName: 'Account ID',
  name: 'accountId',
  type: 'string',
  required: true,
  default: '',
  description: 'The ID of the account to retrieve',
  displayOptions: { show: { resource: ['account'], operation: ['getAccount'] } },
},
{
  displayName: 'Client OID',
  name: 'clientOid',
  type: 'string',
  required: true,
  default: '',
  description: 'Client order identifier',
  displayOptions: { show: { resource: ['account'], operation: ['transferFunds'] } },
},
{
  displayName: 'From',
  name: 'from',
  type: 'string',
  required: true,
  default: '',
  description: 'Source account ID',
  displayOptions: { show: { resource: ['account'], operation: ['transferFunds'] } },
},
{
  displayName: 'To',
  name: 'to',
  type: 'string',
  required: true,
  default: '',
  description: 'Destination account ID',
  displayOptions: { show: { resource: ['account'], operation: ['transferFunds'] } },
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  default: '',
  description: 'Amount to transfer',
  displayOptions: { show: { resource: ['account'], operation: ['transferFunds'] } },
},
{
  displayName: 'Transfer Currency',
  name: 'transferCurrency',
  type: 'string',
  required: true,
  default: '',
  description: 'Currency of the transfer',
  displayOptions: { show: { resource: ['account'], operation: ['transferFunds'] } },
},
{
  displayName: 'Ledger Currency',
  name: 'ledgerCurrency',
  type: 'string',
  default: '',
  description: 'Currency code to filter ledgers',
  displayOptions: { show: { resource: ['account'], operation: ['getLedgers'] } },
},
{
  displayName: 'Direction',
  name: 'direction',
  type: 'options',
  options: [
    { name: 'In', value: 'in' },
    { name: 'Out', value: 'out' }
  ],
  default: 'in',
  description: 'Direction of the transfer',
  displayOptions: { show: { resource: ['account'], operation: ['getLedgers'] } },
},
{
  displayName: 'Biz Type',
  name: 'bizType',
  type: 'string',
  default: '',
  description: 'Business type',
  displayOptions: { show: { resource: ['account'], operation: ['getLedgers'] } },
},
{
  displayName: 'Start At',
  name: 'startAt',
  type: 'number',
  default: 0,
  description: 'Start time in milliseconds',
  displayOptions: { show: { resource: ['account'], operation: ['getLedgers'] } },
},
{
  displayName: 'End At',
  name: 'endAt',
  type: 'number',
  default: 0,
  description: 'End time in milliseconds',
  displayOptions: { show: { resource: ['account'], operation: ['getLedgers'] } },
},
{
  displayName: 'Market',
  name: 'market',
  type: 'string',
  default: '',
  description: 'The trading market to filter by',
  displayOptions: {
    show: {
      resource: ['tradingPair'],
      operation: ['getTradingPairs'],
    },
  },
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  default: '',
  description: 'The trading pair symbol (e.g., BTC-USDT)',
  displayOptions: {
    show: {
      resource: ['tradingPair'],
      operation: ['getTicker'],
    },
  },
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  default: '',
  description: 'The trading pair symbol (e.g., BTC-USDT)',
  displayOptions: {
    show: {
      resource: ['tradingPair'],
      operation: ['get24hrStats'],
    },
  },
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  default: '',
  description: 'The trading pair symbol (e.g., BTC-USDT)',
  displayOptions: {
    show: {
      resource: ['tradingPair'],
      operation: ['getOrderBook'],
    },
  },
},
{
  displayName: 'Client Order ID',
  name: 'clientOid',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  default: '',
  description: 'Unique order ID generated by users to identify their orders',
},
{
  displayName: 'Side',
  name: 'side',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  options: [
    { name: 'Buy', value: 'buy' },
    { name: 'Sell', value: 'sell' },
  ],
  default: 'buy',
  description: 'Order side',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['createOrder', 'cancelAllOrders', 'getOrders', 'getFills'] } },
  default: '',
  description: 'Trading symbol (e.g., BTC-USDT)',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  options: [
    { name: 'Limit', value: 'limit' },
    { name: 'Market', value: 'market' },
    { name: 'Stop', value: 'stop' },
    { name: 'Stop Limit', value: 'stop_limit' },
  ],
  default: 'limit',
  description: 'Order type',
},
{
  displayName: 'Price',
  name: 'price',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  default: '',
  description: 'Price per base currency (required for limit orders)',
},
{
  displayName: 'Size',
  name: 'size',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['createOrder'] } },
  default: '',
  description: 'Amount of base currency to buy or sell',
},
{
  displayName: 'Order ID',
  name: 'orderId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['order'], operation: ['cancelOrder', 'getOrder'] } },
  default: '',
  description: 'Order ID to cancel or retrieve',
},
{
  displayName: 'Trade Type',
  name: 'tradeType',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['order'], operation: ['cancelAllOrders'] } },
  options: [
    { name: 'Spot', value: 'TRADE' },
    { name: 'Margin', value: 'MARGIN_TRADE' },
  ],
  default: 'TRADE',
  description: 'Trade type for order cancellation',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['order'], operation: ['getOrders'] } },
  options: [
    { name: 'Active', value: 'active' },
    { name: 'Done', value: 'done' },
  ],
  default: 'active',
  description: 'Filter orders by status',
},
{
  displayName: 'Side Filter',
  name: 'sideFilter',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['order'], operation: ['getOrders', 'getFills'] } },
  options: [
    { name: 'Buy', value: 'buy' },
    { name: 'Sell', value: 'sell' },
  ],
  default: '',
  description: 'Filter by order side',
},
{
  displayName: 'Type Filter',
  name: 'typeFilter',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['order'], operation: ['getOrders', 'getFills'] } },
  options: [
    { name: 'Limit', value: 'limit' },
    { name: 'Market', value: 'market' },
    { name: 'Stop', value: 'stop' },
    { name: 'Stop Limit', value: 'stop_limit' },
  ],
  default: '',
  description: 'Filter by order type',
},
{
  displayName: 'Start Time',
  name: 'startAt',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['order'], operation: ['getOrders', 'getFills'] } },
  default: '',
  description: 'Start time (epoch timestamp in milliseconds)',
},
{
  displayName: 'End Time',
  name: 'endAt',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['order'], operation: ['getOrders', 'getFills'] } },
  default: '',
  description: 'End time (epoch timestamp in milliseconds)',
},
{
  displayName: 'Order ID Filter',
  name: 'orderIdFilter',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['order'], operation: ['getFills'] } },
  default: '',
  description: 'Filter fills by order ID',
},
{
  displayName: 'Symbol Filter',
  name: 'symbolFilter',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['order'], operation: ['getFills'] } },
  default: '',
  description: 'Filter fills by trading symbol',
},
{
  displayName: 'Currency',
  name: 'currency',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['marginAccount'],
      operation: ['borrowMargin', 'repayMargin', 'getOutstandingRecords', 'getBorrowHistory'],
    },
  },
  default: '',
  placeholder: 'USDT',
  description: 'The currency code',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  required: true,
  displayOptions: {
    show: {
      resource: ['marginAccount'],
      operation: ['borrowMargin', 'repayMargin'],
    },
  },
  options: [
    { name: 'FOK', value: 'FOK' },
    { name: 'IOC', value: 'IOC' },
  ],
  default: 'FOK',
  description: 'The borrow/repay type',
},
{
  displayName: 'Size',
  name: 'size',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['marginAccount'],
      operation: ['borrowMargin', 'repayMargin'],
    },
  },
  default: '',
  placeholder: '100',
  description: 'The amount to borrow or repay',
},
{
  displayName: 'Start Time',
  name: 'startAt',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['marginAccount'],
      operation: ['getBorrowHistory'],
    },
  },
  default: '',
  description: 'Start time for the query',
},
{
  displayName: 'End Time',
  name: 'endAt',
  type: 'dateTime',
  displayOptions: {
    show: {
      resource: ['marginAccount'],
      operation: ['getBorrowHistory'],
    },
  },
  default: '',
  description: 'End time for the query',
},
{
  displayName: 'Client Order ID',
  name: 'clientOid',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['marginOrder'], operation: ['createMarginOrder'] } },
  default: '',
  description: 'Client-generated unique identifier for the order',
},
{
  displayName: 'Side',
  name: 'side',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['marginOrder'], operation: ['createMarginOrder'] } },
  options: [
    { name: 'Buy', value: 'buy' },
    { name: 'Sell', value: 'sell' },
  ],
  default: 'buy',
  description: 'Side of the order',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['marginOrder'], operation: ['createMarginOrder', 'getMarginOrders', 'getMarginFills'] } },
  default: '',
  description: 'Trading symbol (e.g., BTC-USDT)',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['marginOrder'], operation: ['createMarginOrder'] } },
  options: [
    { name: 'Limit', value: 'limit' },
    { name: 'Market', value: 'market' },
  ],
  default: 'limit',
  description: 'Order type',
},
{
  displayName: 'Price',
  name: 'price',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['marginOrder'], operation: ['createMarginOrder'], type: ['limit'] } },
  default: '',
  description: 'Price per unit (required for limit orders)',
},
{
  displayName: 'Size',
  name: 'size',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['marginOrder'], operation: ['createMarginOrder'] } },
  default: '',
  description: 'Amount of base currency to buy or sell',
},
{
  displayName: 'Time in Force',
  name: 'timeInForce',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['marginOrder'], operation: ['createMarginOrder'] } },
  options: [
    { name: 'Good Till Canceled', value: 'GTC' },
    { name: 'Immediate or Cancel', value: 'IOC' },
    { name: 'Fill or Kill', value: 'FOK' },
  ],
  default: 'GTC',
  description: 'Time in force policy',
},
{
  displayName: 'Symbol',
  name: 'filterSymbol',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['marginOrder'], operation: ['getMarginOrders'] } },
  default: '',
  description: 'Filter orders by trading symbol',
},
{
  displayName: 'Side',
  name: 'filterSide',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['marginOrder'], operation: ['getMarginOrders', 'getMarginFills'] } },
  options: [
    { name: 'Buy', value: 'buy' },
    { name: 'Sell', value: 'sell' },
  ],
  default: 'buy',
  description: 'Filter by order side',
},
{
  displayName: 'Type',
  name: 'filterType',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['marginOrder'], operation: ['getMarginOrders', 'getMarginFills'] } },
  options: [
    { name: 'Limit', value: 'limit' },
    { name: 'Market', value: 'market' },
  ],
  default: 'limit',
  description: 'Filter by order type',
},
{
  displayName: 'Start Time',
  name: 'startAt',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['marginOrder'], operation: ['getMarginOrders'] } },
  default: 0,
  description: 'Start time in milliseconds',
},
{
  displayName: 'End Time',
  name: 'endAt',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['marginOrder'], operation: ['getMarginOrders'] } },
  default: 0,
  description: 'End time in milliseconds',
},
{
  displayName: 'Order ID',
  name: 'orderId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['marginOrder'], operation: ['cancelMarginOrder'] } },
  default: '',
  description: 'ID of the order to cancel',
},
{
  displayName: 'Order ID',
  name: 'filterOrderId',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['marginOrder'], operation: ['getMarginFills'] } },
  default: '',
  description: 'Filter fills by order ID',
},
{
  displayName: 'Currency',
  name: 'currency',
  type: 'string',
  required: false,
  default: '',
  description: 'Currency for the account overview',
  displayOptions: {
    show: {
      resource: ['futuresAccount'],
      operation: ['getFuturesAccount']
    }
  }
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: false,
  default: '',
  description: 'Trading symbol',
  displayOptions: {
    show: {
      resource: ['futuresAccount'],
      operation: ['getPositions']
    }
  }
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  default: '',
  description: 'Trading symbol',
  displayOptions: {
    show: {
      resource: ['futuresAccount'],
      operation: ['addMargin']
    }
  }
},
{
  displayName: 'Margin',
  name: 'margin',
  type: 'string',
  required: true,
  default: '',
  description: 'Margin amount to add',
  displayOptions: {
    show: {
      resource: ['futuresAccount'],
      operation: ['addMargin']
    }
  }
},
{
  displayName: 'Business Number',
  name: 'bizNo',
  type: 'string',
  required: true,
  default: '',
  description: 'Business number for the margin operation',
  displayOptions: {
    show: {
      resource: ['futuresAccount'],
      operation: ['addMargin']
    }
  }
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: false,
  default: '',
  description: 'Trading symbol',
  displayOptions: {
    show: {
      resource: ['futuresAccount'],
      operation: ['getFundingHistory']
    }
  }
},
{
  displayName: 'Start Time',
  name: 'startAt',
  type: 'number',
  required: false,
  default: 0,
  description: 'Start time in milliseconds',
  displayOptions: {
    show: {
      resource: ['futuresAccount'],
      operation: ['getFundingHistory']
    }
  }
},
{
  displayName: 'End Time',
  name: 'endAt',
  type: 'number',
  required: false,
  default: 0,
  description: 'End time in milliseconds',
  displayOptions: {
    show: {
      resource: ['futuresAccount'],
      operation: ['getFundingHistory']
    }
  }
},
{
  displayName: 'Client Order ID',
  name: 'clientOid',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['futuresOrder'], operation: ['createFuturesOrder', 'createStopOrder'] } },
  default: '',
  description: 'Unique order ID created by users to identify their orders',
},
{
  displayName: 'Side',
  name: 'side',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['futuresOrder'], operation: ['createFuturesOrder', 'createStopOrder'] } },
  options: [
    { name: 'Buy', value: 'buy' },
    { name: 'Sell', value: 'sell' }
  ],
  default: 'buy',
  description: 'Order side',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['futuresOrder'], operation: ['createFuturesOrder', 'createStopOrder'] } },
  default: '',
  description: 'Trading pair symbol (e.g., XBTUSDM)',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['futuresOrder'], operation: ['createFuturesOrder'] } },
  options: [
    { name: 'Limit', value: 'limit' },
    { name: 'Market', value: 'market' }
  ],
  default: 'limit',
  description: 'Order type',
},
{
  displayName: 'Leverage',
  name: 'lever',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['futuresOrder'], operation: ['createFuturesOrder'] } },
  default: 1,
  description: 'Leverage of the order',
},
{
  displayName: 'Size',
  name: 'size',
  type: 'number',
  required: true,
  displayOptions: { show: { resource: ['futuresOrder'], operation: ['createFuturesOrder', 'createStopOrder'] } },
  default: 0,
  description: 'Order size (number of contracts)',
},
{
  displayName: 'Price',
  name: 'price',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['futuresOrder'], operation: ['createFuturesOrder'] } },
  default: 0,
  description: 'Order price (required for limit orders)',
},
{
  displayName: 'Order ID',
  name: 'orderId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['futuresOrder'], operation: ['cancelFuturesOrder'] } },
  default: '',
  description: 'Order ID to cancel',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['futuresOrder'], operation: ['getFuturesOrders'] } },
  options: [
    { name: 'Active', value: 'active' },
    { name: 'Done', value: 'done' }
  ],
  default: 'active',
  description: 'Order status filter',
},
{
  displayName: 'Symbol',
  name: 'symbol',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['futuresOrder'], operation: ['getFuturesOrders', 'getFuturesFills'] } },
  default: '',
  description: 'Trading pair symbol filter',
},
{
  displayName: 'Side',
  name: 'side',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['futuresOrder'], operation: ['getFuturesOrders', 'getFuturesFills'] } },
  options: [
    { name: 'Buy', value: 'buy' },
    { name: 'Sell', value: 'sell' }
  ],
  default: 'buy',
  description: 'Order side filter',
},
{
  displayName: 'Type',
  name: 'type',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['futuresOrder'], operation: ['getFuturesOrders', 'getFuturesFills', 'createStopOrder'] } },
  options: [
    { name: 'Limit', value: 'limit' },
    { name: 'Market', value: 'market' }
  ],
  default: 'limit',
  description: 'Order type filter',
},
{
  displayName: 'Start Time',
  name: 'startAt',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['futuresOrder'], operation: ['getFuturesOrders', 'getFuturesFills'] } },
  default: 0,
  description: 'Start time in milliseconds',
},
{
  displayName: 'End Time',
  name: 'endAt',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['futuresOrder'], operation: ['getFuturesOrders', 'getFuturesFills'] } },
  default: 0,
  description: 'End time in milliseconds',
},
{
  displayName: 'Order ID',
  name: 'orderId',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['futuresOrder'], operation: ['getFuturesFills'] } },
  default: '',
  description: 'Order ID filter for fills',
},
{
  displayName: 'Stop',
  name: 'stop',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['futuresOrder'], operation: ['createStopOrder'] } },
  options: [
    { name: 'Down', value: 'down' },
    { name: 'Up', value: 'up' }
  ],
  default: 'down',
  description: 'Stop order direction',
},
{
  displayName: 'Stop Price Type',
  name: 'stopPriceType',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['futuresOrder'], operation: ['createStopOrder'] } },
  options: [
    { name: 'Trade Price', value: 'TP' },
    { name: 'Mark Price', value: 'MP' },
    { name: 'Index Price', value: 'IP' }
  ],
  default: 'TP',
  description: 'Price type for stop order trigger',
},
{
  displayName: 'Currency',
  name: 'currency',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['deposit'], operation: ['getDepositAddress', 'createDepositAddress'] } },
  default: '',
  description: 'The currency code (e.g., BTC, ETH)',
},
{
  displayName: 'Chain',
  name: 'chain',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['deposit'], operation: ['getDepositAddress', 'createDepositAddress'] } },
  default: '',
  description: 'The chain name (optional)',
},
{
  displayName: 'Currency',
  name: 'currency',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['deposit'], operation: ['getDeposits'] } },
  default: '',
  description: 'The currency code to filter deposits',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['deposit'], operation: ['getDeposits'] } },
  options: [
    { name: 'Processing', value: 'PROCESSING' },
    { name: 'Success', value: 'SUCCESS' },
    { name: 'Failure', value: 'FAILURE' }
  ],
  default: '',
  description: 'The deposit status to filter',
},
{
  displayName: 'Start Time',
  name: 'startAt',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['deposit'], operation: ['getDeposits'] } },
  default: '',
  description: 'Start time as Unix timestamp in milliseconds',
},
{
  displayName: 'End Time',
  name: 'endAt',
  type: 'number',
  required: false,
  displayOptions: { show: { resource: ['deposit'], operation: ['getDeposits'] } },
  default: '',
  description: 'End time as Unix timestamp in milliseconds',
},
{
  displayName: 'Currency',
  name: 'currency',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['withdrawal'], operation: ['createWithdrawal'] } },
  default: '',
  description: 'The currency to withdraw',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['withdrawal'], operation: ['createWithdrawal'] } },
  default: '',
  description: 'Withdrawal address',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['withdrawal'], operation: ['createWithdrawal'] } },
  default: '',
  description: 'Withdrawal amount',
},
{
  displayName: 'Memo',
  name: 'memo',
  type: 'string',
  displayOptions: { show: { resource: ['withdrawal'], operation: ['createWithdrawal'] } },
  default: '',
  description: 'Address memo (tag)',
},
{
  displayName: 'Is Inner Transfer',
  name: 'isInner',
  type: 'boolean',
  displayOptions: { show: { resource: ['withdrawal'], operation: ['createWithdrawal'] } },
  default: false,
  description: 'Whether it is an internal transfer',
},
{
  displayName: 'Remark',
  name: 'remark',
  type: 'string',
  displayOptions: { show: { resource: ['withdrawal'], operation: ['createWithdrawal'] } },
  default: '',
  description: 'Remark for the withdrawal',
},
{
  displayName: 'Chain',
  name: 'chain',
  type: 'string',
  displayOptions: { show: { resource: ['withdrawal'], operation: ['createWithdrawal'] } },
  default: '',
  description: 'The blockchain network for the withdrawal',
},
{
  displayName: 'Withdrawal ID',
  name: 'withdrawalId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['withdrawal'], operation: ['cancelWithdrawal'] } },
  default: '',
  description: 'The withdrawal ID to cancel',
},
{
  displayName: 'Currency',
  name: 'currency',
  type: 'string',
  displayOptions: { show: { resource: ['withdrawal'], operation: ['getWithdrawals', 'getWithdrawalQuotas'] } },
  default: '',
  description: 'Filter by currency',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  displayOptions: { show: { resource: ['withdrawal'], operation: ['getWithdrawals'] } },
  options: [
    { name: 'Processing', value: 'PROCESSING' },
    { name: 'Wallet Processing', value: 'WALLET_PROCESSING' },
    { name: 'Success', value: 'SUCCESS' },
    { name: 'Failure', value: 'FAILURE' },
  ],
  default: '',
  description: 'Filter by withdrawal status',
},
{
  displayName: 'Start Time',
  name: 'startAt',
  type: 'dateTime',
  displayOptions: { show: { resource: ['withdrawal'], operation: ['getWithdrawals'] } },
  default: '',
  description: 'Start time for the query range',
},
{
  displayName: 'End Time',
  name: 'endAt',
  type: 'dateTime',
  displayOptions: { show: { resource: ['withdrawal'], operation: ['getWithdrawals'] } },
  default: '',
  description: 'End time for the query range',
},
{
  displayName: 'Chain',
  name: 'chain',
  type: 'string',
  displayOptions: { show: { resource: ['withdrawal'], operation: ['getWithdrawalQuotas'] } },
  default: '',
  description: 'The blockchain network',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'account':
        return [await executeAccountOperations.call(this, items)];
      case 'tradingPair':
        return [await executeTradingPairOperations.call(this, items)];
      case 'order':
        return [await executeOrderOperations.call(this, items)];
      case 'marginAccount':
        return [await executeMarginAccountOperations.call(this, items)];
      case 'marginOrder':
        return [await executeMarginOrderOperations.call(this, items)];
      case 'futuresAccount':
        return [await executeFuturesAccountOperations.call(this, items)];
      case 'futuresOrder':
        return [await executeFuturesOrderOperations.call(this, items)];
      case 'deposit':
        return [await executeDepositOperations.call(this, items)];
      case 'withdrawal':
        return [await executeWithdrawalOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeAccountOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('kucoinexchangeApi') as any;

  const createSignature = (timestamp: string, method: string, endpoint: string, body: string = ''): string => {
    const message = timestamp + method + endpoint + body;
    return crypto.createHmac('sha256', credentials.secretKey).update(message).digest('base64');
  };

  const getHeaders = (method: string, endpoint: string, body: string = ''): any => {
    const timestamp = Date.now().toString();
    const signature = createSignature(timestamp, method, endpoint, body);
    const passphrase = crypto.createHmac('sha256', credentials.secretKey).update(credentials.passphrase).digest('base64');
    
    return {
      'KC-API-KEY': credentials.apiKey,
      'KC-API-SIGN': signature,
      'KC-API-TIMESTAMP': timestamp,
      'KC-API-PASSPHRASE': passphrase,
      'KC-API-KEY-VERSION': '2',
      'Content-Type': 'application/json'
    };
  };

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getAccounts': {
          const currency = this.getNodeParameter('currency', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          
          let endpoint = '/api/v1/accounts';
          const params: string[] = [];
          if (currency) params.push(`currency=${currency}`);
          if (type) params.push(`type=${type}`);
          if (params.length > 0) endpoint += `?${params.join('&')}`;
          
          const options: any = {
            method: 'GET',
            url: credentials.baseUrl + endpoint,
            headers: getHeaders('GET', endpoint),
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getAccount': {
          const accountId = this.getNodeParameter('accountId', i) as string;
          const endpoint = `/api/v1/accounts/${accountId}`;
          
          const options: any = {
            method: 'GET',
            url: credentials.baseUrl + endpoint,
            headers: getHeaders('GET', endpoint),
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'transferFunds': {
          const clientOid = this.getNodeParameter('clientOid', i) as string;
          const from = this.getNodeParameter('from', i) as string;
          const to = this.getNodeParameter('to', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const currency = this.getNodeParameter('transferCurrency', i) as string;
          
          const endpoint = '/api/v1/accounts/inner-transfer';
          const body = JSON.stringify({
            clientOid,
            from,
            to,
            amount,
            currency
          });
          
          const options: any = {
            method: 'POST',
            url: credentials.baseUrl + endpoint,
            headers: getHeaders('POST', endpoint, body),
            body,
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getLedgers': {
          const currency = this.getNodeParameter('ledgerCurrency', i) as string;
          const direction = this.getNodeParameter('direction', i) as string;
          const bizType = this.getNodeParameter('bizType', i) as string;
          const startAt = this.getNodeParameter('startAt', i) as number;
          const endAt = this.getNodeParameter('endAt', i) as number;
          
          let endpoint = '/api/v1/accounts/ledgers';
          const params: string[] = [];
          if (currency) params.push(`currency=${currency}`);
          if (direction) params.push(`direction=${direction}`);
          if (bizType) params.push(`bizType=${bizType}`);
          if (startAt) params.push(`startAt=${startAt}`);
          if (endAt) params.push(`endAt=${endAt}`);
          if (params.length > 0) endpoint += `?${params.join('&')}`;
          
          const options: any = {
            method: 'GET',
            url: credentials.baseUrl + endpoint,
            headers: getHeaders('GET', endpoint),
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}

async function executeTradingPairOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('kucoinexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const timestamp = Date.now().toString();
      const passphrase = Buffer.from(credentials.passphrase).toString('base64');

      switch (operation) {
        case 'getTradingPairs': {
          const market = this.getNodeParameter('market', i) as string;
          let endpoint = '/api/v1/symbols';
          if (market) {
            endpoint += `?market=${market}`;
          }

          const options: any = {
            method: 'GET',
            url: credentials.baseUrl + endpoint,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': credentials.apiSecret,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': passphrase,
              'KC-API-KEY-VERSION': '2',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getTicker': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const endpoint = `/api/v1/market/orderbook/level1?symbol=${symbol}`;

          const options: any = {
            method: 'GET',
            url: credentials.baseUrl + endpoint,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': credentials.apiSecret,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': passphrase,
              'KC-API-KEY-VERSION': '2',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getAllTickers': {
          const endpoint = '/api/v1/market/allTickers';

          const options: any = {
            method: 'GET',
            url: credentials.baseUrl + endpoint,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': credentials.apiSecret,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': passphrase,
              'KC-API-KEY-VERSION': '2',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'get24hrStats': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const endpoint = `/api/v1/market/stats?symbol=${symbol}`;

          const options: any = {
            method: 'GET',
            url: credentials.baseUrl + endpoint,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': credentials.apiSecret,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': passphrase,
              'KC-API-KEY-VERSION': '2',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getOrderBook': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const endpoint = `/api/v1/market/orderbook/level2_20?symbol=${symbol}`;

          const options: any = {
            method: 'GET',
            url: credentials.baseUrl + endpoint,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': credentials.apiSecret,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': passphrase,
              'KC-API-KEY-VERSION': '2',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        default:
          throw new NodeOperationError(this.getNode(), 'Unknown operation: ' + operation);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeOrderOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('kucoinexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const timestamp = Date.now().toString();
      
      switch (operation) {
        case 'createOrder': {
          const body: any = {
            side: this.getNodeParameter('side', i) as string,
            symbol: this.getNodeParameter('symbol', i) as string,
            type: this.getNodeParameter('type', i) as string,
            size: this.getNodeParameter('size', i) as string,
          };
          
          const clientOid = this.getNodeParameter('clientOid', i) as string;
          if (clientOid) body.clientOid = clientOid;
          
          const price = this.getNodeParameter('price', i) as string;
          if (price) body.price = price;
          
          const endpoint = '/api/v1/orders';
          const method = 'POST';
          const bodyStr = JSON.stringify(body);
          const signatureString = timestamp + method + endpoint + bodyStr;
          const signature = crypto.createHmac('sha256', credentials.secretKey).update(signatureString).digest('base64');
          
          const options: any = {
            method: method,
            url: credentials.baseUrl + endpoint,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': signature,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': credentials.passphrase,
              'KC-API-KEY-VERSION': '2',
              'Content-Type': 'application/json',
            },
            body: bodyStr,
            json: false,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          if (typeof result === 'string') result = JSON.parse(result);
          break;
        }
        
        case 'cancelOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const endpoint = `/api/v1/orders/${orderId}`;
          const method = 'DELETE';
          const signatureString = timestamp + method + endpoint;
          const signature = crypto.createHmac('sha256', credentials.secretKey).update(signatureString).digest('base64');
          
          const options: any = {
            method: method,
            url: credentials.baseUrl + endpoint,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': signature,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': credentials.passphrase,
              'KC-API-KEY-VERSION': '2',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'cancelAllOrders': {
          const endpoint = '/api/v1/orders';
          const method = 'DELETE';
          const queryParams: any = {};
          
          const symbol = this.getNodeParameter('symbol', i) as string;
          if (symbol) queryParams.symbol = symbol;
          
          const tradeType = this.getNodeParameter('tradeType', i) as string;
          if (tradeType) queryParams.tradeType = tradeType;
          
          const queryString = Object.keys(queryParams).length ? '?' + new URLSearchParams(queryParams).toString() : '';
          const fullEndpoint = endpoint + queryString;
          const signatureString = timestamp + method + fullEndpoint;
          const signature = crypto.createHmac('sha256', credentials.secretKey).update(signatureString).digest('base64');
          
          const options: any = {
            method: method,
            url: credentials.baseUrl + fullEndpoint,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': signature,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': credentials.passphrase,
              'KC-API-KEY-VERSION': '2',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getOrders': {
          const endpoint = '/api/v1/orders';
          const method = 'GET';
          const queryParams: any = {};
          
          const status = this.getNodeParameter('status', i) as string;
          if (status) queryParams.status = status;
          
          const symbol = this.getNodeParameter('symbol', i) as string;
          if (symbol) queryParams.symbol = symbol;
          
          const sideFilter = this.getNodeParameter('sideFilter', i) as string;
          if (sideFilter) queryParams.side = sideFilter;
          
          const typeFilter = this.getNodeParameter('typeFilter', i) as string;
          if (typeFilter) queryParams.type = typeFilter;
          
          const startAt = this.getNodeParameter('startAt', i) as string;
          if (startAt) queryParams.startAt = startAt;
          
          const endAt = this.getNodeParameter('endAt', i) as string;
          if (endAt) queryParams.endAt = endAt;
          
          const queryString = Object.keys(queryParams).length ? '?' + new URLSearchParams(queryParams).toString() : '';
          const fullEndpoint = endpoint + queryString;
          const signatureString = timestamp + method + fullEndpoint;
          const signature = crypto.createHmac('sha256', credentials.secretKey).update(signatureString).digest('base64');
          
          const options: any = {
            method: method,
            url: credentials.baseUrl + fullEndpoint,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': signature,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': credentials.passphrase,
              'KC-API-KEY-VERSION': '2',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const endpoint = `/api/v1/orders/${orderId}`;
          const method = 'GET';
          const signatureString = timestamp + method + endpoint;
          const signature = crypto.createHmac('sha256', credentials.secretKey).update(signatureString).digest('base64');
          
          const options: any = {
            method: method,
            url: credentials.baseUrl + endpoint,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': signature,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': credentials.passphrase,
              'KC-API-KEY-VERSION': '2',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getFills': {
          const endpoint = '/api/v1/fills';
          const method = 'GET';
          const queryParams: any = {};
          
          const orderIdFilter = this.getNodeParameter('orderIdFilter', i) as string;
          if (orderIdFilter) queryParams.orderId = orderIdFilter;
          
          const symbolFilter = this.getNodeParameter('symbolFilter', i) as string;
          if (symbolFilter) queryParams.symbol = symbolFilter;
          
          const sideFilter = this.getNodeParameter('sideFilter', i) as string;
          if (sideFilter) queryParams.side = sideFilter;
          
          const typeFilter = this.getNodeParameter('typeFilter', i) as string;
          if (typeFilter) queryParams.type = typeFilter;
          
          const startAt = this.getNodeParameter('startAt', i) as string;
          if (startAt) queryParams.startAt = startAt;
          
          const endAt = this.getNodeParameter('endAt', i) as string;
          if (endAt) queryParams.endAt = endAt;
          
          const queryString = Object.keys(queryParams).length ? '?' + new URLSearchParams(queryParams).toString() : '';
          const fullEndpoint = endpoint + queryString;
          const signatureString = timestamp + method + fullEndpoint;
          const signature = crypto.createHmac('sha256', credentials.secretKey).update(signatureString).digest('base64');
          
          const options: any = {
            method: method,
            url: credentials.baseUrl + fullEndpoint,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': signature,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': credentials.passphrase,
              'KC-API-KEY-VERSION': '2',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}

async function executeMarginAccountOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('kucoinexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const timestamp = Date.now().toString();
      const passphrase = Buffer.from(credentials.passphrase).toString('base64');

      switch (operation) {
        case 'getMarginAccount': {
          const endpoint = '/api/v1/margin/account';
          const signature = createHmac('sha256', credentials.apiSecret)
            .update(timestamp + 'GET' + endpoint)
            .digest('base64');

          const options: any = {
            method: 'GET',
            url: credentials.baseUrl + endpoint,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': signature,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': passphrase,
              'KC-API-KEY-VERSION': '2',
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'borrowMargin': {
          const currency = this.getNodeParameter('currency', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const size = this.getNodeParameter('size', i) as string;
          const endpoint = '/api/v1/margin/borrow';
          const body = { currency, type, size };
          const bodyString = JSON.stringify(body);

          const signature = createHmac('sha256', credentials.apiSecret)
            .update(timestamp + 'POST' + endpoint + bodyString)
            .digest('base64');

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl + endpoint,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': signature,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': passphrase,
              'KC-API-KEY-VERSION': '2',
              'Content-Type': 'application/json',
            },
            body: body,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'repayMargin': {
          const currency = this.getNodeParameter('currency', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const size = this.getNodeParameter('size', i) as string;
          const endpoint = '/api/v1/margin/repay';
          const body = { currency, type, size };
          const bodyString = JSON.stringify(body);

          const signature = createHmac('sha256', credentials.apiSecret)
            .update(timestamp + 'POST' + endpoint + bodyString)
            .digest('base64');

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl + endpoint,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': signature,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': passphrase,
              'KC-API-KEY-VERSION': '2',
              'Content-Type': 'application/json',
            },
            body: body,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getOutstandingRecords': {
          const currency = this.getNodeParameter('currency', i) as string;
          const endpoint = `/api/v1/margin/borrow/outstanding?currency=${currency}`;

          const signature = createHmac('sha256', credentials.apiSecret)
            .update(timestamp + 'GET' + endpoint)
            .digest('base64');

          const options: any = {
            method: 'GET',
            url: credentials.baseUrl + endpoint,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': signature,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': passphrase,
              'KC-API-KEY-VERSION': '2',
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBorrowHistory': {
          const currency = this.getNodeParameter('currency', i) as string;
          const startAt = this.getNodeParameter('startAt', i, '') as string;
          const endAt = this.getNodeParameter('endAt', i, '') as string;
          
          let queryParams = `currency=${currency}`;
          if (startAt) queryParams += `&startAt=${new Date(startAt).getTime()}`;
          if (endAt) queryParams += `&endAt=${new Date(endAt).getTime()}`;
          
          const endpoint = `/api/v1/margin/borrow/borrow?${queryParams}`;

          const signature = createHmac('sha256', credentials.apiSecret)
            .update(timestamp + 'GET' + endpoint)
            .digest('base64');

          const options: any = {
            method: 'GET',
            url: credentials.baseUrl + endpoint,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': signature,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': passphrase,
              'KC-API-KEY-VERSION': '2',
              'Content-Type': 'application/json',
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }
  return returnData;
}

async function executeMarginOrderOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('kucoinexchangeApi') as any;

  const generateSignature = (timestamp: string, method: string, requestPath: string, body: string = ''): string => {
    const strForSign = timestamp + method + requestPath + body;
    return createHmac('sha256', credentials.secretKey)
      .update(strForSign)
      .digest('base64');
  };

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const timestamp = Date.now().toString();

      switch (operation) {
        case 'createMarginOrder': {
          const clientOid = this.getNodeParameter('clientOid', i) as string;
          const side = this.getNodeParameter('side', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const size = this.getNodeParameter('size', i) as string;
          const timeInForce = this.getNodeParameter('timeInForce', i) as string;
          
          const body: any = {
            clientOid,
            side,
            symbol,
            type,
            size,
            timeInForce,
          };

          if (type === 'limit') {
            const price = this.getNodeParameter('price', i) as string;
            body.price = price;
          }

          const requestPath = '/api/v1/margin/order';
          const bodyString = JSON.stringify(body);
          const signature = generateSignature(timestamp, 'POST', requestPath, bodyString);

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}${requestPath}`,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': signature,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': Buffer.from(credentials.passphrase).toString('base64'),
              'KC-API-KEY-VERSION': '2',
              'Content-Type': 'application/json',
            },
            body: bodyString,
            json: false,
          };

          result = await this.helpers.httpRequest(options) as any;
          if (typeof result === 'string') {
            result = JSON.parse(result);
          }
          break;
        }

        case 'getMarginOrders': {
          const filterSymbol = this.getNodeParameter('filterSymbol', i) as string;
          const filterSide = this.getNodeParameter('filterSide', i) as string;
          const filterType = this.getNodeParameter('filterType', i) as string;
          const startAt = this.getNodeParameter('startAt', i) as number;
          const endAt = this.getNodeParameter('endAt', i) as number;

          const queryParams: string[] = [];
          if (filterSymbol) queryParams.push(`symbol=${filterSymbol}`);
          if (filterSide) queryParams.push(`side=${filterSide}`);
          if (filterType) queryParams.push(`type=${filterType}`);
          if (startAt) queryParams.push(`startAt=${startAt}`);
          if (endAt) queryParams.push(`endAt=${endAt}`);

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
          const requestPath = `/api/v1/margin/orders${queryString}`;
          const signature = generateSignature(timestamp, 'GET', requestPath);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}${requestPath}`,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': signature,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': Buffer.from(credentials.passphrase).toString('base64'),
              'KC-API-KEY-VERSION': '2',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'cancelMarginOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const requestPath = `/api/v1/margin/orders/${orderId}`;
          const signature = generateSignature(timestamp, 'DELETE', requestPath);

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}${requestPath}`,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': signature,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': Buffer.from(credentials.passphrase).toString('base64'),
              'KC-API-KEY-VERSION': '2',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getMarginFills': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const filterOrderId = this.getNodeParameter('filterOrderId', i) as string;
          const filterSide = this.getNodeParameter('filterSide', i) as string;
          const filterType = this.getNodeParameter('filterType', i) as string;

          const queryParams: string[] = [];
          if (symbol) queryParams.push(`symbol=${symbol}`);
          if (filterOrderId) queryParams.push(`orderId=${filterOrderId}`);
          if (filterSide) queryParams.push(`side=${filterSide}`);
          if (filterType) queryParams.push(`type=${filterType}`);

          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
          const requestPath = `/api/v1/margin/fills${queryString}`;
          const signature = generateSignature(timestamp, 'GET', requestPath);

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}${requestPath}`,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': signature,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': Buffer.from(credentials.passphrase).toString('base64'),
              'KC-API-KEY-VERSION': '2',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeFuturesAccountOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('kucoinexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const timestamp = Date.now().toString();
      const passphrase = Buffer.from(credentials.passphrase).toString('base64');

      switch (operation) {
        case 'getFuturesAccount': {
          const currency = this.getNodeParameter('currency', i) as string;
          let endpoint = '/api/v1/account-overview';
          if (currency) {
            endpoint += `?currency=${currency}`;
          }

          const options: any = {
            method: 'GET',
            url: credentials.baseUrl + endpoint,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': credentials.signature,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': passphrase,
              'KC-API-KEY-VERSION': '2',
              'Content-Type': 'application/json'
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPositions': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          let endpoint = '/api/v1/position';
          if (symbol) {
            endpoint += `?symbol=${symbol}`;
          }

          const options: any = {
            method: 'GET',
            url: credentials.baseUrl + endpoint,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': credentials.signature,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': passphrase,
              'KC-API-KEY-VERSION': '2',
              'Content-Type': 'application/json'
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'addMargin': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const margin = this.getNodeParameter('margin', i) as string;
          const bizNo = this.getNodeParameter('bizNo', i) as string;

          const body = {
            symbol,
            margin,
            bizNo
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl + '/api/v1/position/margin/deposit-margin',
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': credentials.signature,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': passphrase,
              'KC-API-KEY-VERSION': '2',
              'Content-Type': 'application/json'
            },
            body,
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getFundingHistory': {
          const symbol = this.getNodeParameter('symbol', i) as string;
          const startAt = this.getNodeParameter('startAt', i) as number;
          const endAt = this.getNodeParameter('endAt', i) as number;

          let endpoint = '/api/v1/funding-history';
          const params: string[] = [];
          if (symbol) params.push(`symbol=${symbol}`);
          if (startAt) params.push(`startAt=${startAt}`);
          if (endAt) params.push(`endAt=${endAt}`);
          if (params.length > 0) {
            endpoint += `?${params.join('&')}`;
          }

          const options: any = {
            method: 'GET',
            url: credentials.baseUrl + endpoint,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': credentials.signature,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': passphrase,
              'KC-API-KEY-VERSION': '2',
              'Content-Type': 'application/json'
            },
            json: true
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), 'Unknown operation: ' + operation);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeFuturesOrderOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('kucoinexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'createFuturesOrder': {
          const clientOid = this.getNodeParameter('clientOid', i) as string;
          const side = this.getNodeParameter('side', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const lever = this.getNodeParameter('lever', i) as number;
          const size = this.getNodeParameter('size', i) as number;
          const price = this.getNodeParameter('price', i) as number;

          const body: any = {
            clientOid,
            side,
            symbol,
            type,
            lever,
            size,
          };

          if (type === 'limit' && price) {
            body.price = price;
          }

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/v1/orders`,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SECRET': credentials.apiSecret,
              'KC-API-PASSPHRASE': credentials.passphrase,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'cancelFuturesOrder': {
          const orderId = this.getNodeParameter('orderId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/api/v1/orders/${orderId}`,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SECRET': credentials.apiSecret,
              'KC-API-PASSPHRASE': credentials.passphrase,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getFuturesOrders': {
          const status = this.getNodeParameter('status', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const side = this.getNodeParameter('side', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const startAt = this.getNodeParameter('startAt', i) as number;
          const endAt = this.getNodeParameter('endAt', i) as number;

          const queryParams = new URLSearchParams();
          if (status) queryParams.append('status', status);
          if (symbol) queryParams.append('symbol', symbol);
          if (side) queryParams.append('side', side);
          if (type) queryParams.append('type', type);
          if (startAt) queryParams.append('startAt', startAt.toString());
          if (endAt) queryParams.append('endAt', endAt.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/v1/orders?${queryParams.toString()}`,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SECRET': credentials.apiSecret,
              'KC-API-PASSPHRASE': credentials.passphrase,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getFuturesFills': {
          const orderId = this.getNodeParameter('orderId', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const side = this.getNodeParameter('side', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const startAt = this.getNodeParameter('startAt', i) as number;
          const endAt = this.getNodeParameter('endAt', i) as number;

          const queryParams = new URLSearchParams();
          if (orderId) queryParams.append('orderId', orderId);
          if (symbol) queryParams.append('symbol', symbol);
          if (side) queryParams.append('side', side);
          if (type) queryParams.append('type', type);
          if (startAt) queryParams.append('startAt', startAt.toString());
          if (endAt) queryParams.append('endAt', endAt.toString());

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/v1/fills?${queryParams.toString()}`,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SECRET': credentials.apiSecret,
              'KC-API-PASSPHRASE': credentials.passphrase,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createStopOrder': {
          const clientOid = this.getNodeParameter('clientOid', i) as string;
          const side = this.getNodeParameter('side', i) as string;
          const symbol = this.getNodeParameter('symbol', i) as string;
          const type = this.getNodeParameter('type', i) as string;
          const stop = this.getNodeParameter('stop', i) as string;
          const stopPriceType = this.getNodeParameter('stopPriceType', i) as string;
          const size = this.getNodeParameter('size', i) as number;

          const body = {
            clientOid,
            side,
            symbol,
            type,
            stop,
            stopPriceType,
            size,
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/v1/stop-order`,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SECRET': credentials.apiSecret,
              'KC-API-PASSPHRASE': credentials.passphrase,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeDepositOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('kucoinexchangeApi') as any;
  
  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getDepositAddress': {
          const currency = this.getNodeParameter('currency', i) as string;
          const chain = this.getNodeParameter('chain', i) as string;
          
          const timestamp = Date.now().toString();
          let queryString = `currency=${currency}`;
          if (chain) {
            queryString += `&chain=${chain}`;
          }
          
          const endpoint = `/api/v1/deposit-addresses?${queryString}`;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}${endpoint}`,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': credentials.passphrase,
              'KC-API-SIGN': credentials.signature,
              'Content-Type': 'application/json'
            },
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'createDepositAddress': {
          const currency = this.getNodeParameter('currency', i) as string;
          const chain = this.getNodeParameter('chain', i) as string;
          
          const timestamp = Date.now().toString();
          const body: any = { currency };
          if (chain) {
            body.chain = chain;
          }
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/v1/deposit-addresses`,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': credentials.passphrase,
              'KC-API-SIGN': credentials.signature,
              'Content-Type': 'application/json'
            },
            body,
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getDeposits': {
          const currency = this.getNodeParameter('currency', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const startAt = this.getNodeParameter('startAt', i) as number;
          const endAt = this.getNodeParameter('endAt', i) as number;
          
          const timestamp = Date.now().toString();
          const queryParams: string[] = [];
          
          if (currency) queryParams.push(`currency=${currency}`);
          if (status) queryParams.push(`status=${status}`);
          if (startAt) queryParams.push(`startAt=${startAt}`);
          if (endAt) queryParams.push(`endAt=${endAt}`);
          
          const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
          const endpoint = `/api/v1/deposits${queryString}`;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}${endpoint}`,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': credentials.passphrase,
              'KC-API-SIGN': credentials.signature,
              'Content-Type': 'application/json'
            },
            json: true
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}

async function executeWithdrawalOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('kucoinexchangeApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const timestamp = Date.now().toString();
      
      switch (operation) {
        case 'createWithdrawal': {
          const currency = this.getNodeParameter('currency', i) as string;
          const address = this.getNodeParameter('address', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const memo = this.getNodeParameter('memo', i) as string;
          const isInner = this.getNodeParameter('isInner', i) as boolean;
          const remark = this.getNodeParameter('remark', i) as string;
          const chain = this.getNodeParameter('chain', i) as string;

          const body: any = {
            currency,
            address,
            amount,
          };
          if (memo) body.memo = memo;
          if (isInner) body.isInner = isInner;
          if (remark) body.remark = remark;
          if (chain) body.chain = chain;

          const bodyStr = JSON.stringify(body);
          const method = 'POST';
          const endpoint = '/api/v1/withdrawals';
          const signStr = timestamp + method + endpoint + bodyStr;
          const signature = createHmac('sha256', credentials.secretKey).update(signStr).digest('base64');

          const options: any = {
            method,
            url: credentials.baseUrl + endpoint,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': signature,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': Buffer.from(credentials.passphrase).toString('base64'),
              'Content-Type': 'application/json',
            },
            body: body,
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'cancelWithdrawal': {
          const withdrawalId = this.getNodeParameter('withdrawalId', i) as string;
          
          const method = 'DELETE';
          const endpoint = `/api/v1/withdrawals/${withdrawalId}`;
          const signStr = timestamp + method + endpoint;
          const signature = createHmac('sha256', credentials.secretKey).update(signStr).digest('base64');

          const options: any = {
            method,
            url: credentials.baseUrl + endpoint,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': signature,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': Buffer.from(credentials.passphrase).toString('base64'),
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getWithdrawals': {
          const currency = this.getNodeParameter('currency', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const startAt = this.getNodeParameter('startAt', i) as string;
          const endAt = this.getNodeParameter('endAt', i) as string;

          const queryParams = new URLSearchParams();
          if (currency) queryParams.append('currency', currency);
          if (status) queryParams.append('status', status);
          if (startAt) queryParams.append('startAt', new Date(startAt).getTime().toString());
          if (endAt) queryParams.append('endAt', new Date(endAt).getTime().toString());

          const method = 'GET';
          const endpoint = '/api/v1/withdrawals';
          const queryString = queryParams.toString();
          const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
          const signStr = timestamp + method + fullEndpoint;
          const signature = createHmac('sha256', credentials.secretKey).update(signStr).digest('base64');

          const options: any = {
            method,
            url: credentials.baseUrl + fullEndpoint,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': signature,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': Buffer.from(credentials.passphrase).toString('base64'),
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        case 'getWithdrawalQuotas': {
          const currency = this.getNodeParameter('currency', i) as string;
          const chain = this.getNodeParameter('chain', i) as string;

          const queryParams = new URLSearchParams();
          if (currency) queryParams.append('currency', currency);
          if (chain) queryParams.append('chain', chain);

          const method = 'GET';
          const endpoint = '/api/v1/withdrawals/quotas';
          const queryString = queryParams.toString();
          const fullEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
          const signStr = timestamp + method + fullEndpoint;
          const signature = createHmac('sha256', credentials.secretKey).update(signStr).digest('base64');

          const options: any = {
            method,
            url: credentials.baseUrl + fullEndpoint,
            headers: {
              'KC-API-KEY': credentials.apiKey,
              'KC-API-SIGN': signature,
              'KC-API-TIMESTAMP': timestamp,
              'KC-API-PASSPHRASE': Buffer.from(credentials.passphrase).toString('base64'),
            },
            json: true,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        default:
          throw new NodeOperationError(this.getNode(), 'Unknown operation: ' + operation);
      }
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }
  return returnData;
}
