import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class KuCoinExchangeApi implements ICredentialType {
	name = 'kuCoinExchangeApi';
	displayName = 'KuCoin Exchange API';
	documentationUrl = 'https://docs.kucoin.com/#authentication';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'API Secret',
			name: 'apiSecret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'API Passphrase',
			name: 'apiPassphrase',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
		{
			displayName: 'API Base URL',
			name: 'apiUrl',
			type: 'string',
			default: 'https://api.kucoin.com',
			description: 'Base URL for KuCoin API',
		},
		{
			displayName: 'Sandbox Mode',
			name: 'sandbox',
			type: 'boolean',
			default: false,
			description: 'Whether to use sandbox environment for testing',
		},
	];
}