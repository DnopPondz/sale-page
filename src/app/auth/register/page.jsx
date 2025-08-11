'use client';
import { useState } from 'react';

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName:'', lastName:'', phone:'', email:'', password:'' });
  const [msg, setMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setMsg('Submitting...');
    const res = await fetch('/api/auth/register', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) setMsg('Registered! Please check your email to verify.');
    else {
      const j = await res.json().catch(()=>({message:'Error'}));
      setMsg(j.message || 'Error');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Register</h1>
      <form onSubmit={submit} className="space-y-3">
        {['firstName','lastName','phone','email','password'].map((k)=>(
          <input key={k} type={k==='password'?'password':'text'} placeholder={k}
            className="w-full border p-2 rounded"
            value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/>
        ))}
        <button className="w-full bg-black text-white py-2 rounded">Create account</button>
      </form>
      <p className="text-sm">{msg}</p>
    </div>
  );
}
