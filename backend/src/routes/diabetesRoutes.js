// backend/src/routes/diabetesRoutes.js
const express = require("express");
const diabetesController = require("../controllers/diabetesController");
const router = express.Router();

// Dashboard verilerini getiren ana endpoint
router.get("/dashboard", diabetesController.getDashboardData);

// Eğer / (root) endpoint'i de tüm ham veriyi döndürecekse, bu da eklenebilir:
// const OldDiabetesController = require('../controllers/oldDiabetesController'); // Ayrı bir controller'da getAll olabilir
// router.get('/', OldDiabetesController.getAllData);

// Opsiyonel: Seed endpoint'i (kullanılmıyorsa yorumda kalabilir)
// router.post('/seed', diabetesController.seedData);

module.exports = router;
