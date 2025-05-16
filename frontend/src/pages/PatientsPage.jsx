// frontend/src/pages/PatientsPage.jsx
import React, { useState, useMemo } from "react";
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CAlert,
  CSpinner,
  CFormLabel,
  CFormSelect,
  CBadge,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilSearch,
  cilUserPlus,
  cilFilterX,
  cilMedicalCross,
  cilSync, // Yenile ikonu
} from "@coreui/icons";

// ÖNEMLİ: useDiabetesData hook'u artık tüm dashboard verisini değil,
// sadece ham hasta listesini getiren bir API çağrısı yapmalı veya
// gelen dashboardData objesinden sadece hasta listesini (örn: `dashboardData.allRawPatients`) almalı.
// Bu örnekte, useDiabetesData'nın `rawData` olarak ham hasta listesini döndürdüğünü varsayıyorum.
import useDiabetesData from "../hooks/useDiabetesData";
import PatientDataTable from "../components/dashboard/PatientDataTable";
import { calculateRisk } from "../utils/riskHelper";

import "../assets/css/PatientsPage.css";

const PatientsPage = () => {
  const {
    rawData: allPatientsData, // Hook'tan gelen ham veri (belki yeniden adlandırılmalı)
    loading: dataLoading,
    error: dataError,
    refetchData,
  } = useDiabetesData(); // Bu hook şu anda tüm dashboard verisini getiriyor olabilir.

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState("All");
  const [filterAgeMin, setFilterAgeMin] = useState("");
  const [filterAgeMax, setFilterAgeMax] = useState("");

  // Ham veriyi alıp, her hasta için risk seviyesini ve aranabilir metni hesapla
  const processedPatients = useMemo(() => {
    // Eğer useDiabetesData dashboard verisi döndürüyorsa,
    // ham hasta listesini oradan almanız gerekir.
    // Örneğin: const patientsToProcess = allPatientsData?.rawPatientList || [];
    // Şimdilik allPatientsData'nın doğrudan hasta listesi olduğunu varsayalım.
    const patientsToProcess = Array.isArray(allPatientsData)
      ? allPatientsData
      : [];

    if (patientsToProcess.length === 0) return [];

    return patientsToProcess.map((patient) => ({
      ...patient,
      RiskLevel: calculateRisk(patient),
      // Aranacak metinleri daha kapsamlı hale getirelim
      searchableText: `${patient.Age || ""} ${patient.Glucose || ""} ${
        patient.BMI || ""
      } ${patient["BloodPressure (mg/dL)"] || ""} ${
        patient.Pregnancies || ""
      } ${patient.DiabetesPedigreeFunction || ""} ${patient.Insulin || ""} ${
        patient.SkinThickness || ""
      }`.toLowerCase(),
    }));
  }, [allPatientsData]);

  // Filtreleme mantığı
  const filteredPatients = useMemo(() => {
    if (!processedPatients || processedPatients.length === 0) return [];
    return processedPatients.filter((patient) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const minAge = filterAgeMin === "" ? 0 : parseInt(filterAgeMin, 10);
      const maxAge =
        filterAgeMax === "" ? Infinity : parseInt(filterAgeMax, 10);

      let matchesSearch = true;
      let matchesRisk = true;
      let matchesAge = true;

      if (searchTerm) {
        matchesSearch = patient.searchableText.includes(lowerSearchTerm);
      }

      if (filterRisk !== "All" && patient.RiskLevel !== filterRisk) {
        matchesRisk = false;
      }

      // Yaş kontrolü (patient.Age tanımsız veya null değilse)
      if (patient.Age !== undefined && patient.Age !== null) {
        if (patient.Age < minAge || patient.Age > maxAge) {
          matchesAge = false;
        }
      } else if (filterAgeMin !== "" || filterAgeMax !== "") {
        // Yaş filtresi varsa ve hastanın yaşı yoksa eşleşmez
        matchesAge = false;
      }

      return matchesSearch && matchesRisk && matchesAge;
    });
  }, [processedPatients, searchTerm, filterRisk, filterAgeMin, filterAgeMax]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterRisk("All");
    setFilterAgeMin("");
    setFilterAgeMax("");
  };

  const activeFilterCount = [
    searchTerm !== "",
    filterRisk !== "All",
    filterAgeMin !== "" || filterAgeMax !== "",
  ].filter(Boolean).length;

  // Yüklenme ve Hata Durumları
  const initialLoad =
    dataLoading && (!allPatientsData || allPatientsData.length === 0);
  const initialError =
    dataError && (!allPatientsData || allPatientsData.length === 0);
  const noDataAfterLoad =
    !dataLoading &&
    !dataError &&
    (!allPatientsData || allPatientsData.length === 0);

  if (initialLoad) {
    return (
      <div className="page-loading-spinner">
        <CSpinner color="primary" />
        <p>Hasta verileri yükleniyor...</p>
      </div>
    );
  }

  if (initialError) {
    return (
      <CContainer className="mt-4">
        <CAlert color="danger" className="text-center py-4 neu-brutal-alert">
          <h4>
            <CIcon icon={cilMedicalCross} size="xl" className="me-2" /> Veri
            Yükleme Hatası
          </h4>
          <p className="mb-2">
            Hasta verileri yüklenirken bir sorun oluştu:{" "}
            {dataError.message || dataError}
          </p>
          <CButton
            color="light"
            onClick={refetchData}
            className="mt-2 neu-brutal-button"
          >
            <CIcon icon={cilSync} className="me-1" /> Tekrar Dene
          </CButton>
        </CAlert>
      </CContainer>
    );
  }

  return (
    <CContainer fluid className="patients-page-container">
      <CRow className="page-header-row mb-4 align-items-center">
        <CCol xs={12} md>
          <h2 className="page-main-title">
            <CIcon icon={cilFilterX} className="me-2 page-title-icon" />
            Hasta Yönetim Paneli
          </h2>
        </CCol>
        <CCol xs={12} md="auto" className="d-flex gap-2 mt-3 mt-md-0">
          <CButton
            color="info"
            variant="outline"
            onClick={refetchData}
            className="refresh-data-btn"
            disabled={dataLoading}
          >
            <CIcon icon={cilSync} className="me-1" />{" "}
            {dataLoading ? "Yenileniyor..." : "Yenile"}
          </CButton>
          <CButton
            color="success"
            className="add-patient-button"
            onClick={() => alert("Yeni hasta ekleme formu/modalı açılacak.")}
          >
            <CIcon icon={cilUserPlus} className="me-2" />
            Yeni Hasta
          </CButton>
        </CCol>
      </CRow>

      <CCard className="mb-4 filter-card neu-brutal-card">
        <CCardHeader className="filter-card-header">
          <h5 className="mb-0 filter-card-title">
            Filtreleme Seçenekleri
            {activeFilterCount > 0 && (
              <CBadge
                color="primary"
                shape="pill"
                className="ms-2 filter-count-badge"
              >
                {activeFilterCount} aktif filtre
              </CBadge>
            )}
          </h5>
        </CCardHeader>
        <CCardBody>
          <CRow className="g-3 align-items-end">
            <CCol md={5} lg={4}>
              <CFormLabel htmlFor="searchTermInput" className="filter-label">
                Hızlı Ara
              </CFormLabel>
              <CInputGroup className="search-input-group">
                <CInputGroupText>
                  {" "}
                  <CIcon icon={cilSearch} />{" "}
                </CInputGroupText>
                <CFormInput
                  type="text"
                  id="searchTermInput"
                  placeholder="Yaş, Glikoz, BMI vb."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
            </CCol>

            <CCol sm={6} md={3} lg={2}>
              <CFormLabel htmlFor="riskFilterSelect" className="filter-label">
                Risk Seviyesi
              </CFormLabel>
              <CFormSelect
                id="riskFilterSelect"
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                options={[
                  { label: "Tümü", value: "All" },
                  { label: "Yüksek", value: "Yüksek" },
                  { label: "Orta", value: "Orta" },
                  { label: "Düşük", value: "Düşük" },
                  { label: "Bilinmiyor", value: "Bilinmiyor" },
                ]}
              />
            </CCol>

            <CCol sm={12} md={4} lg={3}>
              <CFormLabel className="filter-label">Yaş Aralığı</CFormLabel>
              <CRow className="g-2 align-items-center">
                <CCol>
                  {" "}
                  <CFormInput
                    type="number"
                    placeholder="Min"
                    value={filterAgeMin}
                    onChange={(e) => setFilterAgeMin(e.target.value)}
                    min="0"
                  />{" "}
                </CCol>
                <CCol
                  xs="auto"
                  className="px-0 text-center filter-age-separator"
                >
                  {" "}
                  –{" "}
                </CCol>
                <CCol>
                  {" "}
                  <CFormInput
                    type="number"
                    placeholder="Max"
                    value={filterAgeMax}
                    onChange={(e) => setFilterAgeMax(e.target.value)}
                    min="0"
                  />{" "}
                </CCol>
              </CRow>
            </CCol>

            <CCol
              xs={12}
              lg={3}
              className="d-flex align-items-end mt-3 mt-lg-0"
            >
              <CButton
                color="secondary" // CoreUI secondary rengi
                variant="outline"
                onClick={handleClearFilters}
                className="w-100 clear-filters-btn neu-brutal-button"
                disabled={activeFilterCount === 0}
              >
                <CIcon icon={cilFilterX} className="me-1" /> Filtreleri Temizle
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Yüklenme ve Veri Yok Durumu (Veri tablosu için) */}
      {dataLoading &&
        allPatientsData &&
        allPatientsData.length > 0 && ( // Veri yenilenirken spinner
          <div className="text-center py-3">
            <CSpinner size="sm" /> Tablo güncelleniyor...
          </div>
        )}

      {!noDataAfterLoad ? (
        <PatientDataTable
          data={filteredPatients}
          loading={
            dataLoading && (!allPatientsData || allPatientsData.length === 0)
          }
          className="mb-0"
        />
      ) : (
        <CAlert color="info" className="text-center py-4 neu-brutal-alert">
          <h4>
            <CIcon icon={cilUserPlus} size="xl" className="me-2" /> Kayıtlı
            Hasta Bulunmuyor
          </h4>
          <p className="mb-2">
            Sistemde henüz kayıtlı hasta verisi bulunmamaktadır.
          </p>
        </CAlert>
      )}
    </CContainer>
  );
};

export default PatientsPage;
