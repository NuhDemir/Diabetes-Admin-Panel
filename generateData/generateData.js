const fs = require("fs");
const crypto = require("crypto"); // Benzersizlik için daha iyi

// Gerçek MongoDB ObjectId'sine daha yakın bir string üreten fonksiyon
function generateValidObjectIdString() {
  const timestamp = Math.floor(new Date().getTime() / 1000)
    .toString(16)
    .padStart(8, "0");
  const randomBytes = crypto.randomBytes(8).toString("hex"); // 16 karakter
  return timestamp + randomBytes;
}

// Rastgele tamsayı üreten yardımcı fonksiyon
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Rastgele ondalıklı sayı üreten yardımcı fonksiyon
function getRandomFloat(min, max, decimals = 1) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
}

// Tek bir rastgele hasta verisi üreten fonksiyon
function createRandomPatientData() {
  const now = new Date();
  // Son 1 yıl içinde rastgele bir zaman dilimi (örneğin)
  const randomPastTime =
    now.getTime() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000);
  const recordDate = new Date(randomPastTime);

  const pregnancies = getRandomInt(0, 15);
  const glucose = getRandomInt(60, 220); // Glikoz aralığını biraz genişlettim
  const age = getRandomInt(18, 85); // Yaş aralığını biraz genişlettim

  let insulin;
  // Glikoz seviyesine ve rastgele bir olasılığa göre insülin üretimi
  if (glucose > 140 || Math.random() < 0.25) {
    // Yüksek glikoz veya %25 olasılıkla
    insulin = getRandomInt(50, 600); // Daha yüksek insülin aralığı
  } else {
    insulin = getRandomInt(0, 250);
  }
  // İnsülinin %20 olasılıkla 0 olması (örn: ölçülmemiş veya tip 1 diyabet durumu)
  if (Math.random() < 0.2) {
    insulin = 0;
  }

  let skinThickness;
  // Deri kalınlığının %20 olasılıkla 0 olması
  if (Math.random() < 0.2) {
    skinThickness = 0;
  } else {
    skinThickness = getRandomInt(7, 60); // Daha gerçekçi bir aralık
  }

  // --- BloodPressure Değişikliği ---
  // BloodPressure her zaman 60-120 aralığında olacak, artık 0 olmayacak.
  const bloodPressure = getRandomInt(60, 120); // Minimum 60, Maksimum 120

  return {
    _id: generateValidObjectIdString(),
    Age: age,
    Pregnancies: pregnancies,
    Glucose: glucose,
    "BloodPressure (mg/dL)": bloodPressure, // Alan adını MongoDB'deki gibi kullanıyoruz
    SkinThickness: skinThickness,
    Insulin: insulin,
    BMI: getRandomFloat(15.0, 55.0, 1), // BMI aralığını biraz genişlettim
    DiabetesPedigreeFunction: getRandomFloat(0.05, 2.5, 3), // DPF aralığı
    // __v: 0, // Mongoose bunu kendi yönetir, genellikle JSON'a eklemeye gerek yok
    createdAt: recordDate.toISOString(),
    updatedAt: recordDate.toISOString(),
  };
}

// 100.000 adet veri üret
const numberOfRecords = 1000;
const allData = [];

console.log(`Generating ${numberOfRecords} records...`);
for (let i = 0; i < numberOfRecords; i++) {
  allData.push(createRandomPatientData());
  if ((i + 1) % 10000 === 0) {
    // Her 10 bin kayıtta logla
    console.log(`${i + 1} records generated.`);
  }
}

// JSON dosyasına yaz (Dosya adını üretilen kayıt sayısına göre güncelledim)
const filePath = `diabetes_data_${numberOfRecords}.json`; // Dinamik dosya adı
fs.writeFile(filePath, JSON.stringify(allData, null, 2), (err) => {
  if (err) {
    console.error("Error writing JSON file:", err);
  } else {
    console.log(
      `Successfully generated ${numberOfRecords} records and saved to ${filePath}`
    );
  }
});
