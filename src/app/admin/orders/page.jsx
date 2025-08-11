'use client';
import { useEffect, useState } from 'react';

const tabs = [
  { key:'', label:'All' },
  { key:'AWAITING_CONFIRMATION', label:'Awaiting Confirmation' },
  { key:'ACCEPTED', label:'Accepted' },
  { key:'SHIPPED', label:'Shipped' },
  { key:'COMPLETED', label:'Completed' },
  { key:'CANCELLED', label:'Cancelled' },
];

export default function AdminOrdersPage() {
  const [status, setStatus] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const url = new URL('/api/admin/orders', window.location.origin);
    if (status) url.searchParams.set('status', status);
    const res = await fetch(url);
    const data = await res.json();
    setRows(data);
    setLoading(false);
  };

  useEffect(()=>{ load(); /* eslint-disable-next-line */ }, [status]);

  const act = async (id, action, extra) => {
    const res = await fetch(`/api/admin/orders/${id}/${action}`, {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: extra ? JSON.stringify(extra) : undefined
    });
    if (res.ok) load();
  };

  const approve = async (o) => {
    if (!o.payment) return;
    await fetch(`/api/admin/orders/${o.id}/payments/${o.payment.id}/approve`, { method:'POST' });
    load();
  };
  const reject = async (o) => {
    const reason = prompt('Reject reason?') || '';
    if (!o.payment) return;
    await fetch(`/api/admin/orders/${o.id}/payments/${o.payment.id}/reject`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ reason })
    });
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Orders</h1>
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t=>(
          <button key={t.key} onClick={()=>setStatus(t.key)}
            className={`px-3 py-1 rounded border ${status===t.key?'bg-black text-white':''}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? <div>Loading...</div> : (
        <div className="overflow-auto border rounded">
          <table className="min-w-[800px] w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-2">Order</th>
                <th className="p-2">User</th>
                <th className="p-2">Total</th>
                <th className="p-2">Method</th>
                <th className="p-2">Pay.Status</th>
                <th className="p-2">Status</th>
                <th className="p-2">Slip</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(o=>(
                <tr key={o.id} className="border-t">
                  <td className="p-2 text-xs">{o.id.slice(-8)}</td>
                  <td className="p-2 text-xs">{o.user?.firstName} {o.user?.lastName}<br/>{o.user?.email}</td>
                  <td className="p-2">{Number(o.grandTotal).toFixed(2)}</td>
                  <td className="p-2">{o.paymentMethod}</td>
                  <td className="p-2">{o.paymentStatus}</td>
                  <td className="p-2">{o.status}</td>
                  <td className="p-2">
                    {o.payment?.slipUrl
                      ? <a className="underline" href={o.payment.slipUrl} target="_blank">View</a>
                      : '-'}
                  </td>
                  <td className="p-2 space-x-1">
                    {o.status==='AWAITING_CONFIRMATION' && o.payment?.id && (
                      <>
                        <button onClick={()=>approve(o)} className="px-2 py-1 rounded bg-emerald-600 text-white">Mark Paid</button>
                        <button onClick={()=>reject(o)} className="px-2 py-1 rounded bg-red-600 text-white">Reject</button>
                      </>
                    )}
                    {o.status==='PENDING' && (
                      <button onClick={()=>act(o.id,'accept')} className="px-2 py-1 rounded border">Accept</button>
                    )}
                    {o.status==='ACCEPTED' && (
                      <button onClick={()=>act(o.id,'ship')} className="px-2 py-1 rounded border">Ship</button>
                    )}
                    {o.status==='SHIPPED' && (
                      <button onClick={()=>act(o.id,'complete')} className="px-2 py-1 rounded border">Complete</button>
                    )}
                    {o.status!=='CANCELLED' && (
                      <button onClick={()=>act(o.id,'cancel',{reason:'Admin cancelled'})} className="px-2 py-1 rounded border">Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length===0 && <tr><td className="p-3" colSpan={8}>No orders</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
