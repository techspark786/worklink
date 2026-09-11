import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import AiAssistant from '@/components/AiAssistant';

export const metadata = {
  title: 'SHRAMSETU — Cooperative-Powered Local Services Marketplace',
  description: 'Smart India Hackathon 2026 platform connecting households with verified labour cooperative workers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <AiAssistant />
        </AuthProvider>
      </body>
    </html>
  );
}
