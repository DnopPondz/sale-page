import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  description: String,
  price: Number,
  images: [String],
  stock: Number,
  status: { type: String, enum: ['draft', 'active'], default: 'draft' }
});

export default mongoose.model('Product', productSchema);
