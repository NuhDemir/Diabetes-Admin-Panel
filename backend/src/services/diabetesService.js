// backend/services/diabetesService.js
const diabetesRepository = require("../repositories/diabetesRepository");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

class DiabetesService {
  async getAllDiabetesData() {
    try {
      return await diabetesRepository.getAll();
    } catch (error) {
      console.error("Service Hata (getAllDiabetesData):", error);
      throw new Error("Veri alınırken bir hata oluştu.");
    }
  }

  async seedDatabaseFromCSV(
    // Kullanılacak CSV dosyasının yolu.
    // Bu yol, diabetesService.js dosyasının bulunduğu yerden (services klasörü) görelidir.
    // Örneğin, CSV dosyası backend/scripts/diabetes.csv ise bu yol doğrudur.
    filepath = path.join(__dirname, "..", "scripts", "diabetes.csv") // CSV dosya adını kontrol et
  ) {
    console.log(`Seed işlemi için CSV dosyası okunuyor: ${filepath}`);
    const results = [];

    // Veri temizleme ve dönüştürme fonksiyonu
    const cleanAndParseData = (row) => {
      const cleanedRow = {};
      const originalKeys = Object.keys(row); // CSV'den gelen orijinal sütun başlıkları

      // Basit tam sayı alanları (Age, Pregnancies, Glucose, SkinThickness, Insulin)
      // Bu alanların CSV başlıklarında boşluk veya özel karakter olmadığını varsayıyoruz.
      ["Age", "Pregnancies", "Glucose", "SkinThickness", "Insulin"].forEach(
        (key) => {
          if (
            row[key] !== undefined &&
            row[key] !== null &&
            String(row[key]).trim() !== ""
          ) {
            const parsedValue = parseInt(row[key], 10);
            cleanedRow[key] = isNaN(parsedValue) ? 0 : parsedValue;
          } else {
            cleanedRow[key] = 0;
          }
        }
      );

      // --- KAN BASINCI (BloodPressure) İÇİN GÜNCELLENMİŞ İŞLEME ---
      let bpValue = 0;
      // CSV'deki 'BloodPressure' ile başlayan (ve etrafındaki boşlukları temizlenmiş) anahtarı bul
      // Bu, "BloodPressure", "BloodPressure ", " BloodPressure ", "BloodPressure (mg/dL)" gibi başlıkları yakalar.
      const bpKeyInCsv = originalKeys.find((k) =>
        k.trim().startsWith("BloodPressure")
      );

      if (
        bpKeyInCsv &&
        row[bpKeyInCsv] !== undefined &&
        row[bpKeyInCsv] !== null &&
        String(row[bpKeyInCsv]).trim() !== ""
      ) {
        // Değeri alırken parseInt kullanıyoruz. Eğer değer sayısal değilse (örn: "N/A"), NaN dönecektir.
        const parsedBp = parseInt(row[bpKeyInCsv], 10);
        bpValue = isNaN(parsedBp) ? 0 : parsedBp; // NaN ise 0 ata
      }
      // Temizlenmiş veriye HER ZAMAN 'BloodPressure' (boşluksuz) anahtarıyla kaydet
      cleanedRow.BloodPressure = bpValue;
      // --------------------------------------------------------------------

      // Ondalıklı sayı alanları (BMI, DiabetesPedigreeFunction)
      const parseFloatingPoint = (value) => {
        if (
          value === undefined ||
          value === null ||
          String(value).trim() === ""
        )
          return 0;
        const num = parseFloat(String(value).replace(",", "."));
        return isNaN(num) ? 0 : num;
      };
      cleanedRow.BMI = parseFloatingPoint(row.BMI); // CSV başlığının 'BMI' olduğunu varsayıyoruz
      cleanedRow.DiabetesPedigreeFunction = parseFloatingPoint(
        row.DiabetesPedigreeFunction
      ); // CSV başlığının 'DiabetesPedigreeFunction' olduğunu varsayıyoruz

      // Son bir genel NaN kontrolü (isteğe bağlı, yukarıdaki kontroller genellikle yeterli)
      for (const key in cleanedRow) {
        if (typeof cleanedRow[key] === "number" && isNaN(cleanedRow[key])) {
          // console.warn( // Bu log çok fazla çıktı üretebilir
          //   `Son kontrolde NaN bulundu: (${key}: ${row[key]}), 0 olarak ayarlandı. Satır: `,
          //   row
          // );
          cleanedRow[key] = 0;
        }
      }
      return cleanedRow;
    };

    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filepath)) {
        const errorMsg = `HATA: CSV dosyası bulunamadı: ${filepath}`;
        console.error(errorMsg);
        return reject(new Error(errorMsg));
      }

      fs.createReadStream(filepath)
        .pipe(csv())
        .on("data", (data) => {
          const parsed = cleanAndParseData(data);
          if (parsed) {
            results.push(parsed);
          }
        })
        .on("end", async () => {
          console.log(
            `${results.length} adet geçerli satır CSV'den okundu ve işlendi.`
          );
          if (results.length > 0) {
            try {
              console.log("Mevcut veritabanı kayıtları temizleniyor...");
              await diabetesRepository.clearAll();
              console.log("Veritabanı temizlendi.");
              console.log("Yeni veriler veritabanına yazılıyor...");
              const inserted = await diabetesRepository.createMany(results);
              console.log(
                `${inserted.length} adet kayıt başarıyla veritabanına eklendi.`
              );
              resolve({ success: true, count: inserted.length });
            } catch (error) {
              console.error(
                "Veritabanına yazma sırasında bir hata oluştu:",
                error
              );
              reject(new Error("Veri yüklenirken veritabanı hatası oluştu."));
            }
          } else {
            console.log("Veritabanına yazılacak geçerli veri bulunamadı.");
            resolve({
              success: false,
              count: 0,
              message:
                "CSV dosyasında geçerli veri bulunamadı veya tüm satırlar atlandı.",
            });
          }
        })
        .on("error", (error) => {
          console.error("CSV dosyası okunurken hata oluştu:", error);
          reject(new Error("CSV dosyası okunurken bir hata oluştu."));
        });
    });
  }
}

module.exports = new DiabetesService();
