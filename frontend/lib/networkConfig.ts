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



// Base Sepolia Testnet Configuration
export const baseSepolia = {
  id: 84532,
  name: 'Base Sepolia Testnet',
  iconUrl: 'https://avatars.githubusercontent.com/u/108554348?s=280&v=4',
  iconBackground: '#fff',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://sepolia.base.org'] },
    public: { http: ['https://sepolia.base.org'] },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://sepolia.basescan.org' },
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

// Export the chains for use in providers
export const chains = [polygonAmoy, baseSepolia] as const;

// Contract Addresses on Polygon Amoy
export const X402POLY_CONTRACT = '0xe5E43468bcBd09391bF73d0D43a624537c46bBa9' as const;
export const PAYMENT_TOKEN = '0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582' as const; // USDC on Amoy

