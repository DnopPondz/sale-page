import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <nav className="flex gap-4 p-4 shadow bg-white">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/account">Account</Link>
        </nav>
        <main className="flex-1 p-4">{children}</main>
        <footer className="p-4 text-center text-sm text-gray-500">Minimal Shop</footer>
      </body>
    </html>
  );
}
