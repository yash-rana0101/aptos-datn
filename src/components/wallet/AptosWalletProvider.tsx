/**
 * @fileoverview Aptos Wallet Provider
 * @description Configures and provides Aptos wallet adapter context
 */

'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { NETWORK } from '@/constants';

interface AptosWalletProviderProps {
  children: ReactNode;
}

export function AptosWalletProvider({ children }: AptosWalletProviderProps) {
  const [mounted, setMounted] = useState(false);

  // Ensure component only renders on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // For local network, use string "mainnet" - the wallet adapter accepts string literals
  // The actual contract calls will use localhost:8080 from aptos.ts configuration
  const walletNetwork = NETWORK === 'local' ? 'mainnet' : NETWORK;

  // Don't render wallet provider until mounted (client-side only)
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <AptosWalletAdapterProvider
      autoConnect={false}
      dappConfig={{
        network: walletNetwork as any,
        aptosConnectDappId: 'datn-ecommerce',
      }}
      onError={(error) => {
        // Suppress origin errors from wallet extensions
        if (error?.message?.includes('origin') || error?.message?.includes('location')) {
          console.warn('Wallet initialization warning (safe to ignore):', error.message);
        } else {
          console.error('Wallet adapter error:', error);
        }
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}

export default AptosWalletProvider;
