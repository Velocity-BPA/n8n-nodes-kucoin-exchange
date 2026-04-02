/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { KuCoinExchange } from '../nodes/KuCoin Exchange/KuCoin Exchange.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('KuCoinExchange Node', () => {
  let node: KuCoinExchange;

  beforeAll(() => {
    node = new KuCoinExchange();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('KuCoin Exchange');
      expect(node.description.name).toBe('kucoinexchange');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 9 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(9);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(9);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Account Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        secretKey: 'test-secret',
        passphrase: 'test-passphrase',
        baseUrl: 'https://api.kucoin.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn() }
    };
  });
  
  test('should get accounts successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAccounts');
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('BTC');
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('main');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ data: [{ id: 'account1' }] });
    
    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result).toHaveLength(1);
    expect(result[0].json.data).toEqual([{ id: 'account1' }]);
  });
  
  test('should get single account successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAccount');
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('account123');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ data: { id: 'account123' } });
    
    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result).toHaveLength(1);
    expect(result[0].json.data.id).toBe('account123');
  });
  
  test('should transfer funds successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('transferFunds');
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('client123');
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('from123');
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('to456');
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('100');
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('BTC');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ data: { orderId: 'transfer123' } });
    
    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result).toHaveLength(1);
    expect(result[0].json.data.orderId).toBe('transfer123');
  });
  
  test('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAccounts');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    
    const result = await executeAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
});

describe('TradingPair Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        apiSecret: 'test-secret',
        passphrase: 'test-passphrase',
        baseUrl: 'https://api.kucoin.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  it('should get trading pairs successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTradingPairs')
      .mockReturnValueOnce('BTC');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
      code: '200000',
      data: [{ symbol: 'BTC-USDT', name: 'BTC-USDT' }]
    });

    const result = await executeTradingPairOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.code).toBe('200000');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://api.kucoin.com/api/v1/symbols?market=BTC',
      })
    );
  });

  it('should get ticker successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTicker')
      .mockReturnValueOnce('BTC-USDT');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
      code: '200000',
      data: { sequence: '1545896669105', price: '5000.12' }
    });

    const result = await executeTradingPairOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.code).toBe('200000');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=BTC-USDT',
      })
    );
  });

  it('should get all tickers successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getAllTickers');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValueOnce({
      code: '200000',
      data: { time: 1602832092060, ticker: [] }
    });

    const result = await executeTradingPairOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.code).toBe('200000');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://api.kucoin.com/api/v1/market/allTickers',
      })
    );
  });

  it('should handle errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTicker')
      .mockReturnValueOnce('INVALID-SYMBOL');

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValueOnce(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValueOnce(true);

    const result = await executeTradingPairOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
});

describe('Order Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        secretKey: 'test-secret',
        passphrase: 'test-passphrase',
        baseUrl: 'https://api.kucoin.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should create order successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createOrder')
      .mockReturnValueOnce('buy')
      .mockReturnValueOnce('BTC-USDT')
      .mockReturnValueOnce('limit')
      .mockReturnValueOnce('1.5')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('50000');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      code: '200000',
      data: { orderId: '12345' }
    });

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({ code: '200000', data: { orderId: '12345' } });
  });

  it('should cancel order successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('cancelOrder')
      .mockReturnValueOnce('12345');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      code: '200000',
      data: { cancelledOrderIds: ['12345'] }
    });

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.data.cancelledOrderIds).toContain('12345');
  });

  it('should get orders successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getOrders')
      .mockReturnValueOnce('active')
      .mockReturnValueOnce('BTC-USDT')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      code: '200000',
      data: { items: [{ id: '12345', symbol: 'BTC-USDT' }] }
    });

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.data.items).toHaveLength(1);
  });

  it('should handle errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createOrder');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should get fills successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getFills')
      .mockReturnValueOnce('12345')
      .mockReturnValueOnce('BTC-USDT')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      code: '200000',
      data: { items: [{ tradeId: '54321', orderId: '12345' }] }
    });

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.data.items[0].orderId).toBe('12345');
  });

  it('should cancel all orders successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('cancelAllOrders')
      .mockReturnValueOnce('BTC-USDT')
      .mockReturnValueOnce('TRADE');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      code: '200000',
      data: { cancelledOrderIds: ['12345', '67890'] }
    });

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.data.cancelledOrderIds).toHaveLength(2);
  });
});

describe('MarginAccount Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        apiSecret: 'test-secret',
        passphrase: 'test-passphrase',
        baseUrl: 'https://api.kucoin.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  test('should get margin account info successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getMarginAccount');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      code: '200000',
      data: { totalAssetOfQuoteCurrency: '1000.00' },
    });

    const result = await executeMarginAccountOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.code).toBe('200000');
  });

  test('should borrow margin funds successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('borrowMargin')
      .mockReturnValueOnce('USDT')
      .mockReturnValueOnce('FOK')
      .mockReturnValueOnce('100');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      code: '200000',
      data: { orderId: 'test-order-id' },
    });

    const result = await executeMarginAccountOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.code).toBe('200000');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        body: { currency: 'USDT', type: 'FOK', size: '100' },
      }),
    );
  });

  test('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getMarginAccount');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeMarginAccountOperations.call(
      mockExecuteFunctions,
      [{ json: {} }],
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
});

