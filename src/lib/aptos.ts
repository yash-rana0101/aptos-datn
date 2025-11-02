/**
 * @fileoverview Aptos Client Configuration
 * @description Singleton Aptos client for blockchain interactions
 */

import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { NETWORK, APTOS_API_KEY } from "@/constants";

// Configure Aptos client
const config = new AptosConfig({
  network: NETWORK,
  ...(APTOS_API_KEY && { clientConfig: { API_KEY: APTOS_API_KEY } }),
});

// Export singleton instance
export const aptos = new Aptos(config);

// Helper to generate account address from string
export const getAccountAddress = (address: string) => {
  return address;
};

// Helper to check if address is valid
export const isValidAddress = (address: string): boolean => {
  try {
    return /^0x[a-fA-F0-9]{1,64}$/.test(address);
  } catch {
    return false;
  }
};
