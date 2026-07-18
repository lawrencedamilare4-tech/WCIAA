// src/types/keplr.d.ts
import type { Window as KeplrWindow } from '@keplr-wallet/types';

declare global {
  interface Window extends KeplrWindow {}
}