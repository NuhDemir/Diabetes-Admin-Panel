// backend/repositories/diabetesRepository.js
const Diabetes = require("../models/Diabetes");

class DiabetesRepository {
  async getAll() {
    try {
      return await Diabetes.find({});
    } catch (error) {
      console.error("Repository Hata (getAll):", error);
      throw error; // Hatanın yukarı katmanlara iletilmesi
    }
  }

  async createMany(dataArray) {
    try {
      // Önce mevcut veriyi temizleyelim (seed script'te daha mantıklı olabilir)
      // await Diabetes.deleteMany({});
      return await Diabetes.insertMany(dataArray, { ordered: false }); // Hata olsa bile devam et (isteğe bağlı)
    } catch (error) {
      console.error(
        "Repository Hata (createMany):",
        error.writeErrors ? error.writeErrors : error
      );
      // Eğer validation hatası varsa veya başka bir bulk insert hatası
      if (error.writeErrors) {
        console.warn(
          `Toplam ${dataArray.length} kayıttan ${error.result.nInserted} tanesi eklendi.`
        );
      }
      throw error; // Diğer hataları fırlat
    }
  }

  async clearAll() {
    try {
      return await Diabetes.deleteMany({});
    } catch (error) {
      console.error("Repository Hata (clearAll):", error);
      throw error;
    }
  }
}

module.exports = new DiabetesRepository();
