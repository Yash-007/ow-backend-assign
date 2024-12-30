const express = require("express");
const router = express.Router();
const Transaction = require("../models/transaction");
const mongoose = require('mongoose');

// Get transactions for a user   /api/transactions/user/userId
router.get("/user/:userId?", async (req, res) => {
  try {
    if (!req.params.userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const { status, from, to, type, page = 1, limit = 10 } = req.query;

    const filters = { userId: new mongoose.Types.ObjectId(req.params.userId) };
    if (status) filters.status = status;
    if (type) filters.type = type;
    if (from || to) filters.transactionDate = {};
    if (from) filters.transactionDate.$gte = new Date(from);
    if (to) filters.transactionDate.$lte = new Date(to);

    const transactions = await Transaction.aggregate([
      { $match: filters },
      { $skip: (parseInt(page) - 1) * parseInt(limit) },
      { $limit: parseInt(limit) }
    ]);

    const totalCount = await Transaction.aggregate([
      { $match: filters },
      { $count: "total" }
    ]);

    const total = totalCount.length > 0 ? totalCount[0].total : 0;
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      transactions,
      currentPage: parseInt(page),
      totalPages,
      totalTransactions: total
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all transactions with user details   /api/transactions
router.get("/", async (req, res) => {
  try {
    const { status, from, to, type, page = 1, limit = 10 } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (type) filters.type = type;
    if (from || to) filters.transactionDate = {};
    if (from) filters.transactionDate.$gte = new Date(from);
    if (to) filters.transactionDate.$lte = new Date(to);


    const transactions = await Transaction.aggregate([
      { $match: filters },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
    ]);


    // Get total count for pagination
    const totalCount = await Transaction.aggregate([
      { $match: filters },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      { $count: "total" }
    ]);

    const total = totalCount.length > 0 ? totalCount[0].total : 0;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
