// frontend/src/components/dashboard/charts/GroupedAverageBarChart.jsx
import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { commonChartOptions } from "../../../utils/chartUtils";

const GroupedAverageBarChart = ({
  chartData, // Bu prop backend'den { labels: [], datasets: [] } olarak gelecek
  title = "Risk Gruplarına Göre Ortalama Metrikler", // ChartCard'dan gelen başlığa ek olarak
  yAxisLabel = "Ortalama Değer",
}) => {
  // Gelen veri zaten Chart.js formatında olduğu için doğrudan kullanılabilir
  const dataForRender = useMemo(() => {
    if (
      !chartData ||
      !chartData.labels ||
      chartData.labels.length === 0 ||
      !chartData.datasets ||
      chartData.datasets.length === 0 ||
      !chartData.datasets.every((ds) => ds.data && ds.data.length > 0) // Her dataset'te veri olduğundan emin ol
    ) {
      return null;
    }
    return chartData;
  }, [chartData]);

  if (!dataForRender) return null;

  const options = {
    ...commonChartOptions,
    scales: {
      x: {
        title: { display: true, text: "Risk Grubu" },
        grid: { display: false },
      },
      y: {
        title: { display: true, text: yAxisLabel },
        beginAtZero: true,
      },
    },
    plugins: {
      ...commonChartOptions.plugins,
      title: {
        display: !!title, // Grafik içi başlık (ChartCard'dan gelen başlığa ek)
        text: title,
        padding: { bottom: 15 },
      },
      legend: {
        position: "bottom", // Lejantı alta alalım
      },
    },
  };

  return <Bar data={dataForRender} options={options} />;
};

export default GroupedAverageBarChart;
