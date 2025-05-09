// frontend/src/components/dashboard/charts/DistributionBarChart.jsx

import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
// Renkleri ve opsiyonları utils'den alalım
import {
  glucoseColor,
  glucoseBorderColor,
  bpColor,
  bpBorderColor,
} from "../../../utils/chartUtils";

// --- ÖNEMLİ: Prop olarak title='' şeklinde varsayılan değer atamak iyi bir pratiktir ---
const DistributionBarChart = ({
  chartData,
  title = "",

  yAxisLabel = "Hasta Sayısı",
}) => {
  const data = useMemo(() => {
    if (!chartData || !chartData.labels || chartData.labels.length === 0)
      return null;

    let bgColor = bpColor; // Varsayılan renk (örn: mavi)
    let brdrColor = bpBorderColor;

    // --- GÜVENLİ KONTROL EKLENDİ ---
    // title prop'u varsa ve string ise işlem yap, yoksa varsayılan renkler kalsın.
    // Optional Chaining (?.) ve Nullish Coalescing (??) kullanarak daha güvenli hale getirelim:
    const lowerCaseTitle = title?.toLowerCase() ?? ""; // Eğer title null veya undefined ise boş string ata

    if (lowerCaseTitle.includes("bmi")) {
      // Şimdi lowerCaseTitle üzerinde güvenle çalışabiliriz
      bgColor = glucoseColor; // BMI için farklı renk (örn: kırmızı)
      brdrColor = glucoseBorderColor;
    } else if (lowerCaseTitle.includes("gebelik")) {
      bgColor = "rgba(75, 192, 192, 0.6)"; // Yeşil tonu
      brdrColor = "rgba(75, 192, 192, 1)";
    }
    // Yaş için varsayılan bpColor (mavi) kullanılacak.

    return {
      labels: chartData.labels,
      datasets: [
        {
          label: yAxisLabel,
          data: chartData.data,
          backgroundColor: bgColor,
          borderColor: brdrColor,
          borderWidth: 1,
        },
      ],
    };
  }, [chartData, title, yAxisLabel]); // Bağımlılıklar

  if (!data) return null; // Eğer hesaplanan data null ise hiçbir şey render etme

  // ... (options ve return Bar kısmı aynı)
  const options = {
    // ... (options objesi) ...
    plugins: {
      // ...
      title: {
        display: !!title, // Başlık varsa göster
        text: title,
        // ...
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default DistributionBarChart;
