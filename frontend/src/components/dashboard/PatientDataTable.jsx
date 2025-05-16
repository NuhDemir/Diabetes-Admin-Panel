// frontend/src/components/dashboard/PatientDataTable.jsx
import React, { useState } from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CPagination,
  CPaginationItem,
  CAlert, // Veri yoksa mesaj için
  CSpinner, // Yükleniyor durumu için
} from "@coreui/react";
import CIcon from "@coreui/icons-react"; // İkonlar için (opsiyonel)
import { cilNotes, cilBan } from "@coreui/icons"; // Örnek ikonlar
import { BLOOD_PRESSURE_KEY } from "../../utils/dashboardCalculations"; // Doğru anahtar
import "../../assets/css/PatientDataTable.css"; // Bu bileşene özel stiller

const columns = [
  {
    key: "Age",
    label: "Yaş",
    _props: { scope: "col", style: { width: "8%" } },
  },
  {
    key: "Pregnancies",
    label: "Gebelik",
    _props: { scope: "col", style: { width: "10%" } },
  },
  {
    key: "Glucose",
    label: "Glikoz",
    _props: { scope: "col", style: { width: "10%" } },
  },
  {
    key: BLOOD_PRESSURE_KEY,
    label: "Kan Basıncı",
    _props: { scope: "col", style: { width: "12%" } },
  },
  {
    key: "BMI",
    label: "BMI",
    _props: { scope: "col", style: { width: "10%" } },
  },
  {
    key: "DiabetesPedigreeFunction",
    label: "Soy Geç. Fonk.",
    _props: { scope: "col", style: { width: "15%" } },
  },
  {
    key: "RiskLevel",
    label: "Risk Grubu",
    _props: { scope: "col", style: { width: "15%" } },
  },
  // İsteğe bağlı: İşlemler sütunu
  // { key: "actions", label: "İşlemler", _props: { scope: "col", style: { width: "10%", textAlign: 'center' } } },
];

const getRiskBadgeColor = (riskLevel) => {
  switch (riskLevel) {
    case "Yüksek":
      return "danger";
    case "Orta":
      return "warning";
    case "Düşük":
      return "success";
    default:
      return "secondary";
  }
};

const PatientDataTable = ({ data, className = "", loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Yükleniyor durumu
  if (loading) {
    return (
      <CCard
        className={`mb-0 text-center ${className}`}
        style={{ border: "none", boxShadow: "none" }}
      >
        <CCardBody style={{ padding: "2rem" }}>
          <CSpinner color="primary" />
          <p className="mt-2 mb-0 text-muted">Hasta tablosu yükleniyor...</p>
        </CCardBody>
      </CCard>
    );
  }

  // Veri yok veya filtrelenmiş veri yoksa
  if (!data || data.length === 0) {
    return (
      <CCard className={`mb-0 ${className}`}>
        <CCardBody>
          <CAlert color="info" className="text-center neu-brutal-alert m-0">
            <CIcon icon={cilBan} className="me-2" size="lg" />
            Seçili filtrelere uygun hasta kaydı bulunamadı.
          </CAlert>
        </CCardBody>
      </CCard>
    );
  }

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentTableData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <CCard className={`mb-0 patient-data-table-card ${className}`}>
      <CCardHeader className="table-card-header">
        <CIcon icon={cilNotes} className="me-2" />
        Filtrelenmiş Hasta Listesi
      </CCardHeader>
      <CCardBody className="p-0">
        {" "}
        {/* Tablonun kenarlara yapışması için padding 0 */}
        <CTable hover responsive striped className="mb-0 neu-brutal-table">
          <CTableHead>
            <CTableRow>
              {columns.map((col) => (
                <CTableHeaderCell {...col._props} key={col.key}>
                  {col.label}
                </CTableHeaderCell>
              ))}
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentTableData.map((patient, index) => (
              <CTableRow key={patient._id || `patient-${index}`}>
                {columns.map((col) => {
                  let cellValue = patient[col.key];

                  if (
                    (col.key === "BMI" ||
                      col.key === "DiabetesPedigreeFunction") &&
                    typeof cellValue === "number"
                  ) {
                    cellValue = cellValue.toFixed(2);
                  } else if (cellValue === null || cellValue === undefined) {
                    cellValue = "N/A";
                  } else {
                    cellValue = String(cellValue); // Her şeyi stringe çevir
                  }

                  if (col.key === "RiskLevel") {
                    return (
                      <CTableDataCell
                        key={`${patient._id || index}-${col.key}`}
                      >
                        <span
                          className={`risk-badge risk-${getRiskBadgeColor(
                            cellValue
                          )}`}
                        >
                          {cellValue}
                        </span>
                      </CTableDataCell>
                    );
                  }
                  // İsteğe bağlı: İşlemler sütunu için
                  // if (col.key === "actions") {
                  //   return (
                  //     <CTableDataCell key={`${patient._id || index}-${col.key}`} className="text-center">
                  //       <CButton size="sm" color="info" variant="outline">Detay</CButton>
                  //     </CTableDataCell>
                  //   );
                  // }
                  return (
                    <CTableDataCell key={`${patient._id || index}-${col.key}`}>
                      {cellValue}
                    </CTableDataCell>
                  );
                })}
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </CCardBody>
      {totalPages > 1 && (
        <div className="neu-brutal-pagination-wrapper">
          <CPagination
            align="center"
            aria-label="Page navigation"
            className="mt-3 neu-brutal-pagination"
          >
            <CPaginationItem
              aria-label="Previous"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="nav-button"
            >
              <span aria-hidden="true">«</span>
            </CPaginationItem>

            {/* Sayfa numaraları (daha dinamik bir yapı için geliştirilebilir) */}
            {[...Array(totalPages).keys()].map(
              (page) =>
                (page + 1 === currentPage || // Aktif sayfa
                  (page + 1 >= currentPage - 2 &&
                    page + 1 <= currentPage + 2) || // Aktif etrafındaki 2 sayfa
                  page + 1 === 1 || // İlk sayfa
                  page + 1 === totalPages || // Son sayfa
                  (currentPage < 5 && page + 1 <= 5) || // Başlangıçta ilk 5
                  (currentPage > totalPages - 4 &&
                    page + 1 >= totalPages - 4)) && // Sonda son 5
                (((currentPage < 5 &&
                  page + 1 === 5 &&
                  totalPages > 5 &&
                  currentPage !== 4) ||
                  (currentPage > totalPages - 4 &&
                    page + 1 === totalPages - 4 &&
                    totalPages > 5 &&
                    currentPage !== totalPages - 3)) &&
                totalPages > 5 ? (
                  <CPaginationItem
                    key={`dots-${page}`}
                    disabled
                    className="pagination-dots"
                  >
                    ...
                  </CPaginationItem>
                ) : (
                  <CPaginationItem
                    key={page + 1}
                    active={page + 1 === currentPage}
                    onClick={() => setCurrentPage(page + 1)}
                    className={page + 1 === currentPage ? "active-page" : ""}
                  >
                    {page + 1}
                  </CPaginationItem>
                ))
            )}

            <CPaginationItem
              aria-label="Next"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="nav-button"
            >
              <span aria-hidden="true">»</span>
            </CPaginationItem>
          </CPagination>
        </div>
      )}
    </CCard>
  );
};

export default PatientDataTable;
