/**
 * @fileoverview Auth Context Provider
 * @description Manages authentication state using blockchain data only
 */

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useUserProfile } from '@/lib/hooks/useProfileContract';

interface AuthContextValue {
  address: string | null;
  isConnected: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  userProfile: any;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { account, connected } = useWallet();
  const walletAddress = account?.address?.toString();

  // Fetch user profile from blockchain
  const { data: userProfile, isLoading } = useUserProfile(walletAddress);

  const value: AuthContextValue = {
    address: walletAddress || null,
    isConnected: connected,
    isLoading,
    // User is authenticated if wallet is connected AND profile exists on blockchain
    isAuthenticated: connected && !!userProfile,
    userProfile: userProfile || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
