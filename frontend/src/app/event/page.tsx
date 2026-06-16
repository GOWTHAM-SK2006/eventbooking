'use client';

import { useSearchParams } from 'next/navigation';
import EventDetailsClient from '../../components/EventDetailsClient';
import { Suspense } from 'react';

function EventPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  if (!id) {
    return <div style={{ padding: '5rem', textAlign: 'center', color: '#A3A3A3' }}><h2>Invalid Event ID</h2></div>;
  }

  return <EventDetailsClient id={id} />;
}

export default function EventPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EventPageContent />
    </Suspense>
  );
}
