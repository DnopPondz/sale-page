import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/shop');
  await Promise.all([User.deleteMany(), Product.deleteMany(), Order.deleteMany()]);

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@example.com',
    passwordHash: await bcrypt.hash('password', 10),
    role: 'admin'
  });

  const customer = await User.create({
    name: 'Customer',
    email: 'customer@example.com',
    passwordHash: await bcrypt.hash('password', 10)
  });

  const products = await Product.insertMany(
    Array.from({ length: 10 }).map((_, i) => ({
      title: `Product ${i + 1}`,
      slug: `product-${i + 1}`,
      description: 'Sample product',
      price: (i + 1) * 10,
      images: [],
      stock: 100,
      status: 'active'
    }))
  );

  console.log('Seeded', { admin: admin.email, customer: customer.email, products: products.length });
  process.exit();
}

run();
