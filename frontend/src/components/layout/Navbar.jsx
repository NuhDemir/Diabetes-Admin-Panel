// frontend/src/components/layout/Navbar.jsx
import React, { useState } from "react";
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderToggler,
  CCollapse,
  CHeaderNav,
  CNavItem,
  CNavLink,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMenu, cilHospital } from "@coreui/icons"; // Sadece gerekli ikonlar
// import { useTheme } from "../../context/ThemeContext"; // KALDIRILDI
import "../../assets/css/Navbar.css"; // Navbar'a özel stiller
import { Link } from "react-router-dom";

const Navbar = () => {
  const [visible, setVisible] = useState(false); // Mobil menü görünürlüğü
  // const { theme, toggleTheme } = useTheme(); // KALDIRILDI

  return (
    <CHeader className="nb-header sticky-top">
      <CContainer fluid>
        <CHeaderBrand href="#" className="nb-brand">
          <CIcon icon={cilHospital} className="nb-brand-icon" />
          <span className="nb-brand-text">FuAy Hastanesi</span>
        </CHeaderBrand>

        {/* Mobil için Toggler Butonu */}
        <CHeaderToggler
          className="ms-auto d-lg-none nb-toggler"
          onClick={() => setVisible(!visible)}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        {/* Navigasyon Linkleri (Mobil için açılır/kapanır) */}
        <CCollapse className="header-collapse d-lg-flex" visible={visible}>
          <CHeaderNav className="ms-auto nb-nav">
            <CNavItem className="nb-nav-item">
              <CNavLink
                as={Link}
                to="/"
                active={location.pathname === "/"}
                className="nb-nav-link"
              >
                Panel
              </CNavLink>
            </CNavItem>

            <CNavItem className="nb-nav-item">
              <CNavLink
                as={Link}
                to="/hastalar"
                className="nb-nav-link"
                // active={window.location.pathname === '/hastalar'}
              >
                Hastalar
              </CNavLink>
            </CNavItem>
            <CNavItem className="nb-nav-item">
              <CNavLink href="#" className="nb-nav-link">
                Raporlar
              </CNavLink>
            </CNavItem>
            {/* Tema Değiştirme Butonu KALDIRILDI veya işlevsiz bırakıldı */}
            {/*
            <CNavItem className="nb-nav-item ms-lg-3">
              <CButton
                // onClick={toggleTheme} // Bu fonksiyon artık yok
                className="nb-theme-toggle"
                aria-label="Tema Değiştir"
              >
                <CIcon icon={cilMoon} size="lg" /> // Veya sabit bir ikon
              </CButton>
            </CNavItem>
            */}
          </CHeaderNav>
        </CCollapse>
      </CContainer>
    </CHeader>
  );
};

// CButton sarmalayıcısı bu dosyada artık kullanılmıyor olabilir,
// eğer tema değiştirme butonu kaldırıldıysa.
// Genel bir buton bileşeni olarak başka bir yerde tutulabilir.
// const CButton = ({ children, className, ...props }) => {
//   return (
//     <button className={`btn ${className}`} {...props}>
//       {children}
//     </button>
//   );
// };

export default Navbar;
