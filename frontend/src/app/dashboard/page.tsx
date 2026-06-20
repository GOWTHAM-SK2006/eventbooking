'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LegacyDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
