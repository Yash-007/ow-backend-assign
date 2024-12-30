const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);

const connection = mongoose.connection;

//verify connection
connection.on("connected", () => {
  console.log("Mongo DB Connection Successfull");
});

connection.on("error", (err) => {
  console.log("Mongo DB connection Error", err);
});
