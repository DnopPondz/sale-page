'use client';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const sp = useSearchParams();
  const status = sp.get('status');
  return (
    <div className="p-6">
      {status === 'ok'
        ? 'Email verified! You can login now.'
        : status === 'fail'
        ? 'Verification failed'
        : 'Ready to verify…'}
    </div>
  );
}
