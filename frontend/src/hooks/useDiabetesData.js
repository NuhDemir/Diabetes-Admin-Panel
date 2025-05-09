// frontend/src/hooks/useDiabetesData.js
import { useState, useEffect, useCallback } from "react";
import { fetchDiabetesData } from "../services/diabetesApi";
import { calculateRisk } from "../utils/riskHelper.js"; // Risk hesaplamayı import et

const useDiabetesData = () => {
  const [rawData, setRawData] = useState([]);
  const [dataWithRisk, setDataWithRisk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDiabetesData();
      setRawData(data); // Ham veriyi sakla

      // Veriye risk seviyesini ekle
      const processedData = data.map((patient) => ({
        ...patient,
        RiskLevel: calculateRisk(patient),
      }));
      setDataWithRisk(processedData); // İşlenmiş veriyi sakla
    } catch (err) {
      setError(err.message);
      console.error("useDiabetesData Hook Hatası:", err);
    } finally {
      setLoading(false);
    }
  }, []); // Bağımlılık yok, sadece ilk yüklemede çalışır

  useEffect(() => {
    fetchData();
  }, [fetchData]); // fetchData useCallback ile sarmalandığı için sorun olmaz

  return { rawData, dataWithRisk, loading, error, refetchData: fetchData };
};

export default useDiabetesData;
