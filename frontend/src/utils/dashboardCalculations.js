// frontend/src/utils/dashboardCalculations.js

/**
 * Filtrelenmiş hasta verilerinden genel istatistikleri hesaplar.
 * @param {Array<object>} filteredData - Filtrelenmiş hasta verileri dizisi.
 * @returns {object} - Hesaplanan istatistikler.
 */

const BLOOD_PRESSURE_KEY = "BloodPressure";
export const calculateGeneralStats = (filteredData) => {
  const count = filteredData.length;
  if (count === 0) {
    return {
      totalPatients: 0,
      avgBMI: "N/A",
      avgGlucose: "N/A",
      avgPregnancies: "N/A",
      avgBloodPressure: "N/A",
    };
  }

  const sumBMI = filteredData.reduce((sum, p) => sum + (p.BMI || 0), 0);
  const sumGlucose = filteredData.reduce((sum, p) => sum + (p.Glucose || 0), 0);
  const sumPregnancies = filteredData.reduce(
    (sum, p) => sum + (p.Pregnancies || 0),
    0
  );

  // Kan basıncı 0 olanları ortalamaya katma
  const validBPs = filteredData.filter((p) => p[BLOOD_PRESSURE_KEY] > 0);
  const sumBloodPressure = validBPs.reduce(
    (sum, p) => sum + p[BLOOD_PRESSURE_KEY], // Doğru anahtar
    0
  );

  return {
    totalPatients: count,
    avgBMI: (sumBMI / count).toFixed(1),
    avgGlucose: (sumGlucose / count).toFixed(1),
    avgPregnancies: (sumPregnancies / count).toFixed(1),
    avgBloodPressure:
      validBPs.length > 0
        ? (sumBloodPressure / validBPs.length).toFixed(1)
        : "N/A",
  };
};

/**
 * Risk seviyelerine göre hasta dağılımını hesaplar.
 * @param {Array<object>} filteredData - Filtrelenmiş hasta verileri.
 * @returns {object} - Pasta grafiği için veri ({ labels, data }).
 */
export const calculateRiskDistribution = (filteredData) => {
  const counts = { Yüksek: 0, Orta: 0, Düşük: 0, Bilinmiyor: 0 };
  filteredData.forEach((p) => {
    // RiskLevel null veya undefined ise 'Bilinmiyor' grubuna ekleyelim
    const riskLevel = p.RiskLevel || "Bilinmiyor";
    counts[riskLevel] = (counts[riskLevel] || 0) + 1;
  });

  // Sadece 0'dan büyük değere sahip risk seviyelerini al
  const labels = Object.keys(counts).filter((key) => counts[key] > 0);
  const data = labels.map((key) => counts[key]);

  return { labels, data };
};

/**
 * Yaşa göre trend analizi için scatter plot verisi hazırlar.
 * @param {Array<object>} filteredData - Filtrelenmiş hasta verileri.
 * @param {string} valueKey - Değeri alınacak alan adı (örn: 'Glucose', 'BloodPressure').
 * @returns {Array<object>} - Scatter plot için uygun veri noktaları [{ x: Age, y: value }].
 */
export const prepareAgeTrendData = (filteredData, valueKey) => {
  // valueKey alanı olmayan veya null olanları filtrele
  const validData = filteredData.filter(
    (p) =>
      p[valueKey] !== undefined && p[valueKey] !== null && !isNaN(p[valueKey])
  );

  // Kan basıncı için doğru anahtarı kullan ve > 0 kontrolü
  const dataToUse =
    valueKey === BLOOD_PRESSURE_KEY // Doğru anahtar ile karşılaştır
      ? validData.filter((p) => p[valueKey] > 0)
      : validData;

  return dataToUse.map((p) => ({
    x: p.Age,
    y: p[valueKey],
  }));
};

/**
 * Glikoz ve BMI korelasyonu için scatter plot verisi hazırlar.
 * @param {Array<object>} filteredData - Filtrelenmiş hasta verileri.
 * @returns {Array<object>} - Scatter plot için uygun veri noktaları [{ x: BMI, y: Glucose, risk: RiskLevel }].
 */
