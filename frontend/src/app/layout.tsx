import '../styles/globals.css';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';

export const metadata = {
  title: 'EVNT. | Premium Event Booking Platform',
  description: 'Book slots for premium technology, arts, music, and business events.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-[#FF6B00] selection:text-white pb-16 md:pb-0">
        <Navbar />
        <main className="flex-1 flex flex-col items-center w-full mt-20">
          {children}
        </main>
        <MobileNav />
      </body>
    </html>
  );
}
