'use client';

import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4"
    >
      <Settings className="w-16 h-16 text-[var(--color-primary)] opacity-50" />
      <h1 className="text-3xl font-bold text-[var(--color-primary)]">
        Ayarlar
      </h1>
      <p className="text-[var(--color-fg)] max-w-md">
        Bu bölümde henüz ekleyebileceğimiz bir özellik bulamadık. İlerleyen sürümlerde buraya yeni özellikler ekleyebiliriz.
      </p>
    </motion.div>
  );
} 