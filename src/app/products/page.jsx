"use client";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");

  const load = async () => {
    const url = new URL("/api/products", window.location.origin);
    if (q) url.searchParams.set("q", q);
    const res = await fetch(url);
    setRows(await res.json());
  };
  useEffect(() => { load(); }, []); // eslint-disable-line

  const add = async (p) => {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: p.id,
        options: {},
        qty: 1,
        unitPrice: Number(p.basePrice)
      }),
    });
    alert("Added to cart");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <div className="flex gap-2">
        <input className="border p-2 rounded flex-1" placeholder="search..." value={q} onChange={e=>setQ(e.target.value)} />
        <button onClick={load} className="px-3 py-2 border rounded">Search</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map(p=>(
          <div key={p.id} className="border rounded p-3">
            <div className="h-40 bg-gray-100 rounded grid place-items-center">{p.images?.[0] ? <img src={p.images[0]} alt="" className="h-40 w-full object-cover rounded"/> : "No image"}</div>
            <div className="mt-2 font-semibold">{p.name_en}</div>
            <div className="text-sm text-gray-500">{p.name_th}</div>
            <div className="mt-1">฿{Number(p.basePrice).toFixed(2)}</div>
            <button onClick={()=>add(p)} className="mt-2 px-3 py-1 rounded bg-black text-white">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
