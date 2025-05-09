const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.config");
const diabetesRoutes = require("./routes/diabetesRoutes");

//.env dosyasını yükle
dotenv.config();

//veritabanına bağlan
connectDB();

const app = express();

// Middleware
app.use(cors()); // CORS ayarları
app.use(express.json()); //Gelen json verilerini parse etmek için

app.get("/", (res, req) => {
  res.send("Diabetes API çalışıyor...");
});

//API routes

app.use("/api/diabetes", diabetesRoutes);
//Tüm /api/diabetes isteklerini diabetesRoutes'a yönlendiriyoruz

//Hata yönetimi
app.use((err, req, res, next) => {
  console.error("Hata:", err.stack);
  res.status(500).send({
    success: false,
    message: "Beklenmeyen bir sunucu hatası oluştu!!!",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor...`));
