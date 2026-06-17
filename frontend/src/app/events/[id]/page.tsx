import EventDetailsClient from '../../../components/EventDetailsClient';

export function generateStaticParams() {
  return [{ id: 'fallback' }];
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <EventDetailsClient id={resolvedParams.id} />;
}
