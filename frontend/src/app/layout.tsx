import '../styles/globals.css';
import ClientLayoutWrapper from '../components/ClientLayoutWrapper';
import QueryProvider from '../providers/QueryProvider';

export const metadata = {
  title: 'EventBooking | Modern Event Booking Platform',
  description: 'Discover and book premium events. Modern, trusted, professional event management.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAFAFA] text-[#111827] flex flex-col font-sans selection:bg-[#FACC15] selection:text-[#111827] pb-16 md:pb-0">
        <QueryProvider>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </QueryProvider>
      </body>
    </html>
  );
}
