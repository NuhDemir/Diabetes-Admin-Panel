// backend/scripts/seed.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("../config/db.config"); // DB bağlantı fonksiyonunu import et
const diabetesService = require("../services/diabetesService"); // Seed fonksiyonunu içeren servisi import et
const path = require("path");

// .env dosyasını yükle (server.js dışında çalıştırıldığı için tekrar gerekir)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const seedData = async () => {
  try {
    // Önce veritabanına bağlan
    await connectDB();
    console.log("Veritabanına bağlanıldı. Seed işlemi başlıyor...");

    // Servis üzerinden seed fonksiyonunu çağır
    const result = await diabetesService.seedDatabaseFromCSV();

    if (result.success) {
      console.log(`Başarılı: ${result.count} kayıt eklendi.`);
    } else {
      console.warn(
        `Seed işlemi tamamlandı ancak ${result.count} kayıt eklendi. Mesaj: ${result.message}`
      );
    }

    console.log("Seed işlemi tamamlandı. Bağlantı kapatılıyor.");
    await mongoose.disconnect(); // İşlem bitince bağlantıyı kapat
    process.exit(0); // Başarılı çıkış
  } catch (error) {
    console.error("Seed Script Hata:", error);
    await mongoose.disconnect(); // Hata durumunda da bağlantıyı kapatmaya çalış
    process.exit(1); // Hatalı çıkış
  }
};

// Script'i çalıştır
seedData();
