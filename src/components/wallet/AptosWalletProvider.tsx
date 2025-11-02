/**
 * @fileoverview Aptos Wallet Provider
 * @description Configures and provides Aptos wallet adapter context
 */

'use client';

import React, { ReactNode } from 'react';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { NETWORK } from '@/constants';

interface AptosWalletProviderProps {
  children: ReactNode;
}

export function AptosWalletProvider({ children }: AptosWalletProviderProps) {
  // For local network, use string "mainnet" - the wallet adapter accepts string literals
  // The actual contract calls will use localhost:8080 from aptos.ts configuration
  const walletNetwork = NETWORK === 'local' ? 'mainnet' : NETWORK;

  return (
    <AptosWalletAdapterProvider
      autoConnect={true}
      dappConfig={{
        network: walletNetwork as any, // Use as any to bypass type issues
      }}
      onError={(error) => {
        console.error('Wallet adapter error:', error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}

export default AptosWalletProvider;
