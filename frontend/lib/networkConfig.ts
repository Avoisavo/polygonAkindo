/**
 * Network Configuration for Polygon Amoy Testnet
 * 
 * Polygon Amoy is the new testnet for Polygon PoS
 * (replacing the deprecated Mumbai testnet)
 */

import type { Chain } from '@rainbow-me/rainbowkit';

// Polygon Amoy Testnet Configuration
export const polygonAmoy = {
  id: 80002,
  name: 'Polygon Amoy Testnet',
  iconUrl: 'https://cryptologos.cc/logos/polygon-matic-logo.svg',
  iconBackground: '#fff',
  nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-amoy.polygon.technology/'] },
    public: { http: ['https://rpc-amoy.polygon.technology/'] },
  },
  blockExplorers: {
    default: { name: 'PolygonScan', url: 'https://amoy.polygonscan.com' },
  },
  testnet: true,
} as const satisfies Chain;

// Network information
export const getNetworkInfo = () => {
  return {
    networkType: 'testnet' as const,
    chainId: polygonAmoy.id,
    name: polygonAmoy.name,
    rpcUrl: polygonAmoy.rpcUrls.default.http[0],
    blockExplorer: polygonAmoy.blockExplorers?.default.url || '',
    isMainnet: false,
    isTestnet: true,
    nativeCurrency: polygonAmoy.nativeCurrency,
  };
};

// Export the chain for use in providers
export const chains = [polygonAmoy] as const;

// Contract Addresses on Polygon Amoy
export const X402POLY_CONTRACT = '0xe5E43468bcBd09391bF73d0D43a624537c46bBa9' as const;
export const PAYMENT_TOKEN = '0x41E94EB019c0762f9cBFCFeE217e8e5252C3fE89' as const; // USDC on Amoy

