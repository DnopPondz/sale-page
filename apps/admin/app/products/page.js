import axios from 'axios';

async function fetchProducts() {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
  return res.data;
}

export default async function AdminProductsPage() {
  const products = await fetchProducts();
  return (
    <div>
      <h1 className="text-2xl mb-4">Products</h1>
      <ul className="space-y-2">
        {products.map((p) => (
          <li key={p._id}>{p.title}</li>
        ))}
      </ul>
    </div>
  );
}
