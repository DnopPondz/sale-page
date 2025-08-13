import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  qty: Number,
  price: Number
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [itemSchema],
  subtotal: Number,
  shipping: Number,
  total: Number,
  paymentStatus: { type: String, default: 'pending' },
  fulfillmentStatus: { type: String, default: 'unfulfilled' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
