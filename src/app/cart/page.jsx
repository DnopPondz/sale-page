"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const load = async ()=> {
    const { items } = await (await fetch('/api/cart')).json();
    setItems(items || []);
  };
  useEffect(()=>{ load(); }, []);

  const setQty = async (id, qty)=>{
    await fetch(`/api/cart/items/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ qty }) });
    load();
  };
  const del = async (id)=>{
    await fetch(`/api/cart/items/${id}`, { method:'DELETE' });
    load();
  };
  const total = items.reduce((s,i)=> s + Number(i.unitPriceSnapshot) * i.qty, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Cart</h1>
      {items.length===0 ? <div>Cart is empty</div> : (
        <>
          <ul className="divide-y">
            {items.map(i=>(
              <li key={i.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="font-medium">{i.product?.name_en}</div>
                  <div className="text-sm text-gray-500">฿{Number(i.unitPriceSnapshot).toFixed(2)}</div>
                </div>
                <input type="number" min="1" value={i.qty} onChange={e=>setQty(i.id, Number(e.target.value||1))}
                       className="w-16 border p-1 rounded"/>
                <button onClick={()=>del(i.id)} className="px-2 py-1 border rounded">Remove</button>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center pt-3">
            <div className="text-lg font-semibold">Total: ฿{total.toFixed(2)}</div>
            <Link href="/checkout" className="px-3 py-2 rounded bg-black text-white">Checkout</Link>
          </div>
        </>
      )}
    </div>
  );
}
