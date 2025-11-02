/**
 * @fileoverview User Profile Smart Contract Service
 * @description Functions to interact with user_profile module
 */

import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { MODULES } from "@/constants";
import { aptos } from "@/lib/aptos";
import type { 
  UserProfile, 
  RegisterProfileParams, 
  UpdateProfileParams 
} from "@/lib/types/contracts";

// ============= Entry Functions (Write Operations) =============

/**
 * Register a new user profile
 */
export const registerProfile = (
  params: RegisterProfileParams
): InputTransactionData => {
  const { name, country, role, email, address, bio } = params;
  
  return {
    data: {
      function: `${MODULES.USER_PROFILE}::register_profile`,
      functionArguments: [name, country, role, email, address, bio],
    },
  };
};

/**
 * Update user profile
 */
export const updateProfile = (
  params: UpdateProfileParams
): InputTransactionData => {
  const { profileAddress, name, country, email, address, bio } = params;
  
  return {
    data: {
      function: `${MODULES.USER_PROFILE}::update_profile`,
      functionArguments: [
        profileAddress,
        name || "",
        country || "",
        email || "",
        address || "",
        bio || "",
      ],
    },
  };
};

/**
 * Deactivate user profile
 */
export const deactivateProfile = (
  profileAddress: string
): InputTransactionData => {
  return {
    data: {
      function: `${MODULES.USER_PROFILE}::deactivate_profile`,
      functionArguments: [profileAddress],
    },
  };
};

/**
 * Reactivate user profile
 */
export const reactivateProfile = (
  profileAddress: string
): InputTransactionData => {
  return {
    data: {
      function: `${MODULES.USER_PROFILE}::reactivate_profile`,
      functionArguments: [profileAddress],
    },
  };
};

// ============= View Functions (Read Operations) =============

/**
 * Get user profile
 */
export const getUserProfile = async (
  address: string
): Promise<UserProfile | null> => {
  try {
    const result = await aptos.view({
      payload: {
        function: `${MODULES.USER_PROFILE}::get_profile` as `${string}::${string}::${string}`,
        functionArguments: [address],
      },
    });
    
    if (!result || result.length === 0) {
      return null;
    }

    // Parse the result based on Move struct
    const [
      name,
      walletAddress,
      country,
      role,
      email,
      physicalAddress,
      bio,
      createdAt,
      updatedAt,
      isActive,
    ] = result as [string, string, string, number, string, string, string, string, string, boolean];

    return {
      name,
      walletAddress,
      country,
      role,
      email,
      physicalAddress,
      bio,
      createdAt: parseInt(createdAt),
      updatedAt: parseInt(updatedAt),
      isActive,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

/**
 * Check if user is a buyer
 */
export const isBuyer = async (address: string): Promise<boolean> => {
  try {
    const result = await aptos.view({
      payload: {
        function: `${MODULES.USER_PROFILE}::is_buyer` as `${string}::${string}::${string}`,
        functionArguments: [address],
      },
    });
    return result[0] as boolean;
  } catch (error) {
    console.error("Error checking if user is buyer:", error);
    return false;
  }
};

/**
 * Check if user is a seller
 */
export const isSeller = async (address: string): Promise<boolean> => {
  try {
    const result = await aptos.view({
      payload: {
        function: `${MODULES.USER_PROFILE}::is_seller` as `${string}::${string}::${string}`,
        functionArguments: [address],
      },
    });
    return result[0] as boolean;
  } catch (error) {
    console.error("Error checking if user is seller:", error);
    return false;
  }
};

/**
 * Check if profile is active
 */
export const isProfileActive = async (address: string): Promise<boolean> => {
  try {
    const result = await aptos.view({
      payload: {
        function: `${MODULES.USER_PROFILE}::is_profile_active` as `${string}::${string}::${string}`,
        functionArguments: [address],
      },
    });
    return result[0] as boolean;
  } catch (error) {
    console.error("Error checking if profile is active:", error);
    return false;
  }
};

/**
 * Get user details (name, email, country)
 */
export const getUserDetails = async (
  address: string
): Promise<{ name: string; email: string; country: string } | null> => {
  try {
    const result = await aptos.view({
      payload: {
        function: `${MODULES.USER_PROFILE}::get_user_details` as `${string}::${string}::${string}`,
        functionArguments: [address],
      },
    });
    
    const [name, email, country] = result as [string, string, string];
    
    return {
      name,
      email,
      country,
    };
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};
