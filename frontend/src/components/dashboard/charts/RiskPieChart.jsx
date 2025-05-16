// frontend/src/components/dashboard/charts/RiskPieChart.jsx
import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import {
  getPieOptions,
  riskColors,
  riskBorderColors,
} from "../../../utils/chartUtils";

const RiskPieChart = ({ distributionData }) => {
  // Prop adı distributionData olarak kalabilir
  const chartDataForRender = useMemo(() => {
    // distributionData { labels: [], data: [] } formatında gelmeli
    if (
      !distributionData ||
      !distributionData.labels ||
      distributionData.labels.length === 0 ||
      !distributionData.data ||
      distributionData.data.length === 0
    ) {
      return null;
    }

    const backgroundColors = distributionData.labels.map(
      (label) => riskColors[label] || "rgba(201, 203, 207, 0.7)"
    );
    const borderColors = distributionData.labels.map(
      (label) => riskBorderColors[label] || "rgba(201, 203, 207, 1)"
    );

    return {
      labels: distributionData.labels,
      datasets: [
        {
          label: "Hasta Sayısı", // Lejant için
          data: distributionData.data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    };
  }, [distributionData]);

  if (!chartDataForRender) return null;

  const options = getPieOptions("Diyabet Risk Segmentasyonu"); // Grafik başlığı

  return <Pie data={chartDataForRender} options={options} />;
};

export default RiskPieChart;
