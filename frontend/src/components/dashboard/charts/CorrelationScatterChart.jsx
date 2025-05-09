// frontend/src/components/dashboard/charts/CorrelationScatterChart.jsx
import React, { useMemo } from "react";
import { Scatter } from "react-chartjs-2";
import {
  getScatterOptions,
  riskColors,
  riskBorderColors,
} from "../../../utils/chartUtils";

const CorrelationScatterChart = ({ correlationData }) => {
  const chartData = useMemo(() => {
    if (!correlationData || correlationData.length === 0) return null;

    return {
      datasets: [
        {
          label: "Glikoz vs BMI (Risk)", // Lejantta görünmeyecek ama tooltip için iyi
          data: correlationData, // { x: BMI, y: Glucose, risk: RiskLevel } formatında
          pointBackgroundColor: (ctx) =>
            riskColors[ctx.raw?.risk] || "rgba(201, 203, 207, 0.7)",
          pointBorderColor: (ctx) =>
            riskBorderColors[ctx.raw?.risk] || "rgba(201, 203, 207, 1)",
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };
  }, [correlationData]);

  if (!chartData) return null;

  // Korelasyon grafiğinde lejantı gizleyebiliriz çünkü renkler noktaların kendisinde anlamlı
  const options = {
    ...getScatterOptions(
      "BMI (Vücut Kitle İndeksi)",
      "Glikoz Seviyesi",
      "Glikoz ve BMI Korelasyonu"
    ),
    plugins: {
      ...getScatterOptions().plugins, // getScatterOptions'dan tooltip vs. al
      legend: { display: false }, // Lejantı gizle
    },
  };

  return <Scatter data={chartData} options={options} />;
};

export default CorrelationScatterChart;
