const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const Transaction = require("../models/transaction.js");

// insert users and transactions    /api/insert
router.get("/", async (req, res) => {
  try {
    // delete existing and add new
    await User.deleteMany({});
    await Transaction.deleteMany({});

    const users = [];
    for (let i = 1; i <= 10; i++) {
      users.push({ name: `User${i}`, phoneNumber: `123456789${i}` });
    }

    const createdUsers = await User.insertMany(users);

    const transactions = [];
    createdUsers.forEach((user) => {
      for (let j = 1; j <= 5; j++) {
        transactions.push({
          status: ["success", "pending", "failed"][
            Math.floor(Math.random() * 3)
          ],
          type: ["debit", "credit"][Math.floor(Math.random() * 2)],
          transactionDate: new Date(),
          amount: Math.floor(Math.random() * 10000) + 1,
          userId: user._id,
        });
      }
    });

    await Transaction.insertMany(transactions);

    res.status(200).json({ message: "Data inserted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
