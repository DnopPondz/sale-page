import { calcStatement } from '../utils/calc.js';

test('calculates fees and net payout', () => {
  const { fees, net } = calcStatement(100, 10, 0.1);
  expect(fees).toBe(10);
  expect(net).toBe(80);
});
