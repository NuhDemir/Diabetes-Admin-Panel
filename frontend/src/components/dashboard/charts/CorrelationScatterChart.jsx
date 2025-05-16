// frontend/src/components/dashboard/charts/CorrelationScatterChart.jsx
import React, { useMemo } from "react";
import { Scatter } from "react-chartjs-2";
import {
  getScatterOptions,
  riskColors, // chartUtils'dan
  riskBorderColors, // chartUtils'dan
} from "../../../utils/chartUtils";

const CorrelationScatterChart = ({ correlationData }) => {
  // Prop adı aynı kalabilir
  const chartDataForRender = useMemo(() => {
    // chartData çakışmasın diye isim değiştirelim
    if (!correlationData || correlationData.length === 0) return null;

    return {
      datasets: [
        {
          label: "Glikoz vs BMI (Risk)", // Tooltip için
          data: correlationData, // Backend'den gelen hazır veri
          pointBackgroundColor: (ctx) =>
            riskColors[ctx.raw?.risk] || "rgba(201, 203, 207, 0.7)", // riskColors chartUtils'da tanımlı olmalı
          pointBorderColor: (ctx) =>
            riskBorderColors[ctx.raw?.risk] || "rgba(201, 203, 207, 1)", // riskBorderColors chartUtils'da tanımlı olmalı
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };
  }, [correlationData]);

  if (!chartDataForRender) return null; // Veri yoksa render etme

  const options = {
    ...getScatterOptions(
      "BMI (Vücut Kitle İndeksi)",
      "Glikoz Seviyesi",
      "Glikoz ve BMI Korelasyonu" // Grafik başlığı ChartCard'dan geleceği için burası opsiyonel
    ),
    plugins: {
      ...getScatterOptions("BMI", "Glikoz").plugins, // getScatterOptions'dan tooltip vb. al, eksen başlıkları gereksiz
      legend: { display: false }, // Lejantı gizle, renkler noktalarda anlamlı
    },
  };

  return <Scatter data={chartDataForRender} options={options} />;
};

export default CorrelationScatterChart;
