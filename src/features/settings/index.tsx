import { ProfileSection } from './components/ProfileSection';
import { PreferencesSection } from './components/PreferencesSection';
import { WalletSection } from './components/WalletSection';
import { motion } from 'framer-motion';
import { slideUp } from '../../shared/utils/animations';
import { DangerZone } from './components/Dangerzone';
import { NotificationPreferences } from './components/Notificationpreferences';

export default function SettingsPage() {
  return (
    <motion.div
      className="max-w-2xl mx-auto space-y-8 p-4 md:p-6"
      variants={slideUp}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-2xl font-bold">Settings</h1>
      <ProfileSection />
      <PreferencesSection />
      <NotificationPreferences />
      <WalletSection />
      <DangerZone />
    </motion.div>
  );
}