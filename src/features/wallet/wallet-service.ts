// src/features/wallet/services/wallet-service.ts
import { SigningStargateClient } from '@cosmjs/stargate';

const CHAIN_ID = 'injective-1';
const RPC_URL = 'https://injective-rpc.publicnode.com';

let signingClient: SigningStargateClient | null = null;
let currentAddress: string | null = null;

/**
 * Connect to Keplr and return the Injective address.
 */
export async function connectWallet(): Promise<string> {
  if (!window.keplr) {
    throw new Error('Keplr extension not installed. Please install Keplr to continue.');
  }

  // Enable the chain (prompts the user to approve)
  await window.keplr.enable(CHAIN_ID);

  // Get offline signer
  const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID);
  const accounts = await offlineSigner.getAccounts();
  if (accounts.length === 0) throw new Error('No Keplr accounts found. Please create or unlock an account.');

  currentAddress = accounts[0].address;

  // Create a signing client for broadcasting transactions
  signingClient = await SigningStargateClient.connectWithSigner(RPC_URL, offlineSigner);

  return currentAddress;
}

/**
 * Disconnect (reset local state).
 */
export async function disconnectWallet(): Promise<void> {
  signingClient?.disconnect();
  signingClient = null;
  currentAddress = null;
}

/**
 * Get the currently connected address (null if not connected).
 */
export async function getWalletAddress(): Promise<string | null> {
  return currentAddress;
}

/**
 * Return the signing client for token transfers.
 */
export function getSigningClient(): SigningStargateClient {
  if (!signingClient) throw new Error('Wallet not connected. Please connect Keplr first.');
  return signingClient;
}

/**
 * Return the current Injective address.
 */
export function getAddress(): string {
  if (!currentAddress) throw new Error('Wallet not connected. Please connect Keplr first.');
  return currentAddress;
}