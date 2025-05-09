import React from "react";
import { CAlert, CCloseButton } from "@coreui/react";
import PropTypes from "prop-types";

const ErrorMessage = ({
  message = "Bir hata oluştu.",
  severity = "danger",
  className = "",
  dismissible = true,
  showIcon = true,
  onClose = () => {},
}) => {
  const [visible, setVisible] = React.useState(true);

  const handleClose = () => {
    setVisible(false);
    onClose();
  };

  const icons = {
    danger: "❌",
    warning: "⚠️",
    success: "✅",
    info: "ℹ️",
  };

  if (!visible) return null;

  return (
    <CAlert
      color={severity}
      className={`d-flex align-items-center justify-content-between text-center ${className}`}
    >
      <div className="d-flex align-items-center mx-auto">
        {showIcon && <span className="me-2">{icons[severity]}</span>}
        <span>{message}</span>
      </div>
      {dismissible && <CCloseButton className="ms-3" onClick={handleClose} />}
    </CAlert>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string,
  severity: PropTypes.oneOf(["danger", "warning", "success", "info"]),
  className: PropTypes.string,
  dismissible: PropTypes.bool,
  showIcon: PropTypes.bool,
  onClose: PropTypes.func,
};

export default ErrorMessage;
