// frontend/src/hooks/useDiabetesData.js
import { useState, useEffect, useCallback } from "react";
// Artık fetchDashboardDataApi'yi kullanacağız, fetchDiabetesData'yı değil
import { fetchDashboardDataApi } from "../services/diabetesApi"; // API fonksiyonunu güncelle

// calculateRisk'e burada artık genellikle ihtiyaç yok, çünkü RiskLevel backend'den gelecek.
// Eğer başka bir amaçla frontend'de anlık risk hesaplaması için tutmak isterseniz kalabilir.
// import { calculateRisk } from '../utils/riskHelper.js';

const useDiabetesData = (
  initialFilters = { minAge: "", maxAge: "", riskLevel: "All" }
) => {
  // dashboardData artık backend'den gelen tüm hesaplanmış veriyi (stats, grafik verileri, filtrelenmiş hastalar) tutacak.
  // rawData ve dataWithRisk state'lerine artık ihtiyaç yok.
  const [dashboardData, setDashboardData] = useState(null);
  const [filters, setFilters] = useState(initialFilters); // Filtreleri hook içinde yönet
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Veri yükleme fonksiyonu artık filtreleri parametre olarak alacak
  const loadData = useCallback(async (currentFilters) => {
    setLoading(true);
    setError(null);
    console.log("HOOK: Loading dashboard data with filters:", currentFilters);
    try {
      // Backend'den filtrelenmiş ve hesaplanmış veriyi çek
      const dataFromApi = await fetchDashboardDataApi(currentFilters);
      console.log("HOOK: Dashboard data received from API:", dataFromApi);
      setDashboardData(dataFromApi);
    } catch (err) {
      setError(err.message);
      console.error("useDiabetesData Hook Hatası:", err);
      setDashboardData(null); // Hata durumunda veriyi temizle
    } finally {
      setLoading(false);
      console.log("HOOK: Loading finished.");
    }
  }, []); // Bağımlılık yok, çünkü loadData'yı useEffect içinde filtreler değiştiğinde çağıracağız

  // Filtreler değiştiğinde veya component ilk yüklendiğinde veriyi çek
  useEffect(() => {
    loadData(filters);
  }, [filters, loadData]); // filters veya loadData (kendisi useCallback ile sarmalı) değiştiğinde çalışır

  // Dışarıdan filtreleri güncellemek için bir fonksiyon
  const updateFilters = useCallback((newFilterValues) => {
    // Sadece değişen filtreleri al, diğerlerini koru (merge)
    // Veya spesifik filtreleri güncelle: örn: { type: 'AGE_MIN', value: 20 }
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, ...newFilterValues };
      console.log("HOOK: Filters updated:", updatedFilters);
      return updatedFilters;
    });
  }, []);

  // Veriyi mevcut filtrelerle yeniden yüklemek için fonksiyon
  const refetchData = useCallback(() => {
    console.log("HOOK: Refetching data with current filters:", filters);
    loadData(filters);
  }, [filters, loadData]);

  return {
    dashboardData, // Bu artık { stats: {}, riskDistribution: {}, ..., filteredPatients: [] } gibi bir obje olacak
    loading,
    error,
    filters, // Mevcut filtreleri dışa aktar, böylece sayfa bileşeni inputları doldurabilir
    updateFilters, // Sayfa bileşeninin filtreleri değiştirmesi için
    refetchData, // Sayfa bileşeninin veriyi manuel olarak yenilemesi için
  };
};

export default useDiabetesData;
