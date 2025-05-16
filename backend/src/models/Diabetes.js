// backend/src/models/Diabetes.js
const mongoose = require("mongoose");

const DiabetesSchema = new mongoose.Schema(
  {
    Age: { type: Number, required: true },
    Pregnancies: { type: Number, required: true },
    Glucose: { type: Number, required: true },
    "BloodPressure (mg/dL)": { type: Number, required: true }, // MongoDB'deki alan adıyla eşleşmeli
    SkinThickness: { type: Number, required: true },
    Insulin: { type: Number, required: true },
    BMI: { type: Number, required: true },
    DiabetesPedigreeFunction: { type: Number, required: true },
  },
  {
    timestamps: true,
    collection: "diabetes_data", // Koleksiyon adının bu olduğundan emin ol
  }
);

module.exports = mongoose.model("Diabetes", DiabetesSchema);
