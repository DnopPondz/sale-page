import axios from 'axios';

async function fetchProducts() {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
  return res.data;
}

export default async function ProductsPage() {
  const products = await fetchProducts();
  return (
    <div>
      <h1 className="text-2xl mb-4">Products</h1>
      <ul className="space-y-2">
        {products.map((p) => (
          <li key={p._id}>
            <a className="text-blue-600" href={`/products/${p.slug}`}>{p.title} - ${p.price}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
