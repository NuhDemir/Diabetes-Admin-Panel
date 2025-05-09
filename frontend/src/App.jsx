// frontend/src/App.jsx
import React, { useState, useEffect, Suspense } from "react"; // Suspense eklendi
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"; // react-router-dom importları
import { CContainer, CSpinner } from "@coreui/react";
import Navbar from "./components/layout/Navbar";
import SplashScreen from "./pages/SplashScreen";

// CSS importları
import "./assets/css/SplashScreen.css";
import "./assets/css/Navbar.css";
import "./assets/css/main.css";
// import "./assets/css/PatientsPage.css"; // Sayfa özelindeki CSS'i burada veya sayfada import et

const SPLASH_DURATION = 3000;

// Sayfaları lazy loading ile yükleyelim (performans için)
const DiabetesDashboardPage = React.lazy(() =>
  import("./pages/DiabetesDashboardPage")
);
const PatientsPage = React.lazy(() => import("./pages/PatientsPage")); // Yeni sayfa

function App() {
  const [showSplash, setShowSplash] = useState(true);
  // isContentLoaded state'i artık her sayfa için Suspense ile yönetilebilir
  // const [isContentLoaded, setIsContentLoaded] = useState(false);

  useEffect(() => {
    const splashTimer = setTimeout(() => setShowSplash(false), SPLASH_DURATION);
    // const contentTimer = setTimeout(() => setIsContentLoaded(true), SPLASH_DURATION + 300);
    return () => {
      clearTimeout(splashTimer);
      // clearTimeout(contentTimer);
    };
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Router>
      {" "}
      {/* Uygulamayı Router ile sarmala */}
      <div className="app-wrapper">
        <Navbar />
        <main className="app-main-content">
          {/* Suspense, lazy loaded component'ler yüklenirken fallback gösterir */}
          <Suspense
            fallback={
              <div
                className="page-loading-spinner"
                style={{ minHeight: "calc(100vh - 100px)" }}
              >
                <CSpinner
                  color="primary"
                  style={{ width: "2.5rem", height: "2.5rem" }}
                />
                <p className="mt-3 text-muted small">Sayfa yükleniyor...</p>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<DiabetesDashboardPage />} />
              <Route path="/hastalar" element={<PatientsPage />} />
              {/* Başka route'lar buraya eklenebilir */}
              <Route
                path="*"
                element={
                  // Eşleşmeyen yollar için
                  <CContainer className="py-5 text-center">
                    <h2>404 - Sayfa Bulunamadı</h2>
                    <p>Aradığınız sayfa mevcut değil.</p>
                    <Link to="/" className="btn btn-primary">
                      Ana Sayfaya Dön
                    </Link>
                  </CContainer>
                }
              />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
}

export default App;
