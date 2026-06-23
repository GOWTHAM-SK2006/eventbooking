import '../styles/globals.css';
import ClientLayoutWrapper from '../components/ClientLayoutWrapper';
import QueryProvider from '../providers/QueryProvider';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

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
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white text-[#111827] flex flex-col font-sans selection:bg-[#FFD400] selection:text-[#111827] pb-16 md:pb-0">
        <QueryProvider>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </QueryProvider>
      </body>
    </html>
  );
}
