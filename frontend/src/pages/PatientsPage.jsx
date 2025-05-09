import React, { useState, useMemo } from "react";
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CButton,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CAlert,
  CSpinner,
  CFormLabel, // <-- EKSİK IMPORT'U EKLE
  CFormSelect, // <-- CFormSelect de kullanılmış olabilir, kontrol et. Standart select kullandıysan gerek yok.
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSearch, cilUserPlus, cilFilterX, cilList } from "@coreui/icons";
import useDiabetesData from "../hooks/useDiabetesData";
import PatientDataTable from "../components/dashboard/PatientDataTable";
import { calculateRisk } from "../utils/riskHelper";

import "../assets/css/PatientsPage.css";

const PatientsPage = () => {
  const {
    rawData: allPatients,
    loading: dataLoading,
    error: dataError,
    refetchData,
  } = useDiabetesData();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState("All");

  const processedPatients = useMemo(() => {
    if (!allPatients) return [];
    return allPatients.map((patient) => ({
      ...patient,
      RiskLevel: calculateRisk(patient),
      searchableText:
        `${patient.Age} ${patient.Glucose} ${patient.BMI}`.toLowerCase(),
    }));
  }, [allPatients]);

  const filteredPatients = useMemo(() => {
    if (!processedPatients) return [];
    return processedPatients.filter((patient) => {
      const lowerSearchTerm = searchTerm.toLowerCase();
      let matchesSearch = true;
      let matchesRisk = true;

      if (searchTerm) {
        matchesSearch =
          patient.searchableText.includes(lowerSearchTerm) ||
          String(patient.Age).includes(lowerSearchTerm) ||
          String(patient.Glucose).includes(lowerSearchTerm) ||
          String(patient.BMI).includes(lowerSearchTerm);
      }

      if (filterRisk !== "All" && patient.RiskLevel !== filterRisk) {
        matchesRisk = false;
      }
      return matchesSearch && matchesRisk;
    });
  }, [processedPatients, searchTerm, filterRisk]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterRisk("All");
  };

  if (dataLoading && (!allPatients || allPatients.length === 0)) {
    return (
      <div
        className="page-loading-spinner"
        style={{ minHeight: "calc(100vh - 150px)" }}
      >
        <CSpinner color="primary" style={{ width: "3rem", height: "3rem" }} />
        <p className="mt-3 text-muted">Hasta verileri yükleniyor...</p>
      </div>
    );
  }

  if (dataError && (!allPatients || allPatients.length === 0)) {
    return (
      <CContainer className="mt-4">
        <CAlert color="danger" className="text-center">
          Hasta verileri yüklenirken bir hata oluştu: {dataError}
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

  if (
    !dataLoading &&
    !dataError &&
    (!allPatients || allPatients.length === 0)
  ) {
    return (
      <CContainer className="mt-4">
        <CAlert color="info" className="text-center">
          Sistemde kayıtlı hasta bulunmamaktadır.
          <br />
          <CButton
            color="primary"
            className="mt-3"
            onClick={() => alert("Yeni hasta ekleme formu açılacak.")}
          >
            <CIcon icon={cilUserPlus} className="me-2" />
            Yeni Hasta Ekle
          </CButton>
        </CAlert>
      </CContainer>
    );
  }

  return (
    <CContainer fluid className="patients-page-container py-4 px-lg-4">
      <CRow className="mb-4 align-items-center">
        <CCol xs={12} md>
          <h2 className="mb-3 mb-md-0 page-title">
            <CIcon icon={cilList} className="me-2" />
            Hasta Listesi
          </h2>
        </CCol>
        <CCol xs={12} md="auto" className="text-md-end">
          <CButton
            color="primary"
            onClick={() => alert("Yeni hasta ekleme formu açılacak.")}
          >
            <CIcon icon={cilUserPlus} className="me-2" />
            Yeni Hasta Ekle
          </CButton>
        </CCol>
      </CRow>

      <CCard className="mb-4 shadow-sm">
        <CCardBody>
          <CRow className="g-3 align-items-end">
            <CCol md={6} lg={4}>
              {/* CFormLabel burada kullanılıyor, import edildiğinden emin ol */}
              <CFormLabel htmlFor="searchTerm" className="fw-semibold small">
                Hasta Ara (Yaş, Glikoz, BMI)
              </CFormLabel>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  id="searchTerm"
                  placeholder="Arama terimi girin..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
            </CCol>
            <CCol md={6} lg={3}>
              {/* CFormLabel burada kullanılıyor */}
              <CFormLabel htmlFor="filterRisk" className="fw-semibold small">
                Risk Seviyesine Göre Filtrele
              </CFormLabel>
              {/* Eğer CFormSelect kullanacaksanız, onu da import etmeniz gerekir.
                  Önceki kodda standart <select> kullanılmıştı.
                  Eğer CFormSelect ise:
                  <CFormSelect
                    id="filterRisk"
                    value={filterRisk}
                    onChange={(e) => setFilterRisk(e.target.value)}
                    options={[
                      { label: 'Tüm Risk Seviyeleri', value: 'All' },
                      { label: 'Yüksek Risk', value: 'Yüksek' },
                      { label: 'Orta Risk', value: 'Orta' },
                      { label: 'Düşük Risk', value: 'Düşük' },
                      { label: 'Bilinmiyor', value: 'Bilinmiyor' },
                    ]}
                  />
                  Eğer standart select ise, CFormLabel'in importu yeterli.
              */}
              <select
                id="filterRisk"
                className="form-select"
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
              >
                <option value="All">Tüm Risk Seviyeleri</option>
                <option value="Yüksek">Yüksek Risk</option>
                <option value="Orta">Orta Risk</option>
                <option value="Düşük">Düşük Risk</option>
                <option value="Bilinmiyor">Bilinmiyor</option>
              </select>
            </CCol>
            <CCol xs={12} lg="auto">
              <CButton
                color="light"
                variant="outline"
                onClick={handleClearFilters}
                className="w-100"
              >
                <CIcon icon={cilFilterX} className="me-1" /> Filtreleri Temizle
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      <PatientDataTable data={filteredPatients} className="mb-0" />
    </CContainer>
  );
};

export default PatientsPage;
