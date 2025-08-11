"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrdersPage() {
  const [rows, setRows] = useState([]);
  useEffect(()=>{ fetch('/api/orders').then(r=>r.json()).then(setRows); }, []);
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-bold">My Orders</h1>
      <ul className="space-y-2">
        {rows.map(o=>(
          <li key={o.id} className="border rounded p-3 flex justify-between">
            <div>
              <div>ID: {o.id.slice(-6)}</div>
              <div>Status: <b>{o.status}</b> | Method: {o.paymentMethod} | Paid: {o.paymentStatus}</div>
              <div>Total: ฿{Number(o.grandTotal).toFixed(2)}</div>
            </div>
            <Link href={`/orders/${o.id}`} className="underline">View</Link>
          </li>
        ))}
        {rows.length===0 && <li>No orders</li>}
      </ul>
    </div>
  );
}