export const prepareCorrelationData = (filteredData) => {
  // BMI veya Glikoz değeri null, undefined, NaN veya 0'dan küçük/eşit olanları filtrele
  const validData = filteredData.filter(
    (p) =>
      p.BMI !== undefined &&
      p.BMI !== null &&
      !isNaN(p.BMI) &&
      p.BMI > 0 &&
      p.Glucose !== undefined &&
      p.Glucose !== null &&
      !isNaN(p.Glucose) &&
      p.Glucose > 0
  );
  return validData.map((p) => ({
    x: p.BMI,
    y: p.Glucose,
    risk: p.RiskLevel || "Bilinmiyor", // RiskLevel yoksa Bilinmiyor ata
  }));
};

// ----- BURADAN SONRASI EKSİK OLAN FONKSİYONLAR -----

/**
 * Belirli bir aralığa göre sayısal bir alanın dağılımını hesaplar (Histogram benzeri).
 * @param {Array<object>} data - Veri dizisi.
 * @param {string} key - Dağılımı hesaplanacak alan adı (örn: 'Age', 'BMI').
 * @param {number} step - Aralık boyutu (örn: yaş için 10, BMI için 5).
 * @param {number} maxValOverride - (İsteğe bağlı) Görüntülenecek maksimum değer.
 * @returns {object} - Bar grafiği için veri ({ labels, data }).
 */
export const calculateDistributionByRange = (
  data,
  key,
  step,
  maxValOverride = null
) => {
  if (!data || data.length === 0) return { labels: [], data: [] };

  const validData = data.filter(
    (p) =>
      p[key] !== undefined && p[key] !== null && !isNaN(p[key]) && p[key] >= 0
  ); // Geçerli verileri al (0 dahil)
  if (validData.length === 0) return { labels: [], data: [] };

  // En yüksek değeri bulurken 0'ı da hesaba katalım, ama aralıklar için >0 mantığı kalabilir
  const numericValues = validData.map((p) => p[key]);
  const maxValue =
    maxValOverride ||
    (numericValues.length > 0 ? Math.max(...numericValues) : 0);

  // Eğer max değer 0 ise sadece '0' etiketi olsun
  if (
    maxValue === 0 &&
    numericValues.length > 0 &&
    numericValues.every((v) => v === 0)
  ) {
    return { labels: ["0"], data: [numericValues.length] };
  }
  // Eğer max değer step'den küçükse, sadece bir aralık (0-step-1) yeterli olabilir
  if (maxValue < step) {
    const label = `0-${step - 1}`;
    return { labels: [label], data: [validData.length] };
  }

  const ranges = {};
  const labels = [];
  const effectiveMax = Math.ceil(maxValue / step) * step; // Max değeri step'in katına yuvarla

  // Aralıkları oluştur
  for (let i = 0; i <= effectiveMax; i += step) {
    // Sadece maxValOverride'a kadar olan etiketleri ekle (eğer varsa)
    if (maxValOverride !== null && i > maxValOverride) break;

    const lowerBound = i;
    const upperBound = i + step - 1;
    // Son aralık etiketini ayarla (eğer maxValOverride yoksa veya override'dan küçük/eşitse)
    const isPotentiallyLast = i + step > effectiveMax;
    const label =
      isPotentiallyLast && (maxValOverride === null || i <= maxValOverride)
        ? `${lowerBound}+`
        : `${lowerBound}-${upperBound}`;

    labels.push(label);
    // ranges için üst sınır bir sonraki aralığın başlangıcıdır (exclusive)
    ranges[label] = { count: 0, lower: lowerBound, upper: i + step };

    // Eğer bu aralık maxValOverride'ı içeriyorsa veya son aralıksa ve override yoksa dur
    if (
      (maxValOverride !== null && lowerBound >= maxValOverride) ||
      (maxValOverride === null && isPotentiallyLast)
    )
      break;
  }

  // Eğer labels boşsa (maxValue 0 veya negatifse)
  if (labels.length === 0 && validData.length > 0) {
    // Bu durumun olmaması lazım ama garantiye alalım
    return { labels: ["0"], data: [validData.length] };
  } else if (labels.length === 0) {
    return { labels: [], data: [] };
  }

  // Verileri aralıklara göre say
  validData.forEach((p) => {
    const value = p[key];
    for (let j = 0; j < labels.length; j++) {
      const label = labels[j];
      const range = ranges[label];
      const isLastRangeLabel = label.endsWith("+");

      // Son etiket kontrolü ('+') veya sondan bir önceki aralığın son etiketi mi
      const isEffectivelyLastRange =
        isLastRangeLabel || j === labels.length - 1;

      if (isEffectivelyLastRange && value >= range.lower) {
        range.count++;
        break;
      } else if (
        !isEffectivelyLastRange &&
        value >= range.lower &&
        value < range.upper
      ) {
        range.count++;
        break; // Bir aralığa aitse diğerlerine bakma
      }
    }
  });

  // Chart.js için veri formatını oluştur
  const chartData = labels.map((label) => ranges[label]?.count || 0);

  return { labels, data: chartData };
};

/**
 * Risk gruplarına göre belirtilen alanların ortalamalarını hesaplar.
 * @param {Array<object>} filteredData - Filtrelenmiş hasta verileri.
 * @param {Array<string>} keysToAverage - Ortalaması alınacak alan adları (örn: ['Glucose', 'BMI']).
 * @returns {object} - Gruplandırılmış bar grafiği için veri.
 */
export const calculateAveragesByRiskGroup = (filteredData, keysToAverage) => {
  const groups = { Yüksek: [], Orta: [], Düşük: [] }; // 'Bilinmiyor' hariç

  // Verileri risk gruplarına ayır
  filteredData.forEach((p) => {
    if (groups[p.RiskLevel]) {
      // Sadece Yüksek, Orta, Düşük olanları al
      groups[p.RiskLevel].push(p);
    }
  });

  const labels = Object.keys(groups); // Risk grupları (Yüksek, Orta, Düşük)
  const datasets = keysToAverage.map((key, index) => {
    // Her risk grubu için bu key'in ortalamasını hesapla
    const avgData = labels.map((riskLevel) => {
      const groupData = groups[riskLevel];
      if (!groupData || groupData.length === 0) return 0; // Grup boşsa ortalama 0

      // Geçerli değerleri filtrele (undefined, null, NaN olmayan ve BP>0 ise)
      const validValues = groupData
        .map((p) => p[key])
        .filter(
          (v) =>
            v !== undefined &&
            v !== null &&
            !isNaN(v) &&
            (key !== "BloodPressure" || v > 0)
        );

      if (validValues.length === 0) return 0; // Geçerli değer yoksa ortalama 0

      const sum = validValues.reduce((acc, val) => acc + val, 0);
      return parseFloat((sum / validValues.length).toFixed(1)); // Ondalıklı ortalama
    });

    // Grafik için dataset oluştur
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

    return {
      label: `Ort. ${key}`, // Örn: Ort. Glikoz
      data: avgData,
      backgroundColor: colors[index % colors.length],
      borderColor: borderColors[index % borderColors.length],
      borderWidth: 1,
    };
  });

  return { labels, datasets };
};

/**
 * Gebelik sayısı dağılımını hesaplar.
 * @param {Array<object>} data - Veri dizisi.
 * @returns {object} - Bar grafiği için veri ({ labels, data }).
 */
export const calculatePregnancyDistribution = (data) => {
  if (!data || data.length === 0) return { labels: [], data: [] };

  const counts = {};
  let maxPregnancy = 0;
  // Sadece geçerli (0 veya pozitif tamsayı) gebelik sayılarını al
  const validPregnancies = data
    .map((p) => p.Pregnancies)
    .filter(
      (p) =>
        p !== undefined &&
        p !== null &&
        !isNaN(p) &&
        Number.isInteger(p) &&
        p >= 0
    );

  if (validPregnancies.length === 0) return { labels: [], data: [] };

  validPregnancies.forEach((pregnancies) => {
    counts[pregnancies] = (counts[pregnancies] || 0) + 1;
    if (pregnancies > maxPregnancy) maxPregnancy = pregnancies;
  });

  // Etiketleri 0'dan bulunan maksimum gebelik sayısına kadar oluştur
  const labels = Array.from({ length: maxPregnancy + 1 }, (_, i) => String(i));
  // Her etiket için sayıyı al (yoksa 0)
  const chartData = labels.map((label) => counts[parseInt(label, 10)] || 0);

  return { labels, data: chartData };
};

export { BLOOD_PRESSURE_KEY };
