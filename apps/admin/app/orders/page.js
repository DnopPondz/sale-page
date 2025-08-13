import axios from 'axios';

async function fetchOrders() {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
  return res.data;
}

export default async function AdminOrdersPage() {
  const orders = await fetchOrders();
  return (
    <div>
      <h1 className="text-2xl mb-4">Orders</h1>
      <ul className="space-y-2">
        {orders.map((o) => (
          <li key={o._id}>{o._id} - ${o.total}</li>
        ))}
      </ul>
    </div>
  );
}
