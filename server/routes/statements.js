import { Router } from 'express';
import Statement from '../models/Statement.js';
import Order from '../models/Order.js';
import { authRequired, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', authRequired, adminOnly, async (req, res) => {
  const statements = await Statement.find().sort('-generatedAt');
  res.json(statements);
});

router.get('/:id', authRequired, adminOnly, async (req, res) => {
  const statement = await Statement.findById(req.params.id);
  if (!statement) return res.status(404).json({ message: 'Not found' });
  res.json(statement);
});

router.post('/generate', authRequired, adminOnly, async (req, res) => {
  const from = new Date(req.query.from);
  const to = new Date(req.query.to);
  const orders = await Order.find({
    createdAt: { $gte: from, $lte: to },
    paymentStatus: 'paid'
  });
  const grossSales = orders.reduce((sum, o) => sum + o.total, 0);
  const refunds = 0;
  const fees = grossSales * Number(process.env.FEE_RATE || 0);
  const netPayout = grossSales - refunds - fees;
  const statement = await Statement.create({
    periodStart: from,
    periodEnd: to,
    grossSales,
    refunds,
    fees,
    netPayout
  });
  res.status(201).json(statement);
});

export default router;
