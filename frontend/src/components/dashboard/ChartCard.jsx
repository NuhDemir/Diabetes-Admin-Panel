import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CSpinner,
  CButton,
  CTooltip,
  CCollapse,
} from "@coreui/react";
import {
  cilReload,
  cilOptions,
  cilChart,
  cilFullscreen,
  cilX,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";

const ChartCard = ({
  title,
  children,
  isLoading,
  error,
  noData,
  className = "",
  onRefresh,
  actions = [],
  description,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Animate content when loading completes
    if (!isLoading) {
      const timer = setTimeout(() => setFadeIn(true), 100);
      return () => clearTimeout(timer);
    }
    return () => setFadeIn(false);
  }, [isLoading]);

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const handleRefresh = () => {
    setFadeIn(false);
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <CCard
      className={`chart-card-custom ${className} ${
        fullscreen ? "fullscreen-card" : ""
      }`}
      style={{
        transition: "all 0.3s ease",
        height: fullscreen ? "100vh" : "100%",
        width: fullscreen ? "100vw" : "100%",
        position: fullscreen ? "fixed" : "relative",
        top: fullscreen ? 0 : "auto",
        left: fullscreen ? 0 : "auto",
        zIndex: fullscreen ? 1050 : "auto",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        border: "none",
        borderRadius: "0.5rem",
        overflow: "hidden",
      }}
    >
      {title && (
        <CCardHeader
          className="d-flex justify-content-between align-items-center py-3"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}
        >
          <div className="d-flex align-items-center">
            <CIcon icon={cilChart} size="sm" className="text-primary me-2" />
            <h6 className="mb-0 card-title">{title}</h6>
            {description && (
              <CTooltip content="Bilgi göster">
                <CButton
                  color="link"
                  size="sm"
                  className="p-0 ms-2"
                  onClick={() => setShowDescription(!showDescription)}
                >
                  <span className="badge bg-light text-dark">i</span>
                </CButton>
              </CTooltip>
            )}
          </div>
          <div className="d-flex chart-actions">
            {actions.map((action, index) => (
              <React.Fragment key={index}>{action}</React.Fragment>
            ))}
            {onRefresh && (
              <CTooltip content="Yenile">
                <CButton
                  color="link"
                  size="sm"
                  className="text-body-secondary p-0 ms-2"
                  onClick={handleRefresh}
                >
                  <CIcon
                    icon={cilReload}
                    size="lg"
                    className={isLoading ? "rotate-animation" : ""}
                  />
                </CButton>
              </CTooltip>
            )}
            <CTooltip content={collapsed ? "Genişlet" : "Daralt"}>
              <CButton
                color="link"
                size="sm"
                className="text-body-secondary p-0 ms-2"
                onClick={() => setCollapsed(!collapsed)}
              >
                <CIcon icon={collapsed ? cilOptions : cilOptions} size="lg" />
              </CButton>
            </CTooltip>
            <CTooltip content={fullscreen ? "Küçült" : "Tam Ekran"}>
              <CButton
                color="link"
                size="sm"
                className="text-body-secondary p-0 ms-2"
                onClick={toggleFullscreen}
              >
                <CIcon icon={fullscreen ? cilX : cilFullscreen} size="lg" />
              </CButton>
            </CTooltip>
          </div>
        </CCardHeader>
      )}

      <CCollapse visible={showDescription}>
        <div className="chart-description p-3 bg-light border-bottom">
          <p className="mb-0 small">{description}</p>
        </div>
      </CCollapse>

      <CCardBody
        className={`d-flex justify-content-center align-items-center p-4 ${
          collapsed ? "collapsed-chart" : ""
        }`}
        style={{
          height: collapsed ? "100px" : "auto",
          minHeight: collapsed ? "0" : "300px",
          overflow: "hidden",
          transition: "min-height 0.3s ease",
        }}
      >
        <div
          className={`chart-wrapper-custom w-100 ${fadeIn ? "fade-in" : ""}`}
          style={{
            opacity: fadeIn ? 1 : 0,
            transition: "opacity 0.5s ease",
            height: "100%",
            position: "relative",
          }}
        >
          {isLoading && (
            <div className="chart-loader text-center position-absolute top-50 start-50 translate-middle">
              <CSpinner color="primary" size="sm" />
              <span className="ms-2 text-muted small">Yükleniyor...</span>
            </div>
          )}

          {error && (
            <div className="chart-error text-center position-absolute top-50 start-50 translate-middle w-75">
              <div className="text-danger mb-2">
                <CIcon icon={cilX} size="xl" />
              </div>
              <p className="text-danger small">Grafik yüklenemedi: {error}</p>
              {onRefresh && (
                <CButton
                  color="outline-primary"
                  size="sm"
                  onClick={handleRefresh}
                >
                  Tekrar Dene
                </CButton>
              )}
            </div>
          )}

          {!isLoading && !error && noData && (
            <div className="chart-no-data text-center position-absolute top-50 start-50 translate-middle w-75">
              <p className="text-medium-emphasis small">
                Bu grafik için veri bulunamadı.
              </p>
              {onRefresh && (
                <CButton
                  color="outline-primary"
                  size="sm"
                  onClick={handleRefresh}
                >
                  Yenile
                </CButton>
              )}
            </div>
          )}

          {!isLoading && !error && !noData && children}
        </div>
      </CCardBody>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        .fade-in {
          animation: fadeIn 0.5s ease forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .rotate-animation {
          animation: rotate 1s linear infinite;
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .fullscreen-card {
          animation: expandCard 0.3s ease forwards;
        }

        @keyframes expandCard {
          from {
            transform: scale(0.95);
            opacity: 0.9;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .collapsed-chart {
          max-height: 100px;
          overflow: hidden;
        }
      `}</style>
    </CCard>
  );
};

export default ChartCard;