describe('MarginOrder Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        secretKey: 'test-secret',
        passphrase: 'test-passphrase',
        baseUrl: 'https://api.kucoin.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  it('should create margin order successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createMarginOrder')
      .mockReturnValueOnce('test-client-oid')
      .mockReturnValueOnce('buy')
      .mockReturnValueOnce('BTC-USDT')
      .mockReturnValueOnce('limit')
      .mockReturnValueOnce('0.001')
      .mockReturnValueOnce('GTC')
      .mockReturnValueOnce('50000');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      code: '200000',
      data: { orderId: 'test-order-id' },
    });

    const result = await executeMarginOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.data.orderId).toBe('test-order-id');
  });

  it('should get margin orders successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getMarginOrders')
      .mockReturnValueOnce('BTC-USDT')
      .mockReturnValueOnce('buy')
      .mockReturnValueOnce('limit')
      .mockReturnValueOnce(1640995200000)
      .mockReturnValueOnce(1640995260000);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      code: '200000',
      data: { items: [{ id: 'order1' }, { id: 'order2' }] },
    });

    const result = await executeMarginOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.data.items).toHaveLength(2);
  });

  it('should cancel margin order successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('cancelMarginOrder')
      .mockReturnValueOnce('test-order-id');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      code: '200000',
      data: { cancelledOrderIds: ['test-order-id'] },
    });

    const result = await executeMarginOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.data.cancelledOrderIds).toContain('test-order-id');
  });

  it('should get margin fills successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getMarginFills')
      .mockReturnValueOnce('BTC-USDT')
      .mockReturnValueOnce('test-order-id')
      .mockReturnValueOnce('buy')
      .mockReturnValueOnce('limit');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      code: '200000',
      data: { items: [{ tradeId: 'trade1' }, { tradeId: 'trade2' }] },
    });

    const result = await executeMarginOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.data.items).toHaveLength(2);
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createMarginOrder');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeMarginOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    await expect(
      executeMarginOrderOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('FuturesAccount Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.kucoin.com',
        signature: 'test-signature',
        passphrase: 'test-passphrase'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  test('getFuturesAccount should return account overview', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getFuturesAccount');
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('USDT');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ code: '200000', data: {} });

    const result = await executeFuturesAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://api.kucoin.com/api/v1/account-overview?currency=USDT'
      })
    );
  });

  test('getPositions should return position details', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getPositions');
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('XBTUSDTM');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ code: '200000', data: [] });

    const result = await executeFuturesAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://api.kucoin.com/api/v1/position?symbol=XBTUSDTM'
      })
    );
  });

  test('addMargin should add margin to position', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('addMargin');
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('XBTUSDTM');
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('100');
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('12345');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ code: '200000', data: {} });

    const result = await executeFuturesAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: 'https://api.kucoin.com/api/v1/position/margin/deposit-margin',
        body: { symbol: 'XBTUSDTM', margin: '100', bizNo: '12345' }
      })
    );
  });

  test('getFundingHistory should return funding history', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getFundingHistory');
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('XBTUSDTM');
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce(1640995200000);
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce(1640995260000);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ code: '200000', data: [] });

    const result = await executeFuturesAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: 'https://api.kucoin.com/api/v1/funding-history?symbol=XBTUSDTM&startAt=1640995200000&endAt=1640995260000'
      })
    );
  });

  test('should handle errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getFuturesAccount');
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeFuturesAccountOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
});

describe('FuturesOrder Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        apiSecret: 'test-api-secret',
        passphrase: 'test-passphrase',
        baseUrl: 'https://api.kucoin.com'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  it('should create futures order successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'createFuturesOrder',
        clientOid: 'test-order-123',
        side: 'buy',
        symbol: 'XBTUSDM',
        type: 'limit',
        lever: 10,
        size: 100,
        price: 50000
      };
      return params[param];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      code: '200000',
      data: { orderId: 'order-123' }
    });

    const items = [{ json: {} }];
    const result = await executeFuturesOrderOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual({
      code: '200000',
      data: { orderId: 'order-123' }
    });
  });

  it('should cancel futures order successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'cancelFuturesOrder',
        orderId: 'order-123'
      };
      return params[param];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      code: '200000',
      data: { cancelledOrderIds: ['order-123'] }
    });

    const items = [{ json: {} }];
    const result = await executeFuturesOrderOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.data.cancelledOrderIds).toContain('order-123');
  });

  it('should get futures orders successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      const params: any = {
        operation: 'getFuturesOrders',
        status: 'active',
        symbol: 'XBTUSDM'
      };
      return params[param];
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      code: '200000',
      data: { items: [{ id: 'order-123', symbol: 'XBTUSDM' }] }
    });

    const items = [{ json: {} }];
    const result = await executeFuturesOrderOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.data.items).toHaveLength(1);
  });

  it('should handle errors when continuing on fail', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('createFuturesOrder');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const items = [{ json: {} }];
    const result = await executeFuturesOrderOperations.call(mockExecuteFunctions, items);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('API Error');
  });
});

