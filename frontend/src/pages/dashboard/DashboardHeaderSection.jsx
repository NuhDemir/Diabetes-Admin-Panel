import React from "react";
import ErrorMessage from "../../components/common/ErrorMessage"; // Doğru yolu kullan
import "../../assets/css/DashboardHeaderSection.css"; // We'll create this for our custom styling

const DashboardHeaderSection = ({ loading, error, refetchData }) => {
  return (
    <header className="neu-dashboard-header">
      <div className="neu-header-content">
        <div className="neu-title-container">
          <h1 className="neu-main-title">ULUSLARARASI FUAY HASTANESİ</h1>
          <div className="neu-subtitle-box">
            <h2 className="neu-subtitle">
              İÇ HASTALIKLARI - DİYABET ANALİZ PANELİ
            </h2>
          </div>
        </div>

        <div className="neu-description-container">
          <p className="neu-description">
            Bu panel, doktorların hasta verilerini görselleştirerek diyabet risk
            faktörlerini analiz etmelerine ve erken teşhise yardımcı olmak
            amacıyla tasarlanmıştır.
          </p>
        </div>

        <div className="neu-action-container">
          <button
            onClick={refetchData}
            disabled={loading}
            className={`neu-refresh-button ${loading ? "neu-loading" : ""}`}
          >
            {loading ? "YENİLENİYOR..." : "VERİLERİ YENİLE"}
          </button>
        </div>

        {error && (
          <div className="neu-error-container">
            <ErrorMessage message={`Veri yenilenirken hata: ${error}`} />
          </div>
        )}
      </div>

      <div className="neu-pattern-decoration"></div>
    </header>
  );
};

export default DashboardHeaderSection;
