'use client';
import { useEffect, useState } from 'react';

export default function AdminUsers() {
  const [rows, setRows] = useState([]);
  const load = async ()=> setRows(await (await fetch('/api/admin/users')).json());
  useEffect(()=>{ load(); }, []);

  const update = async (u, data) => {
    await fetch(`/api/admin/users/${u.id}`, {
      method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data)
    });
    load();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Users</h1>
      <div className="overflow-auto border rounded">
        <table className="min-w-[700px] w-full">
          <thead><tr className="bg-gray-50 text-left">
            <th className="p-2">Email</th><th className="p-2">Name</th><th className="p-2">Role</th><th className="p-2">Status</th><th className="p-2">Actions</th>
          </tr></thead>
          <tbody>
          {rows.map(u=>(
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.firstName} {u.lastName}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2">{u.status}</td>
              <td className="p-2 space-x-2">
                <button onClick={()=>update(u,{ role: u.role==='admin'?'user':'admin' })}
                        className="px-2 py-1 rounded border">Toggle Role</button>
                <button onClick={()=>update(u,{ status: u.status==='active'?'blocked':'active' })}
                        className="px-2 py-1 rounded border">Block/Unblock</button>
              </td>
            </tr>
          ))}
          {rows.length===0 && <tr><td colSpan={5} className="p-3">No users</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
