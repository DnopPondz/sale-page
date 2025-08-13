import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/create', authRequired, (req, res) => {
  res.json({ clientSecret: 'stub' });
});

router.post('/webhook', (req, res) => {
  // TODO: integrate payment provider webhook
  res.json({ received: true });
});

export default router;
