// backend/src/controllers/diabetesController.js
const DiabetesAggregationService = require("../services/diabetesAggregationService");
// const diabetesService = require('../services/diabetesService'); // Seed için gerekirse

class DiabetesController {
  async getDashboardData(req, res) {
    try {
      const filters = {
        minAge: req.query.minAge,
        maxAge: req.query.maxAge,
        riskLevel: req.query.riskLevel,
      };
      // İsteğe bağlı: Boş veya undefined filtreleri temizle
      Object.keys(filters).forEach(
        (key) =>
          (filters[key] === undefined || filters[key] === "") &&
          delete filters[key]
      );

      console.log("CONTROLLER: getDashboardData çağrıldı, Filtreler:", filters);
      const dashboardData = await DiabetesAggregationService.getDashboardData(
        filters
      );
      // console.log("CONTROLLER: Servisten dönen dashboardData:", JSON.stringify(dashboardData, null, 2).substring(0, 500) + "..."); // Çok uzun olabilir
      console.log("CONTROLLER: Dashboard verisi servisten başarıyla alındı.");
      res.status(200).json({ success: true, data: dashboardData });
    } catch (error) {
      console.error("Controller Hata (getDashboardData):", error);
      res.status(500).json({
        success: false,
        message:
          error.message || // Servisten gelen özel mesajı kullan
          "Dashboard verileri alınırken sunucu hatası oluştu.",
      });
    }
  }

  // SeedData (kullanılmıyorsa yorumda kalabilir veya silinebilir)
  /*
  async seedData(req, res) {
    console.log("Seed isteği alındı...");
    try {
      const result = await diabetesService.seedDatabaseFromCSV(); // diabetesService'i import etmeniz gerekir
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
  */
}

module.exports = new DiabetesController();
