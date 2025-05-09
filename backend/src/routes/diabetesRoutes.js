const express = require("express");
const diabetesController = require("../controllers/diabetesController");
const router = express.Router();

//Tüm verileri getir
router.get("/", diabetesController.getAllData);

//CSV'den verileri yükle
router.post("/seed", diabetesController.seedData);

module.exports = router;
