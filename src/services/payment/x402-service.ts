// src/services/payment/x402-service.ts
import { getSigningClient, getAddress } from '@/features/wallet/wallet-service';
import { coin } from '@cosmjs/stargate';

const RECIPIENT = import.meta.env.VITE_RECIPIENT_ADDRESS;

export async function makeX402Payment(
  amount: string,
  denom = 'inj',
  recipient = RECIPIENT
): Promise<string> {
  const client = getSigningClient();
  const sender = getAddress();

  const result = await client.sendTokens(
    sender,
    recipient,
    [coin(amount, denom)],
    'auto',
    'WCIA 2.0 Premium Report'
  );

  return result.transactionHash;
}