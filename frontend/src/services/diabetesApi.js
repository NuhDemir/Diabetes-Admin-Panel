import axios from "axios";

// --- API ADRESİ YAPILANDIRMASI ---
const BASE_API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/diabetes";

const IS_DEVELOPMENT = import.meta.env.DEV;

if (IS_DEVELOPMENT) {
  console.log("[API] BASE URL:", BASE_API_URL);
}

const apiClient = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Backend'den filtrelenmiş ve hesaplanmış dashboard verilerini alır.
 * @param {object} filters - { minAge, maxAge, riskLevel, sampleSize } gibi filtreler.
 * @returns {Promise<object>} - API'den gelen dashboard verisi.
 */
export const fetchDashboardDataApi = async (filters = {}) => {
  try {
    const queryParams = {
      ...filters,
      // Sayısal değerlerin string değil sayı olarak gönderilmesini sağla (isteğe bağlı)
      minAge: filters.minAge ? Number(filters.minAge) : undefined,
      maxAge: filters.maxAge ? Number(filters.maxAge) : undefined,
      sampleSize: filters.sampleSize ? Number(filters.sampleSize) : 100, // Default 100
    };

    if (IS_DEVELOPMENT) {
      console.log("[API] İstek yapılıyor: /dashboard", queryParams);
    }

    const response = await apiClient.get("/dashboard", {
      params: queryParams,
    });

    if (response.data?.success && response.data?.data) {
      if (IS_DEVELOPMENT) {
        console.log(
          "[API] Dashboard verisi alındı:",
          Object.keys(response.data.data)
        );
      }
      return response.data.data;
    } else {
      const message =
        response.data?.message ||
        "Dashboard verisi alınamadı. API yanıt formatı hatalı olabilir.";
      throw new Error(message);
    }
  } catch (error) {
    let message = "Bilinmeyen bir hata oluştu.";
    if (error.response) {
      console.error("[API] Yanıt hatası:", error.response.data);
      message = error.response.data?.message || `HTTP ${error.response.status}`;
    } else if (error.request) {
      console.error("[API] Sunucuya ulaşılamadı:", error.request);
      message = "Sunucuya ulaşılamıyor. Ağ bağlantısını kontrol edin.";
    } else {
      console.error("[API] Hata:", error.message);
      message = error.message;
    }
    throw new Error(message);
  }
};
