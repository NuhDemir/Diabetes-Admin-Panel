import React, { useState } from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CButton,
  CCollapse,
  CBadge,
  CTooltip,
  CFormCheck,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilFilterX,
  cilFilter,
  cilOptions,
  cilArrowBottom,
  cilArrowTop,
} from "@coreui/icons";

const DashboardFilters = ({
  ageFilter,
  onAgeChange,
  riskFilter,
  onRiskChange,
  onClearFilters,
  className = "",
  advancedFiltersEnabled = false,
  dateFilter = { startDate: "", endDate: "" },
  onDateChange = () => {},
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Active filter count calculation
  const activeFilterCount = [
    ageFilter.min !== "" || ageFilter.max !== "",
    riskFilter !== "All",
    showAdvanced && dateFilter.startDate !== "",
    showAdvanced && dateFilter.endDate !== "",
  ].filter(Boolean).length;

  const handleAgeInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value === "" ? "" : Math.max(0, parseInt(value, 10));
    onAgeChange({
      ...ageFilter,
      [name]: numericValue,
    });
  };

  return (
    <CCard
      className={`mb-4 neo-brutalism-filter ${className}`}
      style={{
        border: "3px solid #000",
        borderRadius: "2px",
        boxShadow: "6px 6px 0 #000",
        transition: "all 0.2s ease",
        position: "relative",
        background: "#ffffff",
        overflow: "visible",
      }}
    >
      <div
        className="neo-decorators"
        style={{
          position: "absolute",
          top: "-10px",
          right: "-10px",
          width: "25px",
          height: "25px",
          background: "#FF6B6B",
          border: "2px solid #000",
          zIndex: 1,
        }}
      ></div>
      <div
        className="neo-decorators"
        style={{
          position: "absolute",
          bottom: "-8px",
          left: "20%",
          width: "40px",
          height: "16px",
          background: "#4ECDC4",
          border: "2px solid #000",
          zIndex: 0,
        }}
      ></div>

      <CCardHeader
        style={{
          borderBottom: "3px solid #000",
          background: "#F5DF4D",
          padding: "12px 16px",
        }}
      >
        <CRow className="align-items-center">
          <CCol className="d-flex align-items-center">
            <CIcon
              icon={cilFilter}
              size="xl"
              className="me-2"
              style={{
                transform: "rotate(-10deg)",
                filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.4))",
              }}
            />
            <h5
              className="mb-0 card-title"
              style={{
                fontWeight: "800",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Filtreler
              {activeFilterCount > 0 && (
                <CBadge
                  color="dark"
                  shape="rounded-pill"
                  className="ms-2"
                  style={{
                    border: "2px solid #000",
                    transform: "rotate(3deg)",
                  }}
                >
                  {activeFilterCount}
                </CBadge>
              )}
            </h5>
          </CCol>
          <CCol xs="auto" className="d-flex gap-2">
            <CButton
              color="dark"
              variant="outline"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              style={{
                borderWidth: "2px",
                borderRadius: "2px",
                fontWeight: "600",
              }}
            >
              <CIcon
                icon={collapsed ? cilArrowBottom : cilArrowTop}
                className="me-1"
              />
              {collapsed ? "Göster" : "Gizle"}
            </CButton>
            <CButton
              color="danger"
              size="sm"
              onClick={onClearFilters}
              style={{
                border: "2px solid #000",
                borderRadius: "2px",
                background: "#FF6B6B",
                boxShadow: "3px 3px 0 #000",
                fontWeight: "600",
                transition: "all 0.1s ease",
                transform:
                  activeFilterCount > 0 ? "rotate(-2deg) scale(1.05)" : "none",
              }}
              className="neo-btn"
            >
              <CIcon icon={cilFilterX} className="me-1" /> Temizle
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>

      <CCollapse visible={!collapsed}>
        <CCardBody
          style={{
            padding: "26px",
            background:
              "repeating-linear-gradient(45deg, #fff, #fff 15px, #f9f9f9 15px, #f9f9f9 30px)",
          }}
        >
          <CForm>
            <CRow className="g-3 align-items-end">
              <CCol md={6} lg={4}>
                <CFormLabel
                  htmlFor="minAge"
                  className="fw-bold mb-2"
                  style={{
                    display: "inline-block",
                    background: "#4ECDC4",
                    padding: "2px 8px",

                    border: "1px solid #000",
                  }}
                >
                  Yaş Aralığı
                </CFormLabel>
                <CRow className="g-2">
                  <CCol>
                    <CFormInput
                      type="number"
                      id="minAge"
                      name="min"
                      placeholder="Min"
                      value={ageFilter.min}
                      onChange={handleAgeInputChange}
                      min="0"
                      style={{
                        border: "2px solid #000",
                        borderRadius: "2px",
                        boxShadow: "3px 3px 0 rgba(0,0,0,0.2)",
                      }}
                    />
                  </CCol>
                  <CCol xs="auto" className="d-flex align-items-center">
                    <span
                      className="fw-bold"
                      style={{
                        width: "30px",
                        height: "3px",
                        background: "#000",
                        display: "block",
                      }}
                    ></span>
                  </CCol>
                  <CCol>
                    <CFormInput
                      type="number"
                      id="maxAge"
                      name="max"
                      placeholder="Max"
                      value={ageFilter.max}
                      onChange={handleAgeInputChange}
                      min="0"
                      style={{
                        border: "2px solid #000",
                        borderRadius: "2px",
                        boxShadow: "3px 3px 0 rgba(0,0,0,0.2)",
                      }}
                    />
                  </CCol>
                </CRow>
              </CCol>

              <CCol md={6} lg={4}>
                <CFormLabel
                  htmlFor="riskLevel"
                  className="fw-bold mb-2"
                  style={{
                    display: "inline-block",
                    background: "#FF6B6B",
                    padding: "2px 8px",

                    border: "1px solid #000",
                  }}
                >
                  Risk Seviyesi
                </CFormLabel>
                <CFormSelect
                  id="riskLevel"
                  value={riskFilter}
                  onChange={(e) => onRiskChange(e.target.value)}
                  aria-label="Risk Seviyesi Seçin"
                  style={{
                    border: "2px solid #000",
                    borderRadius: "2px",
                    boxShadow: "3px 3px 0 rgba(0,0,0,0.2)",
                    background: riskFilter !== "All" ? "#FFF7E0" : "",
                  }}
                >
                  <option value="All">Tümü</option>
                  <option value="Yüksek">Yüksek</option>
                  <option value="Orta">Orta</option>
                  <option value="Düşük">Düşük</option>
                  <option value="Bilinmiyor">Bilinmiyor</option>
                </CFormSelect>
              </CCol>

              <CCol md={6} lg={4} className="d-flex align-items-end">
                {advancedFiltersEnabled && (
                  <CButton
                    variant="outline"
                    color="dark"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-100"
                    style={{
                      borderWidth: "2px",
                      borderRadius: "2px",
                      boxShadow: "3px 3px 0 #000",
                      fontWeight: "600",
                    }}
                  >
                    <CIcon icon={cilOptions} className="me-2" />
                    {showAdvanced
                      ? "Temel Filtrelere Dön"
                      : "Gelişmiş Filtreler"}
                  </CButton>
                )}
              </CCol>
            </CRow>

            {/* Advanced Filters Section */}
            {advancedFiltersEnabled && (
              <CCollapse visible={showAdvanced}>
                <div
                  className="mt-4 pt-4 advanced-filters"
                  style={{
                    borderTop: "2px dashed #000",
                  }}
                >
                  <CRow className="g-3">
                    {/* Date Range Filter */}
                    <CCol md={6} lg={4}>
                      <CFormLabel
                        htmlFor="startDate"
                        className="fw-bold mb-2"
                        style={{
                          display: "inline-block",
                          background: "#66D2FB",
                          padding: "2px 8px",

                          border: "1px solid #000",
                        }}
                      >
                        Tarih Aralığı
                      </CFormLabel>
                      <CRow className="g-2">
                        <CCol>
                          <CFormInput
                            type="date"
                            id="startDate"
                            value={dateFilter.startDate}
                            onChange={(e) =>
                              onDateChange({
                                ...dateFilter,
                                startDate: e.target.value,
                              })
                            }
                            style={{
                              border: "2px solid #000",
                              borderRadius: "2px",
                              boxShadow: "3px 3px 0 rgba(0,0,0,0.2)",
                            }}
                          />
                        </CCol>
                        <CCol xs="auto" className="d-flex align-items-center">
                          <span
                            className="fw-bold"
                            style={{
                              width: "20px",
                              height: "3px",
                              background: "#000",
                              display: "block",
                            }}
                          ></span>
                        </CCol>
                        <CCol>
                          <CFormInput
                            type="date"
                            id="endDate"
                            value={dateFilter.endDate}
                            onChange={(e) =>
                              onDateChange({
                                ...dateFilter,
                                endDate: e.target.value,
                              })
                            }
                            style={{
                              border: "2px solid #000",
                              borderRadius: "2px",
                              boxShadow: "3px 3px 0 rgba(0,0,0,0.2)",
                            }}
                          />
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>
                </div>
              </CCollapse>
            )}
          </CForm>
        </CCardBody>
      </CCollapse>

      {/* Neo Brutalism Style */}
      <style jsx>{`
        .neo-brutalism-filter:hover {
          transform: translateY(-2px);
        }

        .neo-btn:hover {
          transform: translateY(-2px) rotate(-2deg) !important;
          box-shadow: 4px 4px 0 #000 !important;
        }

        .neo-btn:active {
          transform: translateY(0) rotate(0) !important;
          box-shadow: 2px 2px 0 #000 !important;
        }

        .dept-checkbox:hover {
          transform: translateY(-2px) rotate(-1deg);
          box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </CCard>
  );
};

export default DashboardFilters;
