import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import AiAssistant from '@/components/AiAssistant';

export const metadata = {
  title: 'WorkLink — Code Craft 3.0 | Cooperative-Powered Local Services Marketplace',
  description: 'Code Craft 3.0 platform connecting households with verified labour cooperative workers.',
  openGraph: {
    title: 'WorkLink — Code Craft 3.0',
    description: 'Code Craft 3.0 platform connecting households with verified labour cooperative workers.',
    siteName: 'WorkLink',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light theme-light" data-theme="light">
      <body className="flex flex-col min-h-screen">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
            <AiAssistant />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
