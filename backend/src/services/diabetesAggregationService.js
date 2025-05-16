// backend/src/services/diabetesAggregationService.js
const Diabetes = require("../models/Diabetes");

// --- VERİTABANINDAKİ GERÇEK ALAN ADLARI ---
const DB_FIELD_AGE = "Age";
const DB_FIELD_PREGNANCIES = "Pregnancies";
const DB_FIELD_GLUCOSE = "Glucose";
const DB_FIELD_BLOOD_PRESSURE = "BloodPressure (mg/dL)";
const DB_FIELD_SKIN_THICKNESS = "SkinThickness";
const DB_FIELD_INSULIN = "Insulin";
const DB_FIELD_BMI = "BMI";
const DB_FIELD_DPF = "DiabetesPedigreeFunction";

const getRiskCalculationStages = () => {
  return {
    // Bu objenin tamamı $cond yapısını içermeli
    $cond: {
      if: {
        $or: [
          { $gt: [`$${DB_FIELD_GLUCOSE}`, 160] },
          { $gt: [`$${DB_FIELD_BMI}`, 35] },
          {
            $and: [
              { $gt: [`$${DB_FIELD_GLUCOSE}`, 140] },
              { $gt: [`$${DB_FIELD_AGE}`, 50] },
            ],
          },
        ],
      },
      //Şart doğruysa -> then
      then: "Yüksek",
      else: {
        $cond: {
          if: {
            $or: [
              { $gt: [`$${DB_FIELD_GLUCOSE}`, 120] },
              { $gt: [`$${DB_FIELD_BMI}`, 30] },
              {
                $and: [
                  { $gt: [`$${DB_FIELD_GLUCOSE}`, 100] },
                  { $gt: [`$${DB_FIELD_AGE}`, 40] },
                ],
              },
            ],
          },
          then: "Orta",
          else: {
            $cond: {
              if: {
                // Geçerli veri kontrolü
                $and: [
                  { $gte: [`$${DB_FIELD_GLUCOSE}`, 0] },
                  { $ne: [`$${DB_FIELD_GLUCOSE}`, null] },
                  { $ne: [`$${DB_FIELD_GLUCOSE}`, undefined] },
                  { $gte: [`$${DB_FIELD_BMI}`, 0] },
                  { $ne: [`$${DB_FIELD_BMI}`, null] },
                  { $ne: [`$${DB_FIELD_BMI}`, undefined] },
                  { $gte: [`$${DB_FIELD_AGE}`, 0] },
                  { $ne: [`$${DB_FIELD_AGE}`, null] },
                  { $ne: [`$${DB_FIELD_AGE}`, undefined] },
                ],
              },
              then: "Düşük",
              else: "Bilinmiyor", // Eğer hiçbir koşul sağlanmazsa veya veri eksik/geçersizse
            },
          },
        },
      },
    },
  };
};

// === FACET ALT PIPELINE'LARI İÇİN YARDIMCI FONKSİYONLAR ===

const getGeneralStatsPipeline = () => [
  {
    $group: {
      _id: null, //gruplama anahtarı yok //TODO-> Daha farklı bir kullanım var mı? araştır
      totalPatients: { $sum: 1 },
      avgBMI: { $avg: `$${DB_FIELD_BMI}` },
      avgGlucose: { $avg: `$${DB_FIELD_GLUCOSE}` },
      avgPregnancies: { $avg: `$${DB_FIELD_PREGNANCIES}` },
      bloodPressureValues: { $push: `$${DB_FIELD_BLOOD_PRESSURE}` }, //Tüm kan basıncı değerlerini diziyie topladık.
    },
  },
  {
    //Kan basıncı verilerini almadan önce temizliyoruz
    $addFields: {
      validBPs: {
        $filter: {
          input: "$bloodPressureValues",
          as: "bp",
          cond: {
            $and: [
              { $ne: ["$$bp", null] },
              { $ne: ["$$bp", undefined] },
              { $gt: ["$$bp", 0] },
            ],
          },
        },
      },
    },
  },
  {
    //Sonuçları formatlayıp frontend e hazır hale getirme
    $project: {
      _id: 0,
      totalPatients: 1,
      //ortalamaları yuvarlamamız gerekiyor -> ondalolşo
      avgBMI: { $ifNull: [{ $round: ["$avgBMI", 1] }, "N/A"] },
      avgGlucose: { $ifNull: [{ $round: ["$avgGlucose", 1] }, "N/A"] },
      avgPregnancies: { $ifNull: [{ $round: ["$avgPregnancies", 1] }, "N/A"] },
      avgBloodPressure: {
        $cond: {
          if: { $gt: [{ $size: "$validBPs" }, 0] },
          then: { $round: [{ $avg: "$validBPs" }, 1] },
          else: "N/A",
        },
      },
    },
  },
];

//diyabet risk seviyelerlinin dağılımını hesapla
const getRiskDistributionPipeline = () => [
  { $group: { _id: "$CalculatedRiskLevel", count: { $sum: 1 } } },
  //çıktıyı label,value formatına dönüştürmek gerekiyor.-> frontend için
  { $project: { _id: 0, label: "$_id", value: "$count" } }, // 'value' olarak değiştirdik, frontend'de böyle bekliyor olabilir
  //Sonuçları hasta sayısına göre azalan sırayla sıralar
  { $sort: { value: -1 } },
];
//Bu sayede veri frontend e hazır hale geldi

//hastaların yaşlarını 10 yıllık aralıklara bölerek her aralıkta kaç hasta var hesapla
const getAgeDistributionPipeline = () => [
  { $match: { [DB_FIELD_AGE]: { $ne: null, $gte: 0 } } },
  {
    $bucket: {
      groupBy: `$${DB_FIELD_AGE}`,
      boundaries: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120],
      //sınırlara uymayan yaşlar
      default: "Other", // 120+ için
      //her aralık için sayaç gerekiyor
      output: { count: { $sum: 1 } },
    },
  },
  {
    $project: {
      _id: 0,
      label: {
        $cond: {
          if: { $eq: ["$_id", "Other"] },
          then: "120+", // Veya "Other" olarak bırakılabilir
          else: {
            //string yapıları yazdırma ör: 20-29
            $concat: [
              { $toString: "$_id" },
              "-",
              { $toString: { $add: ["$_id", 9] } },
            ],
          },
        },
      },
      data: "$count", // Frontend'deki formatDistribution'a uygun olması için
    },
  },
];

const getBmiDistributionPipeline = () => [
  { $match: { [DB_FIELD_BMI]: { $ne: null, $gte: 0 } } },
  {
    $bucket: {
      groupBy: `$${DB_FIELD_BMI}`,
      boundaries: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 1000], // Üst sınır yüksek tutuldu, default ile yakalanacak
      default: "50+", // 50 ve üzeri için
      output: { count: { $sum: 1 } },
    },
  },
  {
    $project: {
      _id: 0,
      label: {
        $cond: {
          if: { $eq: ["$_id", "50+"] },
          then: "50+",
          else: {
            $concat: [
              { $toString: "$_id" },
              "-",
              { $toString: { $add: ["$_id", 4.9] } },
            ],
          }, // 4.9 aralığı
        },
      },
      data: "$count",
    },
  },
];

//hastaların gebelik sayılarına göre dağılımını hesaplıyoruz
const getPregnancyDistributionPipeline = () => [
  { $match: { [DB_FIELD_PREGNANCIES]: { $ne: null, $gte: 0 } } },
  { $group: { _id: `$${DB_FIELD_PREGNANCIES}`, count: { $sum: 1 } } },
  { $project: { _id: 0, label: { $toString: "$_id" }, data: "$count" } },
  { $sort: { _id: 1 } }, // _id (sayısal gebelik sayısı) üzerinden sırala
];

//hastaların yaş ve glikoz seviyelerini alıp, bunları bir grafik için hazırlıyoruz
const getGlucoseAgeTrendPipeline = (sampleSize = null) => {
  const pipeline = [
    {
      $match: {
        [DB_FIELD_GLUCOSE]: { $ne: null, $gte: 0 },
        [DB_FIELD_AGE]: { $ne: null, $gte: 0 },
      },
    },
    { $project: { _id: 0, x: `$${DB_FIELD_AGE}`, y: `$${DB_FIELD_GLUCOSE}` } },
  ];
  //veriyi rastgele örnekleyerek küçültüyoruz.
  if (sampleSize && typeof sampleSize === "number" && sampleSize > 0) {
    pipeline.splice(1, 0, { $sample: { size: sampleSize } }); // $match'ten sonra $sample ekle
  }
  return pipeline;
};

//hastaların yaş ve kan basıncı verilerini çekip, bir nokta grafiği için hazırlıyoruz
const getBpAgeTrendPipeline = (sampleSize = null) => {
  const pipeline = [
    {
      $match: {
        [DB_FIELD_BLOOD_PRESSURE]: { $ne: null, $gt: 0 },
        [DB_FIELD_AGE]: { $ne: null, $gte: 0 },
      },
    },
    {
      $project: {
        _id: 0,
        x: `$${DB_FIELD_AGE}`,
        y: `$${DB_FIELD_BLOOD_PRESSURE}`,
      },
    },
  ];
  if (sampleSize && typeof sampleSize === "number" && sampleSize > 0) {
    pipeline.splice(1, 0, { $sample: { size: sampleSize } });
  }
  return pipeline;
};

