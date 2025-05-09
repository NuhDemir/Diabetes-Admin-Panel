import React, { useMemo } from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CListGroup,
  CListGroupItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilWarning,
  cilArrowBottom,
  cilArrowTop,
  cilUserUnfollow,
} from "@coreui/icons";
import { BLOOD_PRESSURE_KEY } from "../../utils/dashboardCalculations";
import "../../assets/css/CriticalAlerts.css"; // We'll create this for our custom styling

const CRITICAL_GLUCOSE_HIGH = 180;
const CRITICAL_BP_LOW = 60;
const CRITICAL_BP_HIGH = 180;
const CRITICAL_BMI_HIGH = 40;

const CriticalAlerts = ({ data }) => {
  const alerts = useMemo(() => {
    if (!data || data.length === 0) return [];

    const highGlucosePatients = data.filter(
      (p) => p.Glucose > CRITICAL_GLUCOSE_HIGH
    ).length;

    const lowBpPatients = data.filter(
      (p) =>
        p[BLOOD_PRESSURE_KEY] &&
        p[BLOOD_PRESSURE_KEY] > 0 &&
        p[BLOOD_PRESSURE_KEY] < CRITICAL_BP_LOW
    ).length;

    const highBpPatients = data.filter(
      (p) => p[BLOOD_PRESSURE_KEY] && p[BLOOD_PRESSURE_KEY] > CRITICAL_BP_HIGH
    ).length;

    const highBmiPatients = data.filter(
      (p) => p.BMI > CRITICAL_BMI_HIGH
    ).length;

    const foundAlerts = [];
    if (highGlucosePatients > 0)
      foundAlerts.push({
        level: "danger",
        icon: cilWarning,
        text: `Yüksek Glikoz (> ${CRITICAL_GLUCOSE_HIGH})`,
        count: highGlucosePatients,
      });
    if (lowBpPatients > 0)
      foundAlerts.push({
        level: "warning",
        icon: cilArrowBottom,
        text: `Düşük Kan Basıncı (< ${CRITICAL_BP_LOW})`,
        count: lowBpPatients,
      });
    if (highBpPatients > 0)
      foundAlerts.push({
        level: "danger",
        icon: cilArrowTop,
        text: `Yüksek Kan Basıncı (> ${CRITICAL_BP_HIGH})`,
        count: highBpPatients,
      });
    if (highBmiPatients > 0)
      foundAlerts.push({
        level: "warning",
        icon: cilUserUnfollow,
        text: `Çok Yüksek BMI (> ${CRITICAL_BMI_HIGH})`,
        count: highBmiPatients,
      });
    return foundAlerts;
  }, [data]);

  // Determine background pattern based on alert count
  const patternClass =
    alerts.length > 0 ? "neu-pattern-active" : "neu-pattern-inactive";

  return (
    <CCard className={`neu-brutalism-card ${patternClass}`}>
      <CCardHeader className="neu-brutalism-header">
        <h5 className="neu-brutalism-title">KRİTİK DURUM UYARILARI</h5>
      </CCardHeader>
      <CCardBody
        className={
          alerts.length === 0
            ? "d-flex justify-content-center align-items-center neu-brutalism-body"
            : "neu-brutalism-body"
        }
      >
        {alerts.length === 0 ? (
          <p className="neu-brutalism-empty-text">
            KRİTİK EŞİKLERİ AŞAN HASTA BULUNMAMAKTADIR.
          </p>
        ) : (
          <CListGroup className="neu-brutalism-list">
            {alerts.map((alert, index) => (
              <CListGroupItem
                key={index}
                className={`neu-brutalism-list-item neu-${alert.level} ${
                  index % 2 === 0 ? "neu-even" : "neu-odd"
                }`}
              >
                <div className="neu-alert-content">
                  <div className="neu-alert-icon-box">
                    <CIcon icon={alert.icon} className="neu-alert-icon" />
                  </div>
                  <span className="neu-alert-text">{alert.text}</span>
                </div>
                <div className={`neu-alert-badge neu-badge-${alert.level}`}>
                  {alert.count}
                </div>
              </CListGroupItem>
            ))}
          </CListGroup>
        )}
      </CCardBody>
    </CCard>
  );
};

export default CriticalAlerts;
