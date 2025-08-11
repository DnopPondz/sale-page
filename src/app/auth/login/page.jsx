'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [msg, setMsg] = useState('');
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    setMsg('Signing in...');
    const res = await signIn('credentials', { email: form.email, password: form.password, redirect: false });
    if (res?.ok) {
      setMsg('OK');
      router.push('/');
    } else {
      setMsg(res?.error === 'EMAIL_NOT_VERIFIED'
        ? 'กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ'
        : 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border p-2 rounded" placeholder="email"
          value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <input type="password" className="w-full border p-2 rounded" placeholder="password"
          value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/>
        <button className="w-full bg-black text-white py-2 rounded">Sign in</button>
      </form>
      <p className="text-sm">{msg}</p>
    </div>
  );
}
