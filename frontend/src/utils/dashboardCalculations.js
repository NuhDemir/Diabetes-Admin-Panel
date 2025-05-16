// frontend/src/utils/dashboardCalculations.js

// VERİTABANINDAKİ GERÇEK ALAN ADI!
export const BLOOD_PRESSURE_KEY = "BloodPressure"; // <-- DÜZELTİLDİ

/**
 * Basit bir risk hesaplama fonksiyonu.
 * NOT: Bu fonksiyon artık backend'de (aggregation içinde) hesaplandığı için
 * frontend'de RiskLevel verisi doğrudan backend'den gelecektir.
 * Bu fonksiyon frontend'de hala başka bir amaçla kullanılıyorsa kalabilir.
 * @param {object} patient - Hasta verisi ({ Glucose, BMI, Age })
 * @returns {'Yüksek' | 'Orta' | 'Düşük' | 'Bilinmiyor'} - Risk seviyesi
 */
export const calculateRisk = (patient) => {
  const { Glucose, BMI, Age } = patient;

  // Gerekli veriler eksikse
  if (
    Glucose === undefined ||
    BMI === undefined ||
    Age === undefined ||
    Glucose === null ||
    BMI === null ||
    Age === null
  ) {
    return "Bilinmiyor";
  }

  if (Glucose > 160 || BMI > 35 || (Glucose > 140 && Age > 50)) {
    return "Yüksek";
  } else if (Glucose > 120 || BMI > 30 || (Glucose > 100 && Age > 40)) {
    return "Orta";
  } else if (Glucose >= 0 && BMI >= 0 && Age >= 0) {
    return "Düşük";
  } else {
    return "Bilinmiyor";
  }
};

// Diğer tüm calculate... ve prepare... fonksiyonları buradan kaldırılabilir,
// çünkü bu hesaplamalar artık backend'de yapılıyor.
