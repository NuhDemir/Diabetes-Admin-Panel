// frontend/src/pages/DiabetesDashboardPage.jsx
import React from "react";
import {
  CContainer,
  CRow,
  CCol,
  CSpinner,
  CAlert,
  CButton,
} from "@coreui/react";
import useDiabetesData from "../hooks/useDiabetesData"; // Doğru yol: src/hooks/useDiabetesData.js
import CriticalAlerts from "../components/dashboard/CriticalAlerts"; // Doğru yol: src/components/dashboard/CriticalAlerts.jsx
import "../assets/css/DiabetesDashboardPage.css";

import DashboardHeaderSection from "./dashboard/DashboardHeaderSection"; // Bu zaten doğru görünüyor
import DashboardFilters from "../components/dashboard/DashboardFilters"; // Doğru yol: src/components/dashboard/DashboardFilters.jsx
import DashboardTopSection from "./dashboard/DashboardTopSection"; // Bu zaten doğru görünüyor
import DashboardChartsSection from "./dashboard/DashboardChartsSection"; // Bu zaten doğru görünüyor
import PatientDataTable from "../components/dashboard/PatientDataTable"; // Doğru yol: src/components/dashboard/PatientDataTable.jsx
// --------------------------

const DiabetesDashboardPage = () => {
  const {
    dashboardData, // Artık tüm hesaplanmış veriyi içerir
    loading,
    error,
    filters, // Hook'tan filtreleri al
    updateFilters, // Hook'tan filtre güncelleme fonksiyonunu al
    refetchData,
  } = useDiabetesData(); // Başlangıç filtrelerini hook'a verebilirsiniz

  // --- Olay Yöneticileri (Filtreler için) ---
  const handleAgeFilterChange = (newAgeFilter) => {
    updateFilters({ minAge: newAgeFilter.min, maxAge: newAgeFilter.max });
  };

  const handleRiskFilterChange = (newRiskLevel) => {
    updateFilters({ riskLevel: newRiskLevel });
  };

  const handleClearFilters = () => {
    updateFilters({ minAge: "", maxAge: "", riskLevel: "All" });
  };

  // --- Render Koşulları ---
  if (loading && !dashboardData) {
    // Sadece ilk yüklemede ve dashboardData henüz yokken
    return (
      <div className="neo-page-loader-overlay">
        <div className="neo-loader-box">
          <div className="neo-loader-bar"></div>
          <p className="neo-loader-text">VERİLER YÜKLENİYOR</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    // Sadece ilk yüklemede ve veri yokken hata
    return (
      <CContainer className="mt-5 text-center">
        {" "}
        {/* text-center eklendi */}
        <CAlert color="danger">
          Veriler yüklenirken bir hata oluştu: {error}
          <br />
          <CButton
            color="danger-ghost" // ghost butonlar daha az baskın
            size="sm"
            onClick={refetchData}
            className="mt-3" // Biraz daha boşluk
          >
            Tekrar Dene
          </CButton>
        </CAlert>
      </CContainer>
    );
  }

  // Backend'den gelen veriyi doğrudan kullanalım
  // dashboardData null veya undefined ise varsayılan boş yapılar ata
  const stats = dashboardData?.stats || {
    totalPatients: 0,
    avgBMI: "N/A",
    avgGlucose: "N/A",
    avgPregnancies: "N/A",
    avgBloodPressure: "N/A",
  };
  const chartDataForDisplay = {
    riskDistribution: dashboardData?.riskDistribution || {
      labels: [],
      data: [],
    },
    glucoseAgeTrend: dashboardData?.glucoseAgeTrend || [],
    bpAgeTrend: dashboardData?.bpAgeTrend || [],
    correlationData: dashboardData?.correlationData || [],
    ageDistribution: dashboardData?.ageDistribution || [],
    bmiDistribution: dashboardData?.bmiDistribution || [],
    pregnancyDistribution: dashboardData?.pregnancyDistribution || [],
    averagesByRisk: dashboardData?.averagesByRisk || {
      labels: [],
      datasets: [],
    },
  };
  const filteredPatientsData = dashboardData?.filteredPatients || []; // DataTable için

  const initialDataLoaded = !!dashboardData;
  // Grafiklerin çizilmesi için veri olup olmadığını kontrol et
  const hasChartData =
    initialDataLoaded &&
    Object.values(chartDataForDisplay).some(
      (data) =>
        (Array.isArray(data) && data.length > 0) || // {x,y} veya {label,data} dizileri için
        (data &&
          data.labels &&
          data.labels.length > 0 &&
          ((Array.isArray(data.data) && data.data.length > 0) ||
            (data.datasets &&
              data.datasets.length > 0 &&
              data.datasets.some((ds) => ds.data && ds.data.length > 0))))
    );

  return (
    // CContainer CoreUI'nin ana konteyner bileşeni
    <CContainer fluid className="dashboard-page-container-coreui px-4 py-4">
      {" "}
      {/* Daha fazla padding */}
      <DashboardHeaderSection
        loading={loading}
        error={error && initialDataLoaded} // Sadece veri yüklendikten sonraki hataları göster
        refetchData={refetchData}
      />
      {initialDataLoaded ? (
        <>
          <DashboardFilters
            // CoreUI sınıfları ile stil verilebilir veya Card içinde bırakılabilir
            className="mb-4"
            ageFilter={filters} // filters objesini doğrudan ver
            onAgeChange={handleAgeFilterChange}
            riskFilter={filters.riskLevel}
            onRiskChange={handleRiskFilterChange}
            onClearFilters={handleClearFilters}
          />

          <DashboardTopSection
            stats={stats}
            filteredData={filteredPatientsData} // CriticalAlerts bu veriyi kullanacak
            className="mb-4"
          />

          {/* Filtre sonucu grafik verisi yoksa mesaj */}
          {!hasChartData && initialDataLoaded && !loading && !error && (
            <CAlert color="info" className="text-center my-4">
              Seçili filtrelere uygun gösterilecek grafik verisi bulunamadı.
            </CAlert>
          )}

          {/* Grafikler Bölümü (Veri varsa) */}
          {initialDataLoaded && !loading && !error && hasChartData && (
            <DashboardChartsSection
              chartData={chartDataForDisplay}
              className="mb-4"
            />
          )}

          {/* Veri Tablosu */}
          {initialDataLoaded && filteredPatientsData.length > 0 && (
            <PatientDataTable data={filteredPatientsData} className="mt-4" />
          )}
          {!loading &&
            !error &&
            initialDataLoaded &&
            filteredPatientsData.length === 0 && (
              <CAlert color="info" className="text-center my-4">
                Seçili filtrelere uygun hasta kaydı bulunamadı.
              </CAlert>
            )}
        </>
      ) : (
        // İlk veri yüklenmediyse ve hata da yoksa (loading spinner zaten yukarıda)
        !error &&
        !loading && (
          <div className="page-loading-spinner">
            <p className="text-muted">
              Başlangıç verisi bekleniyor veya bulunamadı...
            </p>
          </div>
        )
      )}
    </CContainer>
  );
};

export default DiabetesDashboardPage;
