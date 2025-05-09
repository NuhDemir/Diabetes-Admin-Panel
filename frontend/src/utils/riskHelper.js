/**
 * Basit bir risk hesaplama fonksiyonu.
 * Gerçek senaryoda daha karmaşık bir model/algoritma kullanılmalıdır.
 * @param {object} patient - Hasta verisi ({ Glucose, BMI, Age })
 * @returns {'Yüksek' | 'Orta' | 'Düşük' | 'Bilinmiyor'} - Risk seviyesi
 */

export const calculateRisk = (patient) => {
  const { Glucose, BMI, Age } = patient;

  //Gerekli veriler eksik ise kontrol ediyoruz
  if (Glucose > 160 || BMI > 35 || (Glucose > 140 && Age > 50)) {
    return "Yüksek";
  } else if (Glucose > 120 || BMI > 30 || (Glucose > 100 && Age > 40)) {
    return "Orta";
  } else if (Glucose >= 0 && BMI >= 0 && Age >= 0) {
    // Geçerli değerler varsa Düşük
    return "Düşük";
  } else {
    return "Bilinmiyor"; // Negatif veya beklenmedik değerler
  }
};
