// frontend/src/components/common/Card.jsx
import React from "react";
import { CCard, CCardBody } from "@coreui/react";

const Card = ({ children, className = "" }) => {
  return (
    <CCard className={className}>
      <CCardBody>{children}</CCardBody>
    </CCard>
  );
};

export default Card;
