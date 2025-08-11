"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [method, setMethod] = useState('BANK_TRANSFER');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  const place = async ()=>{
    setMsg('Placing order...');
    const res = await fetch('/api/checkout', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ paymentMethod: method, shippingInfo: null, notes: '' })
    });
    if (!res.ok) { setMsg('Checkout failed'); return; }
    const { orderId } = await res.json();
    router.push(`/orders/${orderId}`);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input type="radio" checked={method==='BANK_TRANSFER'} onChange={()=>setMethod('BANK_TRANSFER')} />
          Bank Transfer (แนบสลิปหลังสั่งซื้อ)
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" checked={method==='COD'} onChange={()=>setMethod('COD')} />
          Cash on Delivery
        </label>
      </div>
      <button onClick={place} className="px-3 py-2 rounded bg-black text-white">Place Order</button>
      <div className="text-sm">{msg}</div>
    </div>
  );
}
