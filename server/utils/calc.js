export function calcStatement(total, refunds = 0, feeRate = 0.1) {
  const fees = total * feeRate;
  return { fees, net: total - refunds - fees };
}