const getCorrelationDataPipeline = (sampleSize = null) => {
  const pipeline = [
    {
      $match: {
        [DB_FIELD_GLUCOSE]: { $ne: null, $gt: 0 },
        [DB_FIELD_BMI]: { $ne: null, $gt: 0 },
      },
    },
    {
      $project: {
        _id: 0,
        x: `$${DB_FIELD_BMI}`,
        y: `$${DB_FIELD_GLUCOSE}`,
        risk: "$CalculatedRiskLevel",
      },
    },
  ];
  if (sampleSize && typeof sampleSize === "number" && sampleSize > 0) {
    pipeline.splice(1, 0, { $sample: { size: sampleSize } });
  }
  return pipeline;
};

const getAveragesByRiskPipeline = () => [
  { $match: { CalculatedRiskLevel: { $in: ["Yüksek", "Orta", "Düşük"] } } },
  {
    $group: {
      _id: "$CalculatedRiskLevel",
      avgGlucose: { $avg: `$${DB_FIELD_GLUCOSE}` },
      avgBMI: { $avg: `$${DB_FIELD_BMI}` },
      avgAge: { $avg: `$${DB_FIELD_AGE}` },
      bloodPressureValuesInGroup: { $push: `$${DB_FIELD_BLOOD_PRESSURE}` },
    },
  },
  {
    $addFields: {
      validBPsInGroup: {
        $filter: {
          input: "$bloodPressureValuesInGroup",
          as: "bpItem",
          cond: {
            $and: [
              { $ne: ["$$bpItem", null] },
              { $ne: ["$$bpItem", undefined] },
              { $gt: ["$$bpItem", 0] },
            ],
          },
        },
      },
    },
  },
  {
    $project: {
      _id: 0,
      riskLevel: "$_id",
      avgGlucose: { $ifNull: [{ $round: ["$avgGlucose", 1] }, 0] },
      avgBMI: { $ifNull: [{ $round: ["$avgBMI", 1] }, 0] },
      avgAge: { $ifNull: [{ $round: ["$avgAge", 1] }, 0] },
      avgBloodPressure: {
        $cond: {
          if: { $gt: [{ $size: "$validBPsInGroup" }, 0] },
          then: { $round: [{ $avg: "$validBPsInGroup" }, 1] },
          else: 0, // Veya "N/A"
        },
      },
    },
  },
  // Risk seviyelerini özel bir sıraya göre sıralamak için
  {
    $addFields: {
      sortOrder: {
        $switch: {
          branches: [
            { case: { $eq: ["$riskLevel", "Yüksek"] }, then: 1 },
            { case: { $eq: ["$riskLevel", "Orta"] }, then: 2 },
            { case: { $eq: ["$riskLevel", "Düşük"] }, then: 3 },
          ],
          default: 4, // Bilinmeyen veya diğerleri en sona
        },
      },
    },
  },
  { $sort: { sortOrder: 1 } },
  { $project: { sortOrder: 0 } }, // sortOrder alanını sonuçtan kaldır
];

