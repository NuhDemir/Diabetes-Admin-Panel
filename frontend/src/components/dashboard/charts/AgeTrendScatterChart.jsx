import React, { useMemo } from "react";
import { Scatter } from "react-chartjs-2";
import {
  getScatterOptions,
  glucoseColor,
  glucoseBorderColor,
  bpColor,
  bpBorderColor,
} from "../../../utils/chartUtils";

const AgeTrendScatterChart = ({ trendData, valueKey, yAxisLabel, title }) => {
  const chartData = useMemo(() => {
    if (!trendData || trendData.length === 0) return null;

    let color, borderColor, label;
    if (valueKey === "Glucose") {
      color = glucoseColor;
      borderColor = glucoseBorderColor;
      label = "Glikoz Değeri";
    } else if (valueKey === "BloodPressure") {
      color = bpColor;
      borderColor = bpBorderColor;
      label = "Kan Basıncı (mg/dL)";
    } else {
      color = "rgba(100, 100, 100, 0.6)"; // Default color
      borderColor = "rgba(100, 100, 100, 1)";
      label = valueKey;
    }

    return {
      datasets: [
        {
          label: label,
          data: trendData, // Zaten {x: age, y: value} formatında
          backgroundColor: color,
          borderColor: borderColor,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [trendData, valueKey]);

  if (!chartData) return null;

  const options = getScatterOptions("Yaş", yAxisLabel, title);

  return <Scatter data={chartData} options={options} />;
};

export default AgeTrendScatterChart;
