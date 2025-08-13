import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { authRequired, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', authRequired, adminOnly, async (req, res) => {
  const orders = await Order.find().sort('-createdAt');
  res.json(orders);
});

router.get('/me', authRequired, async (req, res) => {
  const orders = await Order.find({ userId: req.user.id }).sort('-createdAt');
  res.json(orders);
});

router.get('/:id', authRequired, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Not found' });
  if (req.user.role !== 'admin' && String(order.userId) !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.json(order);
});

router.post(
  '/',
  authRequired,
  [body('items').isArray({ min: 1 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { items, shipping = 0 } = req.body;
    const populated = await Promise.all(
      items.map(async (i) => {
        const product = await Product.findById(i.productId);
        return { productId: i.productId, qty: i.qty, price: product.price };
      })
    );
    const subtotal = populated.reduce((sum, i) => sum + i.price * i.qty, 0);
    const order = await Order.create({
      userId: req.user.id,
      items: populated,
      subtotal,
      shipping,
      total: subtotal + shipping
    });
    res.status(201).json(order);
  }
);

router.put('/:id', authRequired, adminOnly, async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(order);
});

export default router;
