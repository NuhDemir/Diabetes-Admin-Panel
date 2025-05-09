const mongoose = require("mongoose");
// İkinci require('mongoose') gereksiz, kaldırılabilir.

const DiabetesSchema = new mongoose.Schema(
  {
    // Alan tanımları aynı kalır...
    Age: {
      type: Number,
      required: true,
    },
    Pregnancies: {
      type: Number,
      required: true,
    },
    Glucose: {
      type: Number,
      required: true,
    },
    BloodPressure: {
      // Alan adının MongoDB'de de 'BloodPressure' olduğundan emin ol!
      type: Number,
      required: true,
    },
    SkinThickness: {
      type: Number,
      required: true,
    },
    Insulin: {
      type: Number,
      required: true,
    },
    BMI: {
      type: Number,
      required: true,
    },
    DiabetesPedigreeFunction: {
      type: Number,
      required: true,
    },
  },
  // ----- SEÇENEKLER TEK BİR OBJE İÇİNDE BİRLEŞTİRİLDİ -----
  {
    timestamps: true, // Oluşturma ve güncelleme zamanlarını ekler
    collection: "diabetes_data", // Hedef koleksiyon adını burada belirt
  }
  // ----- Buradaki fazladan seçenek objesi kaldırıldı -----
);

// Model adı 'Diabetes' olabilir, Mongoose artık 'diabetes_data' koleksiyonuna bakacak.
module.exports = mongoose.model("Diabetes", DiabetesSchema);
