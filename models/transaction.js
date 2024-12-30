const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["success", "pending", "failed"],
    required: true,
  },
  type: { type: String, enum: ["debit", "credit"], required: true },
  transactionDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});


const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;