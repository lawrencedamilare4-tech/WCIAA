import { Button } from '../../../shared/components/ui/button';
import { useGuestSession } from '../hooks/useGuestSession';

export function GuestButton() {
  const { signInGuest } = useGuestSession();

  return (
    <Button variant="secondary" size="lg" className="w-full" onClick={signInGuest}>
      Continue as Guest
    </Button>
  );
}