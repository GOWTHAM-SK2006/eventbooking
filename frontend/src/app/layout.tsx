import '../styles/globals.css';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import { PageTransition } from '../components/PageTransition';

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
        <Navbar />
        <main className="flex-1 flex flex-col items-center w-full mt-20">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <MobileNav />
      </body>
    </html>
  );
}
