// frontend/src/utils/chartUtils.js

// Renk paletleri
export const riskColors = {
  Yüksek: "rgba(255, 99, 132, 0.7)", // Kırmızı
  Orta: "rgba(255, 206, 86, 0.7)", // Sarı
  Düşük: "rgba(75, 192, 192, 0.7)", // Yeşil
  Bilinmiyor: "rgba(153, 102, 255, 0.7)", // Mor
};

export const riskBorderColors = {
  Yüksek: "rgba(255, 99, 132, 1)",
  Orta: "rgba(255, 206, 86, 1)",
  Düşük: "rgba(75, 192, 192, 1)",
  Bilinmiyor: "rgba(153, 102, 255, 1)",
};

export const glucoseColor = "rgba(255, 99, 132, 0.6)"; // Kırmızı tonu
export const glucoseBorderColor = "rgba(255, 99, 132, 1)";
export const bpColor = "rgba(54, 162, 235, 0.6)"; // Mavi tonu
export const bpBorderColor = "rgba(54, 162, 235, 1)";

// Genel Chart.js seçenekleri
export const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: false, // Daha esnek boyutlandırma için
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      // Tooltip içeriğini özelleştirebiliriz
    },
  },
};

// Scatter plot için özel seçenekler
export const getScatterOptions = (xAxisLabel, yAxisLabel, titleText = "") => ({
  ...commonChartOptions,
  scales: {
    x: {
      title: { display: true, text: xAxisLabel },
      grid: { display: false }, // X ekseni grid çizgilerini kaldır (isteğe bağlı)
    },
    y: {
      title: { display: true, text: yAxisLabel },
      beginAtZero: true, // Y ekseni 0'dan başlasın
    },
  },
  plugins: {
    ...commonChartOptions.plugins, // Ortak pluginleri al
    title: {
      display: !!titleText, // Başlık metni varsa göster
      text: titleText,
      padding: { bottom: 10 },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (context.parsed.y !== null) {
            label += `(${context.parsed.x}, ${context.parsed.y.toFixed(1)})`;
            // Korelasyon için risk ekle
            if (context.raw?.risk) {
              label += ` - Risk: ${context.raw.risk}`;
            }
          }
          return label;
        },
      },
    },
  },
});

// Pie chart için özel seçenekler
export const getPieOptions = (titleText = "") => ({
  ...commonChartOptions,
  plugins: {
    ...commonChartOptions.plugins,
    title: {
      display: !!titleText,
      text: titleText,
      padding: { bottom: 10 },
    },
    tooltip: {
      callbacks: {
        // Yüzde göstermek için
        label: function (context) {
          let label = context.label || "";
          let value = context.parsed || 0;
          let total = context.chart.getDatasetMeta(0).total || 1;
          let percentage = ((value / total) * 100).toFixed(1) + "%";
          return `${label}: ${value} (${percentage})`;
        },
      },
    },
  },
});
