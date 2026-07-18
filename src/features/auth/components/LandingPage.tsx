import { OAuthButtons } from './OAuthButtons';
import { GuestButton } from './GuestButton';
import { WalletConnect } from './WalletConnect';

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg-secondary px-4">
      <div className="w-full max-w-md space-y-10">
        {/* Branding */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-text-primary">
            WCIA 2.0
          </h1>
          <p className="mt-3 text-text-secondary text-sm">
            AI‑powered football intelligence platform.
            <br />
            Understand every moment of the game.
          </p>
        </div>

        {/* Auth options */}
        <div className="space-y-4">
          <OAuthButtons />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-bg-secondary px-2 text-text-tertiary">or</span>
            </div>
          </div>
          <GuestButton />
          <div className="pt-2">
            <WalletConnect />
          </div>
        </div>

        <p className="text-xs text-center text-text-tertiary">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}