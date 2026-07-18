import { ReactNode } from "react";

interface PremiumGuardProps {
  children: ReactNode;
}

export default function PremiumGuard({ children }: PremiumGuardProps) {
  return <>{children}</>;
}
