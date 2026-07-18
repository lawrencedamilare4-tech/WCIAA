
// src/services/payment/cctp-service.ts
import { getSigningClient, getAddress, getWalletType } from '@/features/wallet/wallet-service';
import { coin } from '@cosmjs/stargate';

const RECIPIENT = import.meta.env.VITE_RECIPIENT_ADDRESS; 
const USDC_DENOM = import.meta.env.VITE_USDC_DENOM || 
  'ibc/2CBC2EA121AE42563B08028466F37B600F2D7D4282342DE938283CC3FB2BC00E';
/**
 * Execute a CCTP‑enabled payment.
 * Currently this transfers USDC directly on Injective (which could have been bridged via CCTP).
 *
 * Full CCTP flow would be:
 * 1. Connect Ethereum wallet (MetaMask) – not yet implemented.
 * 2. Call Circle CCTP bridge contract to burn USDC on Ethereum, specifying destination Injective address.
 * 3. Wait for attestation and automatic USDC mint on Injective.
 * 4. Then call this function to transfer the USDC to the recipient.
 *
 * For now, this uses the existing Keplr wallet to send USDC that the user already holds on Injective.
 */
export async function makeCCTPPayment(
  amount: string,
  denom: string = USDC_DENOM,
  recipient: string = RECIPIENT
): Promise<string> {
  // Ensure the wallet is a Cosmos wallet (Keplr) – MetaMask can't sign Cosmos txs yet
  const walletType = getWalletType();
  if (walletType !== 'keplr') {
    throw new Error(
      'USDC payments via Keplr are required. Please connect Keplr and ensure you have USDC on Injective.'
    );
  }

  const client = getSigningClient();
  const sender = getAddress();

  // Send the tokens (USDC) – this is identical to the INJ transfer but with the USDC denom
  const result = await client.sendTokens(
    sender,
    recipient,
    [coin(amount, denom)],
    'auto',
    'WCIA 2.0 Premium Report (USDC)'
  );

  return result.transactionHash;
}

/**
 * (Optional) Helper to check if the user has enough USDC on Injective.
 */
export async function getUSDCBalance(address: string): Promise<string> {
  const client = getSigningClient();
  const balance = await client.getBalance(address, USDC_DENOM);
  return balance.amount;
}

export function bridgeUsdcCCTP(amount: number) {
  return {
    success: true,
    bridgedAmount: amount,
  };
}