describe('Deposit Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.kucoin.com',
        passphrase: 'test-passphrase',
        signature: 'test-signature'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });
  
  it('should get deposit address successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getDepositAddress';
      if (param === 'currency') return 'BTC';
      if (param === 'chain') return '';
      return null;
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      code: '200000',
      data: { address: 'bc1qtest123', currency: 'BTC' }
    });
    
    const items = [{ json: {} }];
    const result = await executeDepositOperations.call(mockExecuteFunctions, items);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.code).toBe('200000');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/api/v1/deposit-addresses')
      })
    );
  });
  
  it('should create deposit address successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'createDepositAddress';
      if (param === 'currency') return 'ETH';
      if (param === 'chain') return 'eth';
      return null;
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      code: '200000',
      data: { address: '0xtest123', currency: 'ETH', chain: 'eth' }
    });
    
    const items = [{ json: {} }];
    const result = await executeDepositOperations.call(mockExecuteFunctions, items);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.code).toBe('200000');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        url: expect.stringContaining('/api/v1/deposit-addresses')
      })
    );
  });
  
  it('should get deposits successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getDeposits';
      if (param === 'currency') return 'BTC';
      if (param === 'status') return 'SUCCESS';
      if (param === 'startAt') return 1640995200000;
      if (param === 'endAt') return 1641081600000;
      return null;
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      code: '200000',
      data: {
        currentPage: 1,
        pageSize: 50,
        totalNum: 1,
        totalPage: 1,
        items: [{ currency: 'BTC', status: 'SUCCESS', amount: '0.001' }]
      }
    });
    
    const items = [{ json: {} }];
    const result = await executeDepositOperations.call(mockExecuteFunctions, items);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.code).toBe('200000');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: expect.stringContaining('/api/v1/deposits')
      })
    );
  });
  
  it('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getDepositAddress';
      if (param === 'currency') return 'INVALID';
      return null;
    });
    
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid currency'));
    
    const items = [{ json: {} }];
    await expect(executeDepositOperations.call(mockExecuteFunctions, items)).rejects.toThrow('Invalid currency');
  });
  
  it('should continue on fail when enabled', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      if (param === 'operation') return 'getDepositAddress';
      if (param === 'currency') return 'INVALID';
      return null;
    });
    
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid currency'));
    
    const items = [{ json: {} }];
    const result = await executeDepositOperations.call(mockExecuteFunctions, items);
    
    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Invalid currency');
  });
});

describe('Withdrawal Resource', () => {
  let mockExecuteFunctions: any;
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        secretKey: 'test-secret',
        passphrase: 'test-passphrase',
        baseUrl: 'https://api.kucoin.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });

  it('should create withdrawal successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createWithdrawal')
      .mockReturnValueOnce('BTC')
      .mockReturnValueOnce('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')
      .mockReturnValueOnce('0.1')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ withdrawalId: '12345' });
    
    const result = await executeWithdrawalOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result[0].json).toEqual({ withdrawalId: '12345' });
  });

  it('should handle withdrawal creation error', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createWithdrawal')
      .mockReturnValueOnce('BTC')
      .mockReturnValueOnce('invalid-address')
      .mockReturnValueOnce('0.1')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(false)
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');
    
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid address'));
    
    await expect(executeWithdrawalOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Invalid address');
  });

  it('should cancel withdrawal successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('cancelWithdrawal')
      .mockReturnValueOnce('12345');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ success: true });
    
    const result = await executeWithdrawalOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result[0].json).toEqual({ success: true });
  });

  it('should get withdrawals successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getWithdrawals')
      .mockReturnValueOnce('BTC')
      .mockReturnValueOnce('SUCCESS')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ items: [] });
    
    const result = await executeWithdrawalOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result[0].json).toEqual({ items: [] });
  });

  it('should get withdrawal quotas successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getWithdrawalQuotas')
      .mockReturnValueOnce('BTC')
      .mockReturnValueOnce('');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ quotas: { daily: '1.0' } });
    
    const result = await executeWithdrawalOperations.call(mockExecuteFunctions, [{ json: {} }]);
    expect(result[0].json).toEqual({ quotas: { daily: '1.0' } });
  });
});
});
