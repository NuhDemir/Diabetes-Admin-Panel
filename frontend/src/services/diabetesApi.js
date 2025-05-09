// frontend/src/services/api.js (veya diabetesApi.js)
import axios from "axios";

// --- CANLI BACKEND API ADRESİ ---
// Render'dan aldığınız tam API yolunu buraya girin.
// Eğer ana API yolunuz /api/diabetes ise, onu da ekleyin.
// Örnek: Eğer Render URL'niz sadece ana domain ise ve endpoint'ler /api/diabetes ile başlıyorsa:
const API_BASE_URL = "https://diabetes-admin-panel.onrender.com"; // Bu sizin Render servisinizin ana adresi
const API_ENDPOINT_PATH = "/api/diabetes"; // API endpoint'lerinizin başladığı yol

// Tam API URL'sini oluştur
const API_URL = `${API_BASE_URL}${API_ENDPOINT_PATH}`;

// Alternatif olarak, eğer Render URL'niz zaten /api/diabetes içeriyorsa:
// const API_URL = "https://diabetes-admin-panel.onrender.com/api/diabetes";

// --- ORTAM DEĞİŞKENİ KULLANIMI (DAHA İYİ YÖNTEM) ---
// Lokal geliştirme ve canlı ortam arasında kolay geçiş için .env dosyası kullanmak en iyisidir.
// Aşağıdaki satırı aktif hale getirin ve .env dosyanızı kullanın:
// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/diabetes";
// `.env` dosyanızda (projenin frontend kök dizininde):
// VITE_API_URL=https://diabetes-admin-panel.onrender.com/api/diabetes

console.log("Kullanılan API URL:", API_URL); // Hangi URL'nin kullanıldığını kontrol etmek için

const apiClient = axios.create({
  baseURL: API_URL, // Axios baseURL olarak tam API yolunu kullanacak
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchDiabetesData = async () => {
  try {
    // baseURL zaten tam yolu içerdiği için, apiClient.get('/') doğrudan /api/diabetes'e (veya ne tanımladıysanız ona) gider.
    console.log(
      "Veri çekiliyor (fetchDiabetesData):",
      apiClient.defaults.baseURL
    );
    const response = await apiClient.get("/"); // Bu, baseURL'e ek olarak `/` isteği yapar.
    // Yani: https://diabetes-admin-panel.onrender.com/api/diabetes/

    console.log("API Yanıtı (fetchDiabetesData):", response.data);
    if (response.data && response.data.success) {
      return response.data.data; // Verinin kendisini döndür
    } else {
      // API'den gelen hata mesajını veya varsayılan bir mesajı fırlat
      throw new Error(
        response.data?.message || "API'den veri alınamadı veya yanıt başarısız."
      );
    }
  } catch (error) {
    console.error(
      "API isteği sırasında hata (fetchDiabetesData):",
      error.response ? JSON.stringify(error.response.data) : error.message // response.data'yı stringe çevir
    );
    // Axios hatası veya diğer ağ hataları için daha detaylı mesaj
    const message =
      error.response?.data?.message || // API'den gelen özel hata mesajı
      error.message || // Axios veya ağ hatası mesajı
      "Veri çekilirken bir hata oluştu.";
    throw new Error(message);
  }
};

// Diğer API fonksiyonları buraya eklenebilir.
// Örneğin, eğer bir 'predict' endpoint'iniz varsa:
/*
export const predictDiabetesApi = async (patientData) => {
  try {
    console.log("Tahmin için veri gönderiliyor:", patientData);
    // baseURL zaten tam yolu içerdiği için, apiClient.post('/predict', ...)
    // https://diabetes-admin-panel.onrender.com/api/diabetes/predict adresine gider.
    const response = await apiClient.post("/predict", patientData);

    console.log("API Tahmin Yanıtı:", response.data);
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || "API tahmini başarısız.");
    }
  } catch (error) {
    console.error(
      "API Tahmin Hatası:",
      error.response ? JSON.stringify(error.response.data) : error.message
    );
    const message =
      error.response?.data?.message ||
      error.message ||
      "Tahmin alınırken bir hata oluştu.";
    throw new Error(message);
  }
};
*/
