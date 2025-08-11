import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import './admin.css'; // สไตล์เล็กๆ (จะเพิ่มทีหลัง)

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') redirect('/');

  return (
    <div className="admin-grid">
      <aside className="admin-aside">
        <div className="admin-brand">Admin</div>
        <nav className="admin-nav">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/users">Users</Link>
        </nav>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
