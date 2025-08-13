import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/Product.js';
import { authRequired, adminOnly } from '../middleware/auth.js';

const router = Router();

// list products
router.get('/', async (req, res) => {
  const { page = 1, limit = 12, sort = 'createdAt', q } = req.query;
  const query = q ? { title: new RegExp(q, 'i') } : {};
  const products = await Product.find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort(sort.replace(':', ' '));
  res.json(products);
});

// single product
router.get('/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
});

// create
router.post(
  '/',
  authRequired,
  adminOnly,
  [body('title').notEmpty(), body('slug').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const product = await Product.create(req.body);
    res.status(201).json(product);
  }
);

// update
router.put('/:id', authRequired, adminOnly, async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

// delete
router.delete('/:id', authRequired, adminOnly, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
