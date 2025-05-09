import React, { useState, useEffect } from "react";
import { CCard, CCardBody, CSpinner } from "@coreui/react";
import CIcon from "@coreui/icons-react";

const StatisticCard = ({
  title,
  value,
  icon,
  iconColor = "primary",
  loading,
  trend = null, // Trend: 'up', 'down', or null
  trendValue = null, // Trend value: '+15%', '-3%', etc.
  className = "",
  variant = "default", // Options: default, outline, minimal
}) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [prevValue, setPrevValue] = useState(value);
  const [showValueChange, setShowValueChange] = useState(false);

  // Color mapping for Neo Brutalism
  const colorMap = {
    primary: { bg: "#4571FF", text: "#000000", accent: "#FFD166" },
    secondary: { bg: "#A682FF", text: "#000000", accent: "#06D6A0" },
    success: { bg: "#06D6A0", text: "#000000", accent: "#FFD166" },
    danger: { bg: "#FF5C5C", text: "#000000", accent: "#06D6A0" },
    warning: { bg: "#FFD166", text: "#000000", accent: "#4571FF" },
    info: { bg: "#3FCCDC", text: "#000000", accent: "#FF5C5C" },
    dark: { bg: "#2C2C2A", text: "#FFFFFF", accent: "#FFD166" },
    light: { bg: "#F8F9FA", text: "#000000", accent: "#A682FF" },
  };

  const color = colorMap[iconColor] || colorMap.primary;

  // Animate when value changes
  useEffect(() => {
    if (prevValue !== value && !loading && value !== undefined) {
      setPrevValue(value);
      setShowValueChange(true);
      setIsAnimated(true);

      const timer = setTimeout(() => {
        setIsAnimated(false);
        setShowValueChange(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [value, loading]);

  // Generate random rotation for Neo Brutalism effect
  const getRandomRotation = () => {
    const rotations = [-2, -1, 0, 1, 2];
    return rotations[Math.floor(Math.random() * rotations.length)];
  };

  const rotation = getRandomRotation();

  // Determine border style based on variant
  const getBorderStyle = () => {
    switch (variant) {
      case "outline":
        return {
          border: `3px solid ${color.bg}`,
          boxShadow: `5px 5px 0 ${color.bg}`,
        };
      case "minimal":
        return {
          borderLeft: `10px solid ${color.bg}`,
          boxShadow: "3px 3px 0 rgba(0,0,0,0.2)",
        };
      default:
        return {
          border: "3px solid #000000",
          boxShadow: "6px 6px 0 #000000",
        };
    }
  };

  return (
    <CCard
      className={`h-100 statistic-card-custom neo-brutalism-stat ${className} ${
        isAnimated ? "pulse-animation" : ""
      }`}
      style={{
        transform: `rotate(${rotation}deg)`,
        borderRadius: "3px",
        overflow: "visible",
        transition: "all 0.3s ease",
        backgroundColor: variant === "default" ? color.bg : "#FFFFFF",
        ...getBorderStyle(),
      }}
    >
      {/* Neo Brutalism decorative elements */}
      {variant === "default" && (
        <>
          <div
            className="neo-decoration-dot"
            style={{
              position: "absolute",
              top: "-8px",
              right: "-8px",
              width: "20px",
              height: "20px",
              backgroundColor: color.accent,
              border: "2px solid #000000",
              borderRadius: "50%",
              zIndex: 1,
            }}
          ></div>
          <div
            className="neo-decoration-line"
            style={{
              position: "absolute",
              bottom: "-5px",
              left: "15%",
              width: "30px",
              height: "10px",
              backgroundColor: color.accent,
              border: "2px solid #000000",
              zIndex: 0,
            }}
          ></div>
        </>
      )}

      <CCardBody
        className="d-flex align-items-center p-4"
        style={{
          position: "relative",
        }}
      >
        {loading ? (
          <div className="w-100 text-center">
            <CSpinner
              style={{
                border: "3px solid #000",
                borderTopColor: "transparent",
                width: "2rem",
                height: "2rem",
              }}
            />
          </div>
        ) : (
          <>
            {icon && (
              <div
                className="icon-wrapper-stat d-flex align-items-center justify-content-center me-4"
                style={{
                  width: "60px",
                  height: "60px",
                  backgroundColor: variant === "default" ? "#FFFFFF" : color.bg,
                  border: "3px solid #000000",
                  borderRadius: variant === "minimal" ? "3px" : "12px",
                  transform: "rotate(-3deg)",
                  position: "relative",
                  boxShadow: "3px 3px 0 #000000",
                }}
              >
                <CIcon
                  icon={icon}
                  size="xl"
                  style={{
                    color: variant === "default" ? color.bg : "#FFFFFF",
                    filter: "drop-shadow(1px 1px 0 rgba(0,0,0,0.3))",
                  }}
                />
              </div>
            )}

            <div style={{ flex: 1 }}>
              <div
                className="text-uppercase fw-bold small mb-1"
                style={{
                  color: variant === "default" ? "#FFFFFF" : "#000000",
                  backgroundColor:
                    variant === "default" ? "rgba(0,0,0,0.2)" : color.bg,
                  padding: "3px 8px",
                  display: "inline-block",
                  transform: "rotate(-1deg)",
                  letterSpacing: "1px",
                  border: variant !== "default" ? "2px solid #000000" : "none",
                  position: "relative",
                  top: "-5px",
                  boxShadow:
                    variant !== "default" ? "2px 2px 0 #000000" : "none",
                }}
              >
                {title}
              </div>

              <div
                className="fs-3 fw-bold d-flex align-items-center"
                style={{
                  color: variant === "default" ? "#FFFFFF" : "#000000",
                  textShadow:
                    variant === "default" ? "1px 1px 0 #000000" : "none",
                }}
              >
                {value !== undefined && value !== null ? (
                  <>
                    <span>{value}</span>

                    {/* Value change indicator */}
                    {showValueChange && trend && (
                      <span
                        className={`ms-2 fs-6 ${
                          trend === "up" ? "trend-up" : "trend-down"
                        }`}
                        style={{
                          padding: "2px 6px",
                          backgroundColor:
                            trend === "up" ? "#06D6A0" : "#FF5C5C",
                          color: "#000000",
                          border: "2px solid #000000",
                          borderRadius: "3px",
                          fontWeight: "bold",
                          animation: "fadeInOut 2s ease-in-out",
                          boxShadow: "2px 2px 0 #000000",
                        }}
                      >
                        {trendValue}
                      </span>
                    )}
                  </>
                ) : (
                  <span
                    style={{
                      backgroundColor:
                        variant === "default"
                          ? "rgba(255,255,255,0.3)"
                          : "rgba(0,0,0,0.1)",
                      padding: "0 10px",
                      borderRadius: "3px",
                    }}
                  >
                    N/A
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </CCardBody>

      {/* Styling for animations and hover effects */}
      <style jsx>{`
        .neo-brutalism-stat:hover {
          transform: translateY(-3px) rotate(${rotation}deg);
          box-shadow: ${variant === "default"
            ? "8px 8px 0 #000000"
            : "6px 6px 0 rgba(0,0,0,0.2)"};
        }

        .pulse-animation {
          animation: pulse 0.5s ease-in-out;
        }

        @keyframes pulse {
          0% {
            transform: scale(1) rotate(${rotation}deg);
          }
          50% {
            transform: scale(1.03) rotate(${rotation}deg);
          }
          100% {
            transform: scale(1) rotate(${rotation}deg);
          }
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          20% {
            opacity: 1;
            transform: translateY(0);
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        .trend-up {
          transform: rotate(-3deg);
        }

        .trend-down {
          transform: rotate(3deg);
        }
      `}</style>
    </CCard>
  );
};

export default StatisticCard;
