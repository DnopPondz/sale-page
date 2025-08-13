import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <aside className="w-48 p-4 space-y-2 bg-gray-50 shadow">
          <Link href="/">Dashboard</Link>
          <Link href="/products">Products</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/statements">Statements</Link>
        </aside>
        <main className="flex-1 p-4">{children}</main>
      </body>
    </html>
  );
}
