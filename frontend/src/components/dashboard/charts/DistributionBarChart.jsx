// frontend/src/components/dashboard/charts/DistributionBarChart.jsx
import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  commonChartOptions,
  glucoseColor,
  glucoseBorderColor,
  bpColor,
  bpBorderColor,
} from "../../../utils/chartUtils";

const DistributionBarChart = ({
  chartData, // Bu artık { labels: [...], data: [...] } şeklinde bir obje
  title = "",
  xAxisLabel = "Aralık",
  yAxisLabel = "Hasta Sayısı",
}) => {
  const dataForRender = useMemo(() => {
    // chartData bir obje ve içinde labels ve data dizileri olmalı
    // chartData.data, sayıları içeren dizi (eski counts)
    // chartData.labels, etiketleri içeren dizi
    if (
      !chartData ||
      !chartData.labels ||
      !chartData.data ||
      chartData.labels.length === 0 ||
      chartData.data.length === 0
    ) {
      return null;
    }

    // Backend'den gelen formatı doğrudan kullanabiliriz
    const labels = chartData.labels;
    const counts = chartData.data; // Bu artık doğrudan sayı dizisi

    let bgColor = bpColor; // Varsayılan renk
    let brdrColor = bpBorderColor;

    // Grafik içi başlık (opsiyonel), ChartCard başlığına ek olarak.
    // title prop'u DistributionBarChart'a ChartCard'dan gelmiyor,
    // dolayısıyla bu title, bu bileşene özel bir iç başlık olabilir veya kaldırılabilir.
    // Eğer ChartCard'daki title'a göre renk değişimi isteniyorsa, bu title prop'u
    // DiabetesDashboardPage'den buraya kadar taşınmalı.
    // Şimdilik, bu bileşene özel bir title prop'u olmadığını varsayarak basitleştirelim
    // ve renk seçimini daha genel bir yolla yapalım veya kaldıralım.
    // Veya, ChartCard'ın title'ını buraya prop olarak geçirelim.
    // Bu örnekte, bu iç title'ı kullanmaya devam edelim, ama ChartCard'dan gelmeli.

    const lowerCaseInternalTitle = title?.toLowerCase() ?? "";

    if (lowerCaseInternalTitle.includes("bmi")) {
      bgColor = glucoseColor;
      brdrColor = glucoseBorderColor;
    } else if (lowerCaseInternalTitle.includes("gebelik")) {
      bgColor = "rgba(75, 192, 192, 0.6)";
      brdrColor = "rgba(75, 192, 192, 1)";
    } else if (
      lowerCaseInternalTitle.includes("yaş") ||
      lowerCaseInternalTitle.includes("age")
    ) {
      // Yaş için varsayılan bpColor/mavi kalabilir veya farklı bir renk atanabilir.
      // Örneğin:
      // bgColor = "rgba(153, 102, 255, 0.6)"; // Mor
      // brdrColor = "rgba(153, 102, 255, 1)";
    }

    return {
      labels: labels,
      datasets: [
        {
          label: yAxisLabel,
          data: counts,
          backgroundColor: bgColor,
          borderColor: brdrColor,
          borderWidth: 1,
        },
      ],
    };
  }, [chartData, title, yAxisLabel]); // title prop'u da bağımlılıklara eklendi

  if (!dataForRender) return null;

  const options = {
    ...commonChartOptions,
    scales: {
      x: {
        title: { display: true, text: xAxisLabel },
        grid: { display: false },
      },
      y: {
        title: { display: true, text: yAxisLabel },
        beginAtZero: true,
      },
    },
    plugins: {
      ...commonChartOptions.plugins,
      legend: {
        display: false, // Genellikle dağılım bar chart'larında tek dataset olur, lejant gereksiz.
      },
      title: {
        display: !!title, // Eğer bu bileşene bir title prop'u geçersek göster
        text: title,
        padding: { bottom: 10 },
      },
    },
  };

  return <Bar data={dataForRender} options={options} />;
};

export default DistributionBarChart;
