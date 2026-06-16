import EventDetailsClient from '../../../components/EventDetailsClient';

export function generateStaticParams() {
  // Return placeholder static path so the output export completes successfully
  return [{ id: 'placeholder' }];
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <EventDetailsClient id={resolvedParams.id} />;
}
