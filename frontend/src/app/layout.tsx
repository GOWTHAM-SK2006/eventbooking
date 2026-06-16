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
    <html lang="en">
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          {children}
        </main>
        <MobileNav />
      </body>
    </html>
  );
}
