import axios from 'axios';

async function fetchProduct(slug) {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`);
  return res.data;
}

export default async function ProductPage({ params }) {
  const product = await fetchProduct(params.slug);
  return (
    <div>
      <h1 className="text-2xl mb-2">{product.title}</h1>
      <p className="mb-4">{product.description}</p>
      <p className="font-bold">${product.price}</p>
    </div>
  );
}
