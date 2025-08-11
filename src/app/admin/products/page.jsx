"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function AdminProducts() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);           // เปิด/ปิด modal
  const [uploading, setUploading] = useState(false); // สถานะตอนอัปโหลดไฟล์
  const [file, setFile] = useState(null);            // ไฟล์ที่เลือกใน modal

  const [form, setForm] = useState({
    name_en: "",
    name_th: "",
    description_en: "",
    description_th: "",
    basePrice: 0,
    images: [], // เก็บ URL หลังอัปโหลดสำเร็จ
    badgeNew: false,
    badgeRecommended: false,
  });

  const load = async () => {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setRows(Array.isArray(data) ? data : []);
  };

  useEffect(() => { load(); }, []);

//   const fallback = "https://placehold.co/600x400/png?text=No+Image";
const fallback = "/no-image.png";

  // อัปโหลดรูปไฟล์ขึ้น S3/R2 → ได้ public URL → push เข้า form.images
 const uploadImage = async () => {
  if (!file) return;
  setUploading(true);
  try {
    if (process.env.NEXT_PUBLIC_UPLOAD_TARGET === 'local') {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/uploads/local', { method: 'POST', body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'local upload failed');
      }
      const { fileUrl } = await res.json();
      setForm((f) => ({ ...f, images: [...f.images, fileUrl] }));
      setFile(null);
    } else {
      const metaRes = await fetch('/api/admin/uploads/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      if (!metaRes.ok) {
        const err = await metaRes.json().catch(() => ({}));
        throw new Error(err.message || 'presign failed');
      }
      const meta = await metaRes.json();

      const putRes = await fetch(meta.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error('upload to storage failed');

      setForm((f) => ({ ...f, images: [...f.images, meta.fileUrl] }));
      setFile(null);
    }
  } catch (e) {
    alert(e.message || 'Upload error');
  } finally {
    setUploading(false);
  }
};



  const create = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setOpen(false);
      setForm({
        name_en: "",
        name_th: "",
        description_en: "",
        description_th: "",
        basePrice: 0,
        images: [],
        badgeNew: false,
        badgeRecommended: false,
      });
      load();
    }
  };

  const toggleActive = async (p) => {
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...p,
        status: p.status === "active" ? "suspended" : "active",
      }),
    });
    load();
  };

  

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <button
          onClick={() => setOpen(true)}
          className="px-3 py-2 rounded bg-black text-white"
        >
          + Add Product
        </button>
      </div>

      {/* grid แสดงรายการ */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {rows.map((p) => {
          const firstImage =
            Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null;
          return (
            <div key={p.id} className="border rounded p-3">
              <Image
                src={firstImage || fallback}
                alt={p.name_en || "No image"}
                width={300}
                height={160}
                className="w-full h-40 object-cover rounded"
              />
              <div className="mt-2 font-semibold">{p.name_en}</div>
              <div className="text-sm text-gray-400">{p.name_th}</div>
              <div className="mt-1">฿{Number(p.basePrice).toFixed(2)}</div>
              <div className="text-xs mt-1">
                Status: <b>{p.status}</b>
              </div>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => toggleActive(p)}
                  className="px-2 py-1 rounded border"
                >
                  Toggle Active
                </button>
                <button
                  onClick={async () => {
                    await fetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
                    load();
                  }}
                  className="px-2 py-1 rounded border"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white text-black p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Add Product</h2>
              <button onClick={() => setOpen(false)} className="text-gray-500">✕</button>
            </div>

            <form onSubmit={create} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  className="border p-2 rounded"
                  placeholder="name_en"
                  value={form.name_en}
                  onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                />
                <input
                  className="border p-2 rounded"
                  placeholder="name_th"
                  value={form.name_th}
                  onChange={(e) => setForm({ ...form, name_th: e.target.value })}
                />
                <input
                  className="border p-2 rounded"
                  placeholder="basePrice"
                  type="number"
                  value={form.basePrice}
                  onChange={(e) =>
                    setForm({ ...form, basePrice: Number(e.target.value || 0) })
                  }
                />
                <label className="text-sm flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.badgeNew}
                    onChange={(e) =>
                      setForm({ ...form, badgeNew: e.target.checked })
                    }
                  />
                  New
                </label>
                <label className="text-sm flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.badgeRecommended}
                    onChange={(e) =>
                      setForm({ ...form, badgeRecommended: e.target.checked })
                    }
                  />
                  Recommended
                </label>
              </div>

              <textarea
                className="border p-2 rounded w-full"
                placeholder="description_en"
                rows={3}
                value={form.description_en}
                onChange={(e) =>
                  setForm({ ...form, description_en: e.target.value })
                }
              />
              <textarea
                className="border p-2 rounded w-full"
                placeholder="description_th"
                rows={3}
                value={form.description_th}
                onChange={(e) =>
                  setForm({ ...form, description_th: e.target.value })
                }
              />

              {/* อัปโหลดไฟล์รูป */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <button
                    type="button"
                    onClick={uploadImage}
                    disabled={!file || uploading}
                    className="px-3 py-2 rounded border"
                  >
                    {uploading ? "Uploading..." : "Upload image"}
                  </button>
                </div>

                {/* preview รูปทั้งหมดที่อัปโหลดสำเร็จแล้ว */}
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.images.map((u, i) => (
                      <div key={u + i} className="relative">
                        <Image
                          src={u}
                          alt={`image-${i}`}
                          width={120}
                          height={80}
                          className="w-[160px] h-[100px] object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              images: f.images.filter((_, idx) => idx !== i),
                            }))
                          }
                          className="absolute top-1 right-1 bg-white rounded px-2 text-sm"
                          title="remove"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded border"
                >
                  Cancel
                </button>
               <button disabled={uploading} className="px-3 py-2 rounded bg-black text-white disabled:opacity-50">
  Create Product
</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
