// frontend/src/services/api.js
import axios from "axios";

// Backend adresini merkezi bir yerden alalım (örneğin .env veya config)
// Şimdilik doğrudan yazalım:
const API_URL = "http://localhost:5000/api/diabetes";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchDiabetesData = async () => {
  try {
    console.log("Fetching data from:", apiClient.defaults.baseURL); // Debug
    const response = await apiClient.get("/"); // Ana endpoint'e GET isteği
    console.log("API Response:", response.data); // Debug
    if (response.data && response.data.success) {
      return response.data.data; // Verinin kendisini döndür
    } else {
      throw new Error(response.data.message || "API'den veri alınamadı.");
    }
  } catch (error) {
    console.error(
      "API isteği sırasında hata:",
      error.response ? error.response.data : error.message
    );
    // Axios hatasıysa daha detaylı bilgi ver
    const message =
      error.response?.data?.message ||
      error.message ||
      "Veri çekilirken bir hata oluştu.";
    throw new Error(message);
  }
};

// İleride başka API çağrıları eklenirse buraya eklenebilir
// export const addDiabetesRecord = async (record) => { ... }
