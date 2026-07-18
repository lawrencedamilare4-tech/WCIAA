import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletUserProvider } from '@/features/auth/components/WalletUserProvider';
import { ThemeProvider } from '@/shared/design-system/theme-provider';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletUserProvider>
        <ThemeProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'bg-bg-primary text-text-primary border border-border-primary',
            }}
          />
        </ThemeProvider>
      </WalletUserProvider>
    </QueryClientProvider>
  );
}