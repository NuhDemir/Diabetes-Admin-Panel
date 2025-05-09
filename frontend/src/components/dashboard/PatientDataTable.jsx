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
  CAlert,
} from "@coreui/react";
import { BLOOD_PRESSURE_KEY } from "../../utils/dashboardCalculations";
import "../../assets/css/PatientDataTable.css"; // Import custom CSS for Neu Brutalism styles

const columns = [
  { key: "Age", label: "Yaş", _style: { width: "10%" } },
  { key: "Pregnancies", label: "Gebelik", _style: { width: "10%" } },
  { key: "Glucose", label: "Glikoz", _style: { width: "10%" } },
  { key: BLOOD_PRESSURE_KEY, label: "Kan Basıncı", _style: { width: "15%" } },
  { key: "BMI", label: "BMI", _style: { width: "10%" } },
  {
    key: "DiabetesPedigreeFunction",
    label: "Soy Geç. Fonk.",
    _style: { width: "15%" },
  },
  { key: "RiskLevel", label: "Risk Grubu", _style: { width: "10%" } },
];

// Define colors for risk levels
const getRiskColor = (riskLevel) => {
  switch (riskLevel) {
    case "Yüksek":
      return "high-risk";
    case "Orta":
      return "medium-risk";
    case "Düşük":
      return "low-risk";
    default:
      return "";
  }
};

const PatientDataTable = ({ data, className = "" }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!data) {
    return (
      <div className={`neu-brutal-card loading-card ${className}`}>
        <div className="neu-brutal-card-body text-center">
          <span className="loading-text">Tablo verisi yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`neu-brutal-alert ${className}`}>
        <span className="alert-text">
          Tabloda gösterilecek filtrelenmiş hasta verisi bulunmamaktadır.
        </span>
      </div>
    );
  }

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginationItems = [];
  if (totalPages > 1) {
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      endPage = Math.min(totalPages, 5);
    }
    if (currentPage > totalPages - 3) {
      startPage = Math.max(1, totalPages - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationItems.push(
        <button
          key={i}
          className={`neu-brutal-page-button ${
            i === currentPage ? "active" : ""
          }`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
  }

  return (
    <div className={`neu-brutal-card ${className}`}>
      <div className="neu-brutal-card-header">
        <h3 className="neu-brutal-title">Filtrelenmiş Hasta Verileri</h3>
      </div>
      <div className="neu-brutal-card-body">
        <div className="neu-brutal-table-wrapper">
          <table className="neu-brutal-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} style={col._style}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((patient, index) => (
                <tr key={patient._id || index} className="neu-brutal-row">
                  {columns.map((col) => {
                    const value =
                      (col.key === "BMI" ||
                        col.key === "DiabetesPedigreeFunction") &&
                      typeof patient[col.key] === "number"
                        ? patient[col.key].toFixed(2)
                        : patient[col.key] === 0
                        ? "0"
                        : patient[col.key] || "N/A";

                    const isRiskColumn = col.key === "RiskLevel";
                    const riskClass = isRiskColumn ? getRiskColor(value) : "";

                    return (
                      <td
                        key={`${patient._id || index}-${col.key}`}
                        className={`neu-brutal-cell ${riskClass}`}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="neu-brutal-pagination">
          <button
            className="neu-brutal-page-button nav-button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            «
          </button>

          {currentPage > 3 && (
            <>
              <button
                className="neu-brutal-page-button"
                onClick={() => setCurrentPage(1)}
              >
                1
              </button>
              {currentPage > 4 && <span className="pagination-dots">...</span>}
            </>
          )}

          {paginationItems}

          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && (
                <span className="pagination-dots">...</span>
              )}
              <button
                className="neu-brutal-page-button"
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            className="neu-brutal-page-button nav-button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            »
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientDataTable;
