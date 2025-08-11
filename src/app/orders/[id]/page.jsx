"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderDetail({ params }) {
  const [o, setO] = useState(null);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // ถ้าใช้ Next รุ่นใหม่ที่ params เป็น Promise:
  // const { id } = usePromise(params);
  const id = params.id; // ถ้ายังไม่เตือนก็ใช้บรรทัดนี้ได้

  const load = async () => {
    const res = await fetch(`/api/orders/${id}`);
    if (res.ok) setO(await res.json());
  };

  useEffect(() => { load(); }, [id]);

  const uploadSlip = async () => {
    if (!file || uploading) return;
    setUploading(true);
    setMsg("Uploading slip...");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`/api/payments/${id}/slip`, { method: "POST", body: fd });
    if (res.ok) {
      setMsg("Slip uploaded. Waiting for admin confirmation…");
      await load();                      // ดึงสถานะล่าสุด (จะเป็น AWAITING_CONFIRMATION)
      setTimeout(() => router.push("/orders"), 1500); // ⬅️ เด้งกลับ My Orders อัตโนมัติ
    } else {
      setMsg("Upload failed");
    }
    setUploading(false);
  };

  if (!o) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Order {o.id.slice(-6)}</h1>
      <div>Status: <b>{o.status}</b> | Payment: {o.paymentMethod} ({o.paymentStatus})</div>
      <div>Total: ฿{Number(o.grandTotal).toFixed(2)}</div>

      {o.paymentMethod === "BANK_TRANSFER" && (
        <div className="space-y-2">
          <div>
            Payment slip: {o.payment?.slipUrl ? (
              <a href={o.payment.slipUrl} target="_blank" className="underline">View</a>
            ) : "Not uploaded"}
          </div>

          {/* ซ่อนส่วนอัปโหลดถ้ามีสลิปแล้ว */}
          {!o.payment?.slipUrl && (
            <>
              <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
              <button
                onClick={uploadSlip}
                disabled={!file || uploading}
                className="px-3 py-2 rounded bg-black text-white disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload slip"}
              </button>
            </>
          )}

          <div className="text-sm">{msg}</div>

          {/* ปุ่มกลับหน้า Orders ให้กดเองได้ทันที */}
          <button onClick={()=>router.push("/orders")} className="text-sm underline">
            Back to My Orders
          </button>
        </div>
      )}

      <div>
        <h2 className="font-semibold mt-4 mb-2">Items</h2>
        <ul className="text-sm list-disc pl-6">
          {o.items?.map(i=>(
            <li key={i.id}>x{i.qty} — {i.nameSnapshot || i.productId} — ฿{Number(i.unitPriceSnapshot).toFixed(2)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
