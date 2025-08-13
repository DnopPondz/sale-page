import mongoose from 'mongoose';

const statementSchema = new mongoose.Schema({
  periodStart: Date,
  periodEnd: Date,
  grossSales: Number,
  refunds: Number,
  fees: Number,
  netPayout: Number,
  generatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Statement', statementSchema);
