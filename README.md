[Fuay Hastanesi Diabetes Panel](https://github.com/NuhDemir/Diabetes-Admin-Panel/blob/main/img/image.png?raw=true)

# Uluslararası FuAy Hastanesi - Diyabet Analiz Paneli

Bu proje, Uluslararası FuAy Hastanesi iç hastalıkları servisinde görev yapan doktorların, diyabet hastalığına ilişkin risk faktörlerini daha iyi analiz edebilmeleri ve erken müdahale şansını artırabilmeleri amacıyla geliştirilmiş web tabanlı bir gösterge panelidir.

Panel, hastaların sağlık verilerini (glikoz, kan basıncı, BMI vb.) görselleştirerek doktorların hızlı ve etkili değerlendirmeler yapmasına olanak tanır. Ayrıca, farklı yaş grupları ve risk seviyelerine göre detaylı filtreleme seçenekleri sunar.

## 🌟 Özellikler

*   **Genel İstatistikler:**
    *   Filtrelenmiş verilere göre toplam hasta sayısı.
    *   Ortalama BMI, glikoz seviyesi, gebelik sayısı ve kan basıncı değerleri.
*   **Diyabet Risk Segmentasyonu:**
    *   Hastaların Yüksek, Orta ve Düşük risk gruplarına göre dağılımını gösteren pasta grafiği.
*   **Trend ve Dağılım Analizleri:**
    *   Glikoz ve kan basıncı değerlerinin yaşa göre değişimini gösteren scatter plotlar.
    *   Yaş, BMI ve gebelik sayısı dağılımlarını gösteren bar grafikler.
*   **Korelasyon Analizi:**
    *   Glikoz ve BMI arasındaki ilişkiyi risk grubuna göre renklendirilmiş scatter plot ile görselleştirme.
*   **Etkileşimli Filtreler:**
    *   Yaş aralığı ve risk seviyesine göre verileri filtreleme imkanı.
    *   Filtreleri tek tuşla temizleme.
*   **Kritik Durum Uyarıları:**
    *   Belirli eşik değerleri (yüksek glikoz, düşük/yüksek kan basıncı, yüksek BMI) aşan hasta sayılarını gösteren uyarı bölümü.
*   **Hasta Veri Tablosu:**
    *   Filtrelenmiş hasta verilerinin detaylı olarak incelenebileceği, sayfalanmış bir tablo.
*   **Veri Yenileme:**
    *   API'den en güncel verileri çekmek için yenileme butonu.
*   **Animasyonlu Giriş Ekranı (Splash Screen):**
    *   Uygulama açılışında kullanıcıyı karşılayan kısa bir animasyon.
*   **Responsive Tasarım:**
    *   Farklı ekran boyutlarına (mobil, tablet, masaüstü) uyum sağlayan arayüz.

## 🛠️ Kullanılan Teknolojiler

**Frontend:**

*   **React:** Kullanıcı arayüzü geliştirmek için JavaScript kütüphanesi.
*   **Vite:** Hızlı ve modern bir frontend build aracı.
*   **Axios:** HTTP istekleri yapmak için kullanılan promise tabanlı kütüphane.
*   **Chart.js & react-chartjs-2:** Etkileşimli grafikler oluşturmak için.
*   **CSS:** Modern CSS teknikleri ile stil ve duyarlılık.

**Backend:**

*   **Node.js:** Sunucu tarafı JavaScript çalışma ortamı.
*   **Express.js:** Node.js için minimalist ve esnek web uygulama çatısı.
*   **MongoDB & Mongoose:** NoSQL veritabanı ve ODM (Object Data Modeling) kütüphanesi.
*   **Dotenv:** Ortam değişkenlerini yönetmek için.
*   **CORS:** Kaynaklar arası paylaşıma izin vermek için.
*   **(CSV Parser):** Başlangıç verilerini CSV dosyasından okumak için (seed script'inde).

**Genel:**

*   **Git & GitHub:** Versiyon kontrolü ve kod barındırma.
*   **Netlify:** Frontend uygulamasının canlıya alınması (deployment).

## 📁 Proje Yapısı (Özet)

diabetes-admin-panel/
├── backend/ # Node.js & Express API
│ ├── config/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── services/
│ ├── scripts/ # Veri yükleme script'i (seed)
│ ├── .env.example
│ ├── package.json
│ └── server.js
├── frontend/ # React & Vite Uygulaması
│ ├── public/
│ ├── src/
│ │ ├── assets/ # CSS, resimler vb.
│ │ ├── components/ # Yeniden kullanılabilir UI bileşenleri (common, dashboard)
│ │ ├── config/ # Uygulama yapılandırmaları (örn: Chart.js)
│ │ ├── hooks/ # Özel React hook'ları (örn: useDiabetesData)
│ │ ├── pages/ # Ana sayfa ve alt düzen bileşenleri
│ │ ├── services/ # API çağrıları
│ │ ├── utils/ # Yardımcı fonksiyonlar (hesaplamalar, helpers)
│ │ ├── App.jsx
│ │ └── index.js # (veya main.jsx Vite için)
│ ├── .env.example # Frontend ortam değişkenleri için örnek
│ ├── index.html
│ └── package.json
├── .gitignore
└── README.md # Bu dosya
## 🚀 Kurulum ve Çalıştırma

### Ön Koşullar

*   Node.js (v16 veya üzeri önerilir)
*   npm veya yarn
*   MongoDB (yerel veya bulut tabanlı bir instance)
*   Git

### Backend Kurulumu

1.  Proje ana dizinindeyken `backend` klasörüne gidin:
    ```bash
    cd backend
    ```
2.  Gerekli bağımlılıkları yükleyin:
    ```bash
    npm install
    # veya
    yarn install
    ```
3.  `.env.example` dosyasını kopyalayarak `.env` adında yeni bir dosya oluşturun ve kendi MongoDB URI'nizi ve port numaranızı girin:
    ```
    MONGO_URI=mongodb://localhost:27017/DiabetesDB
    PORT=5000
    ```
4.  (Opsiyonel) Başlangıç verilerini MongoDB'ye yüklemek için CSV dosyasının (`diabetes_new.csv` veya `diabetes.csv`) `backend/scripts/` klasöründe olduğundan emin olun ve seed script'ini çalıştırın (eğer `importCsv.js` ise):
    ```bash
    node scripts/importCsv.js
    # veya package.json'da tanımlıysa:
    # npm run seed
    ```
5.  Backend sunucusunu başlatın:
    ```bash
    npm start
    # veya geliştirme için (nodemon kuruluysa):
    # npm run server
    ```
    Sunucu varsayılan olarak `http://localhost:5000` adresinde çalışacaktır.

### Frontend Kurulumu

1.  Proje ana dizinindeyken `frontend` klasörüne gidin:
    ```bash
    cd frontend
    ```
2.  Gerekli bağımlılıkları yükleyin:
    ```bash
    npm install
    # veya
    yarn install
    ```
3.  `.env.example` dosyasını kopyalayarak `.env` adında yeni bir dosya oluşturun. Eğer backend farklı bir adreste çalışıyorsa `VITE_API_URL` (Vite için) veya `REACT_APP_API_URL` (Create React App için) değişkenini güncelleyin:
    ```dotenv
    # Vite için .env dosyası örneği
    VITE_API_URL=http://localhost:5000/api/diabetes
    ```
4.  Frontend geliştirme sunucusunu başlatın:
    ```bash
    npm run dev  # Vite için
    # veya
    # npm start    # Create React App için
    ```
    Uygulama genellikle `http://localhost:5173` (Vite) veya `http://localhost:3000` (CRA) adresinde açılacaktır.

## ☁️ Canlıya Alma (Deployment)

Frontend uygulaması Netlify üzerinden kolayca canlıya alınabilir:

1.  Projenizi bir GitHub repository'sine yükleyin.
2.  Netlify'da yeni bir site oluşturun ve GitHub repository'nizi bağlayın.
3.  Build ayarlarını aşağıdaki gibi yapılandırın (örnek Vite için):
    *   **Base directory:** `frontend/`
    *   **Build command:** `npm run build` (veya `yarn build`)
    *   **Publish directory:** `frontend/dist` (Vite için) veya `frontend/build` (CRA için)
4.  **ÖNEMLİ:** Backend API'nizin canlı URL'sini Netlify ortam değişkenlerine (örn: `VITE_API_URL`) ekleyin.
5.  Netlify, push işlemlerinizde sitenizi otomatik olarak güncelleyecektir.

Backend uygulaması için Render, Railway, Heroku gibi platformlar kullanılabilir.

## 🤝 Katkıda Bulunma

Katkılarınız ve önerileriniz her zaman kabulümüzdür! Lütfen bir "issue" açın veya bir "pull request" gönderin.

## 📜 Lisans

Bu proje [MIT Lisansı](LICENSE.md) ile lisanslanmıştır. (Eğer bir lisans dosyası eklerseniz bu linki güncelleyin.)

---

Umarım bu proje, Uluslararası FuAy Hastanesi doktorlarına diyabet yönetiminde yardımcı olur!
