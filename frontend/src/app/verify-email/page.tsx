'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { api } from '../../utils/api';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) { setStatus('error'); setMessage('Invalid verification link'); return; }
    api.get('/auth/verify-email', { params: { token } })
      .then((res: any) => { setStatus('success'); setMessage(res.message); })
      .catch((err: any) => { setStatus('error'); setMessage(err.message); });
  }, [token]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-10 text-center">
      {status === 'loading' && <p className="text-[#6B7280]">Verifying your email...</p>}
      {status === 'success' && (
        <>
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black mb-2">Email Verified!</h1>
          <p className="text-[#6B7280] mb-6">{message}</p>
          <Link href="/login" className="btn-primary inline-block py-3 px-8">Go to Login</Link>
        </>
      )}
      {status === 'error' && (
        <>
          <XCircle size={64} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black mb-2">Verification Failed</h1>
          <p className="text-[#6B7280]">{message}</p>
        </>
      )}
    </motion.div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-md mx-auto px-4 py-16">
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <VerifyContent />
      </Suspense>
    </div>
  );
}
