import React from "react";
import { motion } from "framer-motion"; // framer-motion kurulu olmalı
import styled from "styled-components"; // styled-components kurulu olmalı
import RiskPieChart from "../../components/dashboard/charts/RiskPieChart";
import AgeTrendScatterChart from "../../components/dashboard/charts/AgeTrendScatterChart";
import CorrelationScatterChart from "../../components/dashboard/charts/CorrelationScatterChart";
import DistributionBarChart from "../../components/dashboard/charts/DistributionBarChart";
import GroupedAverageBarChart from "../../components/dashboard/charts/GroupedAverageBarChart";

// BLOOD_PRESSURE_KEY import'u (eğer utils'den geliyorsa)
import { BLOOD_PRESSURE_KEY } from "../../utils/dashboardCalculations";

// Neu Brutalism için temel renkler
const COLORS = {
  background: "#f8f7f2", // Kemik beyazı arka plan
  accent1: "#ff5252", // Parlak kırmızı
  accent2: "#0066ff", // Canlı mavi
  accent3: "#ffcc00", // Parlak sarı
  accent4: "#00cc66", // Canlı yeşil
  dark: "#111111", // Koyu siyah
  light: "#ffffff", // Parlak beyaz
};
const FONT_FAMILY_NEU = "'Space Mono', monospace"; // Fontun projenize ekli olduğundan emin olun

const BrutalistCard = styled(motion.div)`
  background: ${COLORS.light};
  border: 3px solid ${COLORS.dark};
  box-shadow: 6px 6px 0px 0px ${(props) => props.accentcolor || COLORS.accent1}; /* accentColor -> accentcolor */
  border-radius: 0px;
  padding: 1.5rem;
  margin-bottom: 0; /* Gap ile yönetilecek */
  transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
  display: flex; /* İçeriği dikeyde esnetmek için */
  flex-direction: column;

  &:hover {
    transform: translate(-3px, -3px);
    box-shadow: 9px 9px 0px 0px
      ${(props) => props.accentcolor || COLORS.accent1};
  }

  h2 {
    font-family: ${FONT_FAMILY_NEU};
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0 0 1.5rem 0;
    padding: 0.5rem 0.75rem;
    background: ${(props) => props.accentcolor || COLORS.accent1};
    color: ${COLORS.dark}; /* Başlık için koyu renk */
    display: inline-block;
    border: 2px solid ${COLORS.dark};
    align-self: flex-start; /* Başlığı sola yasla */
  }

  .chart-container {
    border: 2px solid ${COLORS.dark};
    background-color: ${COLORS.light};
    padding: 1rem;
    min-height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1; /* Kart içinde kalan alanı doldur */
    width: 100%; /* Wrapper'ın genişliğini alsın */
  }
  .chart-container > * {
    /* Chart.js canvas'ı veya div'i için */
    width: 100%;
    height: 100%;
  }
`;

// Sayfa konteyneri (eski kodunuzdaki <section className="charts-section"> yerine)
const ChartsContainer = styled(motion.section)`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(450px, 1fr)
  ); /* Minimum kart genişliği */
  gap: 2rem;
  padding: 1rem 0; /* Üst ve alt padding, yan padding sayfa genelinden gelebilir */
  background-color: ${COLORS.background}; /* Ana sayfanın arka planıyla uyumlu olabilir */

  @media (max-width: 992px) {
    /* Daha erken breakpoint */
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

// Brutalist stil ChartCard sarmalayıcı bileşeni
const ChartCard = ({ title, children, accentColor }) => {
  return (
    <BrutalistCard
      accentcolor={accentColor} // prop adını styled component ile eşleştir
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h2>{title}</h2>
      <div className="chart-container">{children}</div>
    </BrutalistCard>
  );
};

// --- Eski Koddan Gelen Ana Bileşen Yapısı ve Veri Çekme ---
const DashboardChartsSection = ({ chartData, className = "" }) => {
  // chartData tanımsızsa veya boşsa, erken return yap veya bir mesaj göster.
  if (!chartData || Object.keys(chartData).length === 0) {
    // console.warn("DashboardChartsSection: chartData prop is undefined or empty.");
    // Bu mesaj ana sayfada (DiabetesDashboardPage) zaten gösteriliyor olabilir.
    // O yüzden burada null dönmek daha iyi olabilir.
    return null;
  }

  const {
    riskDistribution,
    glucoseAgeTrend,
    bpAgeTrend,
    correlationData,
    ageDistribution,
    bmiDistribution,
    pregnancyDistribution,
    averagesByRisk,
  } = chartData; // chartData'nın bir obje olduğu ve bu property'leri içerdiği varsayılıyor.

  // Veri yoksa grafik bölümünü render etme veya mesaj göster
  const hasAnyChartData =
    chartData &&
    Object.values(chartData).some(
      (data) =>
        data &&
        ((Array.isArray(data.data) && data.data.length > 0) || // { labels:[], data:[] } formatı
          (Array.isArray(data.datasets) &&
            data.datasets.some(
              (ds) => Array.isArray(ds.data) && ds.data.length > 0
            )) || // Chart.js dataset formatı
          (Array.isArray(data) && data.length > 0)) // Düz array formatı (scatter)
    );

  if (!hasAnyChartData && Object.keys(chartData).length > 0) {
    // chartData var ama içindeki veriler boşsa (filtre sonucu gibi)
    // Bu mesaj da ana sayfada gösterildiği için burada null dönebiliriz.
    // return <p style={{ textAlign: 'center', padding: '2rem', color: COLORS.dark, fontFamily: FONT_FAMILY_NEU }}>Grafikler için filtrelenmiş veri bulunmuyor.</p>;
    return null;
  }

  return (
    // Eski kodunuzdaki <section className="charts-section"> yerine ChartsContainer kullanılıyor.
    // className prop'u ile dışarıdan ek stil sınıfları eklenebilir.
    <ChartsContainer className={className}>
      {/* Yaş Dağılımı */}
      {ageDistribution?.data?.length > 0 && ( // Veri varsa render et
        <ChartCard title="Yaş Dağılımı" accentColor={COLORS.accent1}>
          <DistributionBarChart
            chartData={ageDistribution}
            xAxisLabel="Yaş Aralığı"
            yAxisLabel="Hasta Sayısı"
            // Neubrutalist stil için ek proplar (bu propların DistributionBarChart tarafından desteklenmesi gerekir)
            barColor={COLORS.accent1}
            gridColor={COLORS.dark + "33"} // %20 opacity
            labelColor={COLORS.dark}
            axisColor={COLORS.dark}
            fontFamily={FONT_FAMILY_NEU}
          />
        </ChartCard>
      )}

      {/* Risk Segmentasyonu */}
      {riskDistribution?.data?.length > 0 && (
        <ChartCard
          title="Diyabet Risk Segmentasyonu"
          accentColor={COLORS.accent2}
        >
          <RiskPieChart
            distributionData={riskDistribution}
            // Neubrutalist stil için ek proplar
            colors={[
              COLORS.accent1,
              COLORS.accent2,
              COLORS.accent3,
              COLORS.accent4,
            ]}
            borderColor={COLORS.dark}
            borderWidth={3} // Daha kalın border
            labelColor={COLORS.dark}
            fontFamily={FONT_FAMILY_NEU}
          />
        </ChartCard>
      )}

      {/* Risk Grubuna Göre Ortalamalar */}
      {averagesByRisk?.datasets?.[0]?.data?.length > 0 && (
        <ChartCard
          title="Risk Grubuna Göre Ortalama Değerler"
          accentColor={COLORS.accent3}
        >
          <GroupedAverageBarChart
            chartData={averagesByRisk}
            // title="Risk Gruplarına Göre Ortalama Metrikler" // ChartCard zaten başlık alıyor
            // Neubrutalist stil için ek proplar
            barColors={[
              COLORS.accent1,
              COLORS.accent2,
              COLORS.accent3,
              COLORS.accent4,
            ]}
            borderColor={COLORS.dark}
            gridColor={COLORS.dark + "33"}
            labelColor={COLORS.dark}
            axisColor={COLORS.dark}
            fontFamily={FONT_FAMILY_NEU}
          />
        </ChartCard>
      )}

      {/* Yaşa Göre Glikoz */}
      {glucoseAgeTrend?.length > 0 && (
        <ChartCard
          title="Yaşa Göre Glikoz Değişimi"
          accentColor={COLORS.accent4}
        >
          <AgeTrendScatterChart
            trendData={glucoseAgeTrend}
            valueKey="Glucose" // Bu prop AgeTrendScatterChart içinde kullanılıyor mu kontrol et
            yAxisLabel="Glikoz Seviyesi"
            // Neubrutalist stil için ek proplar
            dotColor={COLORS.accent4}
            gridColor={COLORS.dark + "33"}
            labelColor={COLORS.dark}
            axisColor={COLORS.dark}
            fontFamily={FONT_FAMILY_NEU}
          />
        </ChartCard>
      )}

      {/* Yaşa Göre Kan Basıncı */}
      {bpAgeTrend?.length > 0 && (
        <ChartCard
          title="Yaşa Göre Kan Basıncı Değişimi"
          accentColor={COLORS.accent1}
        >
          <AgeTrendScatterChart
            trendData={bpAgeTrend}
            valueKey={BLOOD_PRESSURE_KEY} // Eski koddan doğru anahtar
            yAxisLabel="Kan Basıncı (mg/dL)"
            // Neubrutalist stil için ek proplar
            dotColor={COLORS.accent1}
            gridColor={COLORS.dark + "33"}
            labelColor={COLORS.dark}
            axisColor={COLORS.dark}
            fontFamily={FONT_FAMILY_NEU}
          />
        </ChartCard>
      )}

      {/* Glikoz/BMI Korelasyonu */}
      {correlationData?.length > 0 && (
        <ChartCard
          title="Glikoz ve BMI Korelasyonu"
          accentColor={COLORS.accent2}
        >
          <CorrelationScatterChart
            correlationData={correlationData}
            // Neubrutalist stil için ek proplar
            dotColorsByRisk={{
              // dotColors prop'unu bu şekilde değiştirebiliriz
              Yüksek: COLORS.accent1,
              Orta: COLORS.accent3,
              Düşük: COLORS.accent4,
              Bilinmiyor: COLORS.dark + "88", // Yarı şeffaf siyah
            }}
            borderColor={COLORS.dark} // Nokta border'ı için
            gridColor={COLORS.dark + "33"}
            labelColor={COLORS.dark}
            axisColor={COLORS.dark}
            fontFamily={FONT_FAMILY_NEU}
          />
        </ChartCard>
      )}

      {/* BMI Dağılımı */}
      {bmiDistribution?.data?.length > 0 && (
        <ChartCard title="BMI Dağılımı" accentColor={COLORS.accent3}>
          <DistributionBarChart
            chartData={bmiDistribution}
            xAxisLabel="BMI Aralığı"
            yAxisLabel="Hasta Sayısı"
            // Neubrutalist stil için ek proplar
            barColor={COLORS.accent3}
            gridColor={COLORS.dark + "33"}
            labelColor={COLORS.dark}
            axisColor={COLORS.dark}
            fontFamily={FONT_FAMILY_NEU}
          />
        </ChartCard>
      )}

      {/* Gebelik Sayısı Dağılımı */}
      {pregnancyDistribution?.data?.length > 0 && (
        <ChartCard title="Gebelik Sayısı Dağılımı" accentColor={COLORS.accent4}>
          <DistributionBarChart
            chartData={pregnancyDistribution}
            xAxisLabel="Gebelik Sayısı"
            yAxisLabel="Hasta Sayısı"
            // Neubrutalist stil için ek proplar
            barColor={COLORS.accent4}
            gridColor={COLORS.dark + "33"}
            labelColor={COLORS.dark}
            axisColor={COLORS.dark}
            fontFamily={FONT_FAMILY_NEU}
          />
        </ChartCard>
      )}
    </ChartsContainer>
  );
};

// ÖNEMLİ: Aşağıdaki grafik bileşenleri artık BU DOSYADA TANIMLANMAMALI.
// Kendi ayrı dosyalarında (örn: ../../../components/dashboard/charts/RiskPieChart.jsx)
// bulunmalı ve yukarıda import edilmelidirler.
// Bu bileşenlerin her birinin, yukarıda ChartCard içinde onlara gönderilen
// yeni propları (barColor, gridColor, labelColor, fontFamily vb.)
// kabul edecek ve Chart.js options objelerinde kullanacak şekilde güncellenmesi gerekir.

// const RiskPieChart = ({ ... }) => { ... };
// const AgeTrendScatterChart = ({ ... }) => { ... };
// const CorrelationScatterChart = ({ ... }) => { ... };
// const DistributionBarChart = ({ ... }) => { ... };
// const GroupedAverageBarChart = ({ ... }) => { ... };

export default DashboardChartsSection;
