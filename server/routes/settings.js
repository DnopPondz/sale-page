import { Router } from 'express';
import Setting from '../models/Setting.js';
import { authRequired, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  const settings = await Setting.find();
  res.json(settings);
});

router.put('/', authRequired, adminOnly, async (req, res) => {
  const updates = req.body; // {key: value}
  const entries = Object.entries(updates);
  for (const [key, value] of entries) {
    await Setting.findOneAndUpdate({ key }, { value }, { upsert: true });
  }
  const settings = await Setting.find();
  res.json(settings);
});

export default router;
