import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { polygonAmoy } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'Counter DApp',
  projectId: 'YOUR_PROJECT_ID', // Get one at https://cloud.walletconnect.com
  chains: [polygonAmoy],
  ssr: true, // If your dApp uses server side rendering (SSR)
})