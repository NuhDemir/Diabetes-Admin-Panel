// frontend/src/utils/chartUtils.js

// Renk paletleri (Bunlar performansı doğrudan etkilemez, olduğu gibi kalabilir)
export const riskColors = {
  Yüksek: "rgba(255, 99, 132, 0.7)", // Kırmızı
  Orta: "rgba(255, 206, 86, 0.7)", // Sarı
  Düşük: "rgba(75, 192, 192, 0.7)", // Yeşil
  Bilinmiyor: "rgba(153, 102, 255, 0.7)", // Mor
};
export const riskBorderColors = {
  /* ... (önceki gibi) ... */
};
export const glucoseColor = "rgba(255, 99, 132, 0.6)";
export const glucoseBorderColor = "rgba(255, 99, 132, 1)";
export const bpColor = "rgba(54, 162, 235, 0.6)";
export const bpBorderColor = "rgba(54, 162, 235, 1)";

// === PERFORMANS ODAKLI GENEL CHART.JS SEÇENEKLERİ ===
export const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  // --- Animasyonları Varsayılan Olarak Kapat ---
  animation: {
    duration: 0, // Ana animasyon süresini 0 yap
  },
  hover: {
    animationDuration: 0, // Fare üzerine gelme animasyonunu kapat
  },
  responsiveAnimationDuration: 0, // Pencere yeniden boyutlandırma animasyonunu kapat

  plugins: {
    legend: {
      position: "top",
      labels: {
        // Lejant etiketlerinin oluşturulmasını optimize etmek için
        // (çok fazla etiket yoksa büyük bir fark yaratmaz)
        // usePointStyle: true, // Kare yerine nokta kullanabilir (daha az çizim)
      },
    },
    tooltip: {
      enabled: true, // Tooltip'leri tamamen kapatmak da bir seçenek (eğer gerekmiyorsa)
      // interaction: { // Tooltip tetikleme modunu optimize et (isteğe bağlı)
      //   mode: 'nearest', // En yakın noktayı bul
      //   axis: 'x',       // Sadece x ekseninde ara
      //   intersect: false // Kesin kesişim gerekmesin
      // },
      // backgroundColor: 'rgba(0,0,0,0.7)', // Tooltip arka planı
      // titleFont: { size: 12 },
      // bodyFont: { size: 11 },
    },
    // Decimation plugin'i (eğer veri noktası çok fazlaysa, veri hazırlama aşamasında da yapılabilir)
    // Bu, Chart.js'e doğrudan eklenecek bir plugin değil, konfigürasyon seçeneğidir.
    // Bu örnek için doğrudan bir ayar eklemiyorum, çünkü veri setine bağlı.
    // documentation: https://www.chartjs.org/docs/latest/configuration/decimation.html
  },
  // === Ölçek (Scale) Optimizasyonları ===
  // Tüm grafiklerde ortak olmayabilir, bu yüzden getScatterOptions ve getPieOptions içinde
  // daha spesifik olarak ele alınabilir.
  // scales: {
  //   x: {
  //     ticks: {
  //       autoSkip: true, // Etiketleri otomatik atla (kalabalıklığı önler)
  //       maxTicksLimit: 10, // X ekseninde maksimum etiket sayısı (performansı artırır)
  //     }
  //   },
  //   y: {
  //     ticks: {
  //       autoSkip: true,
  //       maxTicksLimit: 8, // Y ekseninde maksimum etiket sayısı
  //     }
  //   }
  // }
  elements: {
    line: {
      tension: 0.1, // Çizgi yumuşaklığını azalt (daha az hesaplama) (0 düz çizgi)
      borderWidth: 2, // Çizgi kalınlığı
    },
    point: {
      radius: 3, // Nokta yarıçapı (küçükse daha az çizim)
      hoverRadius: 5,
    },
    bar: {
      // barThickness: 'flex', // Bar kalınlığı
      // maxBarThickness: 25, // Maksimum bar kalınlığı
    },
  },
};

// === SCATTER PLOT İÇİN ÖZEL SEÇENEKLER (Performans Ayarlarıyla) ===
export const getScatterOptions = (xAxisLabel, yAxisLabel, titleText = "") => ({
  ...commonChartOptions, // Genel performans ayarlarını miras al
  scales: {
    x: {
      type: "linear", // Scatter için genellikle linear scale
      title: { display: true, text: xAxisLabel, font: { weight: "500" } },
      grid: { display: false },
      ticks: {
        autoSkip: true,
        maxTicksLimit: 10, // X ekseninde gösterilecek maksimum etiket sayısı
        // stepSize: 10 // Veya sabit adım boyutu (veriye göre)
      },
    },
    y: {
      title: { display: true, text: yAxisLabel, font: { weight: "500" } },
      beginAtZero: true,
      grid: {
        // color: 'rgba(0, 0, 0, 0.05)', // Grid çizgilerini daha soluk yap
      },
      ticks: {
        autoSkip: true,
        maxTicksLimit: 8, // Y ekseninde gösterilecek maksimum etiket sayısı
        // stepSize: 20 // Veya sabit adım boyutu
      },
    },
  },
  plugins: {
    ...commonChartOptions.plugins, // Tooltip vb. miras al
    title: {
      display: !!titleText,
      text: titleText,
      padding: { bottom: 15 }, // Başlık altı boşluk
      font: { size: 14, weight: "600" }, // Başlık fontu
    },
    tooltip: {
      // Scatter için tooltip'i özelleştirelim
      ...commonChartOptions.plugins.tooltip, // Ortak ayarları al
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (
            context.parsed?.x !== undefined &&
            context.parsed?.y !== undefined
          ) {
            label += `(${context.parsed.x.toFixed(
              1
            )}, ${context.parsed.y.toFixed(1)})`;
            if (context.raw?.risk) {
              // 'raw' veriye erişim (korelasyon grafiği için)
              label += ` - Risk: ${context.raw.risk}`;
            }
          } else {
            label += "Veri yok";
          }
          return label;
        },
      },
    },
  },
  elements: {
    // Scatter için nokta boyutunu özellikle ayarlayalım
    ...commonChartOptions.elements,
    point: {
      radius: 4, // Biraz daha belirgin ama çok büyük değil
      hoverRadius: 6,
      // backgroundColor: 'rgba(0,0,0,0.1)' // Çok fazla nokta varsa transparan yap
    },
  },
});

// === PIE CHART İÇİN ÖZEL SEÇENEKLER (Performans Ayarlarıyla) ===
export const getPieOptions = (titleText = "") => ({
  ...commonChartOptions, // Genel performans ayarlarını miras al
  plugins: {
    ...commonChartOptions.plugins, // Tooltip vb. miras al
    title: {
      display: !!titleText,
      text: titleText,
      padding: { bottom: 15 },
      font: { size: 14, weight: "600" },
    },
    tooltip: {
      // Pie chart için tooltip'i özelleştirelim
      ...commonChartOptions.plugins.tooltip,
      callbacks: {
        label: function (context) {
          const label = context.label || "";
          const value = context.parsed || 0;
          // Toplamı almak için datasetMeta.total kullanmak daha güvenilir
          const total =
            context.chart.getDatasetMeta(context.datasetIndex).total || 1;
          const percentage =
            total > 0 ? ((value / total) * 100).toFixed(1) + "%" : "0%";
          return `${label}: ${value} (${percentage})`;
        },
      },
    },
    legend: {
      // Pie chart için lejant konumu ve stili
      ...commonChartOptions.plugins.legend,
      position: "bottom", // Alta almak daha iyi olabilir
      labels: {
        padding: 15, // Etiketler arası boşluk
        // usePointStyle: true,
      },
    },
  },
  // Pie chart için element ayarları (örn: arc border)
  // elements: {
  //   arc: {
  //     borderWidth: 1,
  //     // borderColor: '#fff'
  //   }
  // }
});
