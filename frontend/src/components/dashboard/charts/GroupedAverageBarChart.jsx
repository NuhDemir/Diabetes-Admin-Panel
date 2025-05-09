// frontend/src/components/dashboard/charts/GroupedAverageBarChart.jsx
import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { commonChartOptions } from "../../../utils/chartUtils";

const GroupedAverageBarChart = ({
  chartData,
  title,
  yAxisLabel = "Ortalama Değer",
}) => {
  // Veri formatı zaten Chart.js'e uygun geldiği için useMemo'ya çok gerek yok ama tutarlılık için kalabilir
  const data = useMemo(() => {
    if (
      !chartData ||
      !chartData.labels ||
      chartData.labels.length === 0 ||
      !chartData.datasets ||
      chartData.datasets.length === 0
    ) {
      return null;
    }
    return chartData;
  }, [chartData]);

  if (!data) return null;

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
        display: true,
        text: title,
        padding: { bottom: 15 },
      },
      legend: {
        position: "bottom", // Lejantı alta alalım
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default GroupedAverageBarChart;