// === ANA SERVİS SINIFI ===
class DiabetesAggregationService {
  async getDashboardData(filters = {}) {
    console.time("DiabetesAggregationService.getDashboardData_Total");
    console.log("AGG_SERVICE: getDashboardData çağrıldı, Filtreler:", filters);
    const { minAge, maxAge, riskLevel } = filters;

    const initialPipeline = [];
    initialPipeline.push({
      $addFields: { CalculatedRiskLevel: getRiskCalculationStages() },
    });

    const matchConditions = {};
    if (minAge !== undefined && minAge !== "")
      matchConditions[DB_FIELD_AGE] = {
        ...matchConditions[DB_FIELD_AGE],
        $gte: parseInt(minAge, 10),
      };
    if (maxAge !== undefined && maxAge !== "")
      matchConditions[DB_FIELD_AGE] = {
        ...matchConditions[DB_FIELD_AGE],
        $lte: parseInt(maxAge, 10),
      };
    if (riskLevel && riskLevel !== "All")
      matchConditions.CalculatedRiskLevel = riskLevel;

    if (Object.keys(matchConditions).length > 0) {
      initialPipeline.push({ $match: matchConditions });
    }
    console.log(
      "AGG_SERVICE: Initial Pipeline (Match sonrası):",
      JSON.stringify(initialPipeline, null, 2).substring(0, 1000) + "..."
    );

    // Örnekleme boyutu (çok fazla nokta içeren grafikler için)
    const TREND_SAMPLE_SIZE = 500; // Scatter plotlar için 500 nokta

    const facetPipeline = {
      generalStats: getGeneralStatsPipeline(),
      riskDistribution: getRiskDistributionPipeline(),
      ageDistribution: getAgeDistributionPipeline(),
      bmiDistribution: getBmiDistributionPipeline(),
      pregnancyDistribution: getPregnancyDistributionPipeline(),
      glucoseAgeTrend: getGlucoseAgeTrendPipeline(TREND_SAMPLE_SIZE),
      bpAgeTrend: getBpAgeTrendPipeline(TREND_SAMPLE_SIZE),
      correlationData: getCorrelationDataPipeline(TREND_SAMPLE_SIZE),
      averagesByRisk: getAveragesByRiskPipeline(),
    };

    initialPipeline.push({ $facet: facetPipeline });
    console.log("AGG_SERVICE: Full Facet Pipeline Oluşturuldu.");
    console.time("DiabetesAggregationService.MongoDB_Aggregate");

    try {
      const results = await Diabetes.aggregate(initialPipeline)
        .allowDiskUse(true) //veri seti belleği aşarsa diske yaz...
        .exec();
      console.timeEnd("DiabetesAggregationService.MongoDB_Aggregate");
      console.log(
        "AGG_SERVICE: Aggregation sonucu alındı (ilk eleman anahtarları):",
        results[0] ? Object.keys(results[0]) : "Boş sonuç"
      );

      if (!results || results.length === 0 || !results[0]) {
        console.warn("AGG_SERVICE: Aggregation boş sonuç döndürdü.");
        console.timeEnd("DiabetesAggregationService.getDashboardData_Total");
        return {
          /* ...boş yapı... */
        };
      }

      const rawData = results[0];
      console.time("DiabetesAggregationService.DataFormatting");

      // Frontend'in beklediği formata dönüştürme fonksiyonu
      const formatDistributionOutput = (distDataArray) => {
        if (!distDataArray || distDataArray.length === 0)
          return { labels: [], data: [] };
        return {
          labels: distDataArray.map((item) => String(item.label)), // Etiketleri stringe çevir
          data: distDataArray.map((item) => item.data),
        };
      };

      // averagesByRisk verisini frontend'in beklediği formata çevir
      const formattedAveragesByRisk = { labels: [], datasets: [] };
      if (rawData.averagesByRisk && rawData.averagesByRisk.length > 0) {
        formattedAveragesByRisk.labels = rawData.averagesByRisk.map(
          (item) => item.riskLevel
        );
        const keysInOrder = ["Glucose", "BMI", "Age", "BloodPressure"];
        const displayKeys = {
          Glucose: "Glikoz",
          BMI: "BMI",
          Age: "Yaş",
          BloodPressure: "Kan Basıncı",
        };
        const colors = [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ];
        const borderColors = [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ];

        keysInOrder.forEach((keyName, index) => {
          const backendKey = `avg${keyName}`;
          formattedAveragesByRisk.datasets.push({
            label: `Ort. ${displayKeys[keyName]}`,
            data: rawData.averagesByRisk.map((item) => item[backendKey] || 0),
            backgroundColor: colors[index % colors.length],
            borderColor: borderColors[index % borderColors.length],
            borderWidth: 1,
          });
        });
      }

      const finalData = {
        stats:
          rawData.generalStats && rawData.generalStats.length > 0
            ? rawData.generalStats[0]
            : { totalPatients: 0 },
        riskDistribution:
          rawData.riskDistribution && rawData.riskDistribution.length > 0
            ? {
                labels: rawData.riskDistribution.map((r) => r.label),
                data: rawData.riskDistribution.map((r) => r.value),
              }
            : { labels: [], data: [] },
        ageDistribution: formatDistributionOutput(rawData.ageDistribution),
        bmiDistribution: formatDistributionOutput(rawData.bmiDistribution),
        pregnancyDistribution: formatDistributionOutput(
          rawData.pregnancyDistribution
        ),
        glucoseAgeTrend: rawData.glucoseAgeTrend || [],
        bpAgeTrend: rawData.bpAgeTrend || [],
        correlationData: rawData.correlationData || [],
        averagesByRisk: formattedAveragesByRisk,
      };

      console.timeEnd("DiabetesAggregationService.DataFormatting");
      console.log(
        "AGG_SERVICE: Veri formatlama tamamlandı, geri döndürülüyor."
      );
      console.timeEnd("DiabetesAggregationService.getDashboardData_Total");
      return finalData;
    } catch (error) {
      console.timeEnd("DiabetesAggregationService.MongoDB_Aggregate");
      console.error("Aggregation Service Error:", error);
      if (error.errorResponse)
        console.error("MongoDB Error Response:", error.errorResponse);
      console.timeEnd("DiabetesAggregationService.getDashboardData_Total");
      throw new Error(
        "Dashboard verileri alınırken bir veritabanı hatası oluştu."
      );
    }
  }
}

module.exports = new DiabetesAggregationService();
