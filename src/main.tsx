import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Buffer } from 'buffer'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'

import App from './App.tsx'
import { config } from './wagmi.ts'

import './styles/indx.scss'
import Web3Context from './context/web3Context.tsx'

globalThis.Buffer = Buffer

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Web3Context>
          <App />
        </Web3Context>
      </QueryClientProvider>
    </WagmiProvider>,
  // </React.StrictMode>,
)
