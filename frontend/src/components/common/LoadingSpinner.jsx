// frontend/src/components/common/LoadingSpinner.jsx
import React from "react";
import { CSpinner } from "@coreui/react";
// import '../../assets/css/components.css'; // Bu CSS sınıfına artık çok ihtiyaç olmayabilir

const LoadingSpinner = ({
  message = "Yükleniyor...",
  size = "lg",
  color = "primary",
}) => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-center py-5">
      <CSpinner
        color={color}
        size={size === "lg" ? undefined : size}
        style={size === "lg" ? { width: "3rem", height: "3rem" } : {}}
      />
      {message && <p className="mt-3 text-muted">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
