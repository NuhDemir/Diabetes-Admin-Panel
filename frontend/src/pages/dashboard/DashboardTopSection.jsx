// frontend/src/pages/dashboard/components/DashboardTopSection.jsx
import React from "react";
import { CRow, CCol } from "@coreui/react";
import StatisticCard from "../../components/dashboard/StatisticCard"; // Güncellenmiş yolu kontrol et
import {
  cilPeople,
  cilSpeedometer,
  cilCalculator, // BMI için
  cilHeart,
  cilPregnant, // Kan basıncı için
} from "@coreui/icons";

const DashboardTopSection = ({ stats, className = "" }) => {
  return (
    <CRow className={`g-4 ${className}`}>
      {" "}
      {/* g-4: gutter (boşluk) */}
      <CCol lg={8} xl={9}>
        {" "}
        {/* İstatistikler daha fazla yer kaplasın */}
        <CRow className="g-3">
          {" "}
          {/* İstatistik kartları arası boşluk */}
          <CCol sm={6} md={4} xl={true} className="d-flex">
            {" "}
            {/* xl={true} ile eşit dağılım */}
            <StatisticCard
              title="Toplam Hasta"
              value={stats.totalPatients}
              icon={cilPeople}
              iconColor="primary"
              loading={!stats.totalPatients && stats.totalPatients !== 0}
            />
          </CCol>
          <CCol sm={6} md={4} xl={true} className="d-flex">
            <StatisticCard
              title="Ort. Glikoz"
              value={stats.avgGlucose}
              icon={cilSpeedometer}
              iconColor="info"
              loading={!stats.avgGlucose}
            />
          </CCol>
          <CCol sm={6} md={4} xl={true} className="d-flex">
            <StatisticCard
              title="Ort. BMI"
              value={stats.avgBMI}
              icon={cilCalculator}
              iconColor="success"
              loading={!stats.avgBMI}
            />
          </CCol>
          <CCol sm={6} md={6} xl={true} className="d-flex mt-md-0 mt-xl-0">
            {" "}
            {/* Mobil ve tablette yeni satıra geçebilir */}
            <StatisticCard
              title="Ort. Kan Basıncı"
              value={stats.avgBloodPressure}
              icon={cilHeart}
              iconColor="warning"
              loading={!stats.avgBloodPressure}
            />
          </CCol>
          <CCol sm={12} md={6} xl={true} className="d-flex mt-md-0 mt-xl-0">
            <StatisticCard
              title="Ort. Gebelik Sayısı"
              value={stats.avgPregnancies}
              icon={cilPregnant}
              iconColor="danger"
              loading={!stats.avgPregnancies}
            />
          </CCol>
        </CRow>
      </CCol>
      <CCol lg={4} xl={3} className="d-flex">
        {" "}
        {/* Uyarılar */}
      </CCol>
    </CRow>
  );
};

export default DashboardTopSection;
