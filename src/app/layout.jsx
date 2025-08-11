import Providers from '@/components/session-provider';
import './globals.css';

export const metadata = { title: 'Sale Page' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}