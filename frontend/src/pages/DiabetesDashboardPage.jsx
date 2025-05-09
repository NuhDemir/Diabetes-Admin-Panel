// frontend/src/pages/DiabetesDashboardPage.jsx
import React, { useState, useMemo } from "react";
import {
  CContainer,
  CRow,
  CCol,
  CSpinner,
  CAlert,
  CButton,
} from "@coreui/react";
import useDiabetesData from "../hooks/useDiabetesData";
import CriticalAlerts from "../components/dashboard/CriticalAlerts";
import DashboardHeaderSection from "./dashboard/DashboardHeaderSection";
import DashboardFilters from "../components/dashboard/DashboardFilters";
import DashboardTopSection from "./dashboard/DashboardTopSection";
import DashboardChartsSection from "./dashboard/DashboardChartsSection";
import PatientDataTable from "../components/dashboard/PatientDataTable";

// Utility fonksiyonları
import {
  calculateGeneralStats,
  calculateRiskDistribution,
  prepareAgeTrendData,
  prepareCorrelationData,
  calculateDistributionByRange,
  calculateAveragesByRiskGroup,
  calculatePregnancyDistribution,
  BLOOD_PRESSURE_KEY,
} from "../utils/dashboardCalculations";

const DiabetesDashboardPage = () => {
  // --- State ve Veri Hook'ları ---
  const { dataWithRisk, loading, error, refetchData } = useDiabetesData();
  const [ageFilter, setAgeFilter] = useState({ min: "", max: "" });
  const [riskFilter, setRiskFilter] = useState("All");

  // --- Olay Yöneticileri ---
  const handleClearFilters = () => {
    setAgeFilter({ min: "", max: "" });
    setRiskFilter("All");
  };

  // --- Memoize Edilmiş Hesaplamalar ---
  const filteredData = useMemo(() => {
    if (!dataWithRisk) return [];
    return dataWithRisk.filter((patient) => {
      let passAge = true;
      let passRisk = true;
      const minAge = parseInt(ageFilter.min, 10);
      const maxAge = parseInt(ageFilter.max, 10);
      if (!isNaN(minAge) && patient.Age < minAge) passAge = false;
      if (!isNaN(maxAge) && patient.Age > maxAge) passAge = false;
      if (riskFilter !== "All" && patient.RiskLevel !== riskFilter)
        passRisk = false;
      return passAge && passRisk;
    });
  }, [dataWithRisk, ageFilter, riskFilter]);

  const stats = useMemo(
    () => calculateGeneralStats(filteredData),
    [filteredData]
  );

  const chartData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) {
      // Grafik bileşenlerinin çökmemesi için boş yapılar döndür
      return {
        riskDistribution: { labels: [], data: [] },
        glucoseAgeTrend: [],
        bpAgeTrend: [],
        correlationData: [],
        ageDistribution: { labels: [], data: [] },
        bmiDistribution: { labels: [], data: [] },
        pregnancyDistribution: { labels: [], data: [] },
        averagesByRisk: { labels: [], datasets: [] },
      };
    }
    return {
      riskDistribution: calculateRiskDistribution(filteredData),
      glucoseAgeTrend: prepareAgeTrendData(filteredData, "Glucose"),
      bpAgeTrend: prepareAgeTrendData(filteredData, BLOOD_PRESSURE_KEY),
      correlationData: prepareCorrelationData(filteredData),
      ageDistribution: calculateDistributionByRange(filteredData, "Age", 10),
      bmiDistribution: calculateDistributionByRange(filteredData, "BMI", 5, 50),
      pregnancyDistribution: calculatePregnancyDistribution(filteredData),
      averagesByRisk: calculateAveragesByRiskGroup(filteredData, [
        "Glucose",
        "BMI",
        "Age",
        BLOOD_PRESSURE_KEY,
      ]),
    };
  }, [filteredData]);

  // --- Render Koşulları ---
  if (loading && (!dataWithRisk || dataWithRisk.length === 0)) {
    return (
      <div className="page-loading-spinner">
        <CSpinner color="primary" style={{ width: "3rem", height: "3rem" }} />
        <p className="mt-3 text-muted">Hastane verileri yükleniyor...</p>
      </div>
    );
  }

  if (error && (!dataWithRisk || dataWithRisk.length === 0)) {
    return (
      <CContainer className="mt-5">
        <CAlert color="danger" className="text-center">
          Veriler yüklenirken bir hata oluştu: {error}
          <br />
          <CButton
            color="danger-ghost"
            size="sm"
            onClick={refetchData}
            className="mt-2"
          >
            Tekrar Dene
          </CButton>
        </CAlert>
      </CContainer>
    );
  }

  const initialDataLoaded = dataWithRisk && dataWithRisk.length > 0;
  const hasFilteredData = filteredData && filteredData.length > 0;

  return (
    <div className="dashboard-page-container-coreui">
      {/* Başlık Bölümü (Artık bir alt bileşen) */}
      <DashboardHeaderSection
        className="mb-4" // CoreUI margin utility sınıfı
        loading={loading} // Yüklenme durumunu başlığa da gönder
        error={error && initialDataLoaded} // Sadece veri yüklendikten sonraki hataları göster
        refetchData={refetchData}
      />

      {/* Ana İçerik (Veri yüklendikten sonra) */}
      {initialDataLoaded ? (
        <>
          {/* Filtreler */}
          <DashboardFilters
            className="mb-4"
            ageFilter={ageFilter}
            onAgeChange={setAgeFilter}
            riskFilter={riskFilter}
            onRiskChange={setRiskFilter}
            onClearFilters={handleClearFilters}
          />

          {/* İstatistikler ve Uyarılar */}
          <DashboardTopSection
            stats={stats}
            filteredData={filteredData}
            className="mb-4"
          />

          {/* Filtre Sonucu Yoksa Mesaj */}
          {!hasFilteredData && initialDataLoaded && (
            <CAlert color="info" className="text-center my-4">
              Seçili filtrelere uygun hasta bulunamadı.
            </CAlert>
          )}

          {/* Grafikler Bölümü (Veri varsa) */}
          {hasFilteredData && (
            <DashboardChartsSection chartData={chartData} className="mb-4" />
          )}
        </>
      ) : (
        // İlk veri yüklenmediyse ve hata da yoksa farklı bir mesaj
        !error && (
          <div className="page-loading-spinner">
            <p>Başlangıç verisi bekleniyor veya bulunamadı...</p>
          </div>
        )
      )}
      <CriticalAlerts data={filteredData} />
    </div>
  );
};

export default DiabetesDashboardPage;
