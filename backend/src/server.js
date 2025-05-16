// backend/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.config"); // Doğru yol
const diabetesRoutes = require("./routes/diabetesRoutes"); // Doğru yol

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  // req ve res parametre sırası
  res.send("Diabetes API Çalışıyor...");
});

app.use("/api/diabetes", diabetesRoutes);

app.use((err, req, res, next) => {
  console.error("Ana Hata Yakalayıcı:", err.stack);
  res.status(500).send({
    success: false,
    message: "Beklenmeyen bir sunucu hatası oluştu!",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor...`));
