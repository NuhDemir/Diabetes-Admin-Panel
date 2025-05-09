const diabetesService = require("../services/diabetesService");

class DiabetesController {
  async getAllData(req, res) {
    try {
      const data = await diabetesService.getAllDiabetesData();
      res.status(200).json({ success: true, count: data.length, data: data });
    } catch (error) {
      console.error("Controller Hata (getAllData):", error);
      res
        .status(500)
        .json({ success: false, message: error.message || "Sunucu hatası" });
    }
  }

  // Eğer varsa seedData metodunu da kontrol et
  async seedData(req, res) {
    console.log("Seed isteği alındı...");
    try {
      const result = await diabetesService.seedDatabaseFromCSV();

      res.status(201).json({
        success: true,
        message: `${result.count} kayıt başarıyla eklendi.`,
        data: result,
      });
    } catch (error) {
      console.error("Controller Hata (seedData):", error);

      res.status(500).json({
        success: false,
        message: error.message || "Veri yükleme sırasında sunucu hatası",
      });
    }
  }
}

module.exports = new DiabetesController();
