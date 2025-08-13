import axios from 'axios';

async function fetchStatements() {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/statements`);
  return res.data;
}

export default async function StatementsPage() {
  const statements = await fetchStatements();
  return (
    <div>
      <h1 className="text-2xl mb-4">Statements</h1>
      <ul className="space-y-2">
        {statements.map((s) => (
          <li key={s._id}>{new Date(s.generatedAt).toDateString()} - ${s.netPayout}</li>
        ))}
      </ul>
    </div>
  );
}
