// frontend/src/components/dashboard/charts/RiskPieChart.jsx
import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import {
  getPieOptions,
  riskColors,
  riskBorderColors,
} from "../../../utils/chartUtils";

const RiskPieChart = ({ distributionData }) => {
  // Grafik için veriyi useMemo ile hazırla
  const chartData = useMemo(() => {
    if (
      !distributionData ||
      !distributionData.labels ||
      distributionData.labels.length === 0
    ) {
      return null; // Veri yoksa null döndür
    }
    // Renkleri etiketlere göre eşleştir
    const backgroundColors = distributionData.labels.map(
      (label) => riskColors[label] || "rgba(201, 203, 207, 0.7)"
    ); // Varsayılan gri
    const borderColors = distributionData.labels.map(
      (label) => riskBorderColors[label] || "rgba(201, 203, 207, 1)"
    );

    return {
      labels: distributionData.labels,
      datasets: [
        {
          label: "Hasta Sayısı",
          data: distributionData.data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    };
  }, [distributionData]); // distributionData değiştiğinde yeniden hesapla

  if (!chartData) {
    // Bileşen içinde veri yoksa mesaj göstermek yerine ChartCard halleder.
    // İsterseniz burada da bir mesaj gösterebilirsiniz.
    return null;
  }

  const options = getPieOptions("Diyabet Risk Segmentasyonu");

  return <Pie data={chartData} options={options} />;
};

export default RiskPieChart;
