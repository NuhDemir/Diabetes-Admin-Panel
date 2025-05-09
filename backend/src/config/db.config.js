// config/db.config.js (Expected structure)
const mongoose = require("mongoose");
require("dotenv").config(); // Assuming dotenv is used here too or globally

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Bağlandı: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Bağlantı Hatası: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
