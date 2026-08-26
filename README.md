# 💎 GemVal AI — Makine Öğrenmesi Elmas Fiyat Tahmin Sistemi

> Kursta eğitilen **Scikit-Learn (SVR)** Makine Öğrenmesi Modelini, **FastAPI** REST API servisi ve **Next.js 14 / React** arayüzü ile buluşturan modern tam donanımlı (Full-Stack) AI projesi.

---

## 🌟 Proje Özellikleri

- 💎 **Dinamik Visual Elmas Motoru**: Kullanıcının seçtiği Karat (boyut), Kesim (parıltı) ve Renk (D şeffaf buz mavisinden J ılık sarı tonuna) özelliklerine göre canlı renk ve boyut değiştiren SVG Elmas simülatörü.
- ⚡ **Gerçek Zamanlı ML Fiyat Tahmini**: 50.000+ elmas verisiyle eğitilmiş Support Vector Regression (SVR) makine öğrenmesi modeliyle anlık fiyat tahmini.
- 🎯 **Hızlı Test Şablonları (Presets)**: "1.0 ct Ideal Solitaire", "2.0 ct Flawless Luxury" gibi tek tıkla dolan hazır elmas şablonları.
- 📐 **Akıllı Boyut Hesaplayıcı (Auto-Dimensions)**: Kullanıcı elmasın X, Y, Z (mm) milimetre boyutlarını bilmese bile Karat değerine göre otomatik standart ölçü üretme.
- 🏛️ **Clean Decoupled Mimari**: Python ML Microservice (FastAPI) ile Modern Web UI (Next.js + Tailwind CSS) arasında tam bağımsız REST API iletişimi.

---

## 🏗️ Makine Öğrenmesi Boru Hattı (Pipeline)

Kursta eğitilen ve `30-diamond_model_complete.pkl` dosyasında saklanan ML boru hattı tam olarak şu adımları izler:

```
┌───────────────────────────────────────────────────────────┐
│              Next.js 14 Frontend (React)                   │
│   (Tailwind CSS, Framer Motion, Visual SVG Configurator)  │
└─────────────────────────────┬─────────────────────────────┘
                              │ REST API (JSON)
                              ▼
┌───────────────────────────────────────────────────────────┐
│               FastAPI ML Backend Microservice             │
│                       (app.py)                            │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
        ┌───────────────────────────────────────────┐
        │       30-diamond_model_complete.pkl       │
        ├───────────────────────────────────────────┤
        │ 1. Girdi Özellikleri (Carat, Cut, Color...)│
        │ 2. LabelEncoders (Cut, Color, Clarity)    │
        │ 3. StandardScaler (Ölçeklendirme)         │
        │ 4. Support Vector Regressor (SVR Model)   │
        └───────────────────────────────────────────┘
```

1. **Girdi Özellikleri (Raw Features)**: `carat`, `cut`, `color`, `clarity`, `depth`, `table`, `x`, `y`, `z`.
2. **Etiket Kodlama (LabelEncoder)**: Kategorik olan `cut`, `color`, `clarity` sütunları sayısal değerlere dönüştürülür.
3. **Standart Ölçekleme (StandardScaler)**: Veriler ortalaması 0, standart sapması 1 olacak şekilde ölçeklenir.
4. **SVR Tahmini (Support Vector Regression)**: Model elmasın tahmini fiyatını (`predicted_price`) $ cinsinden hesaplar.

---

## 🛠️ Teknolojiler

### Makine Öğrenmesi & Backend
- **Python 3.12**
- **Scikit-Learn**: Support Vector Regression (SVR), StandardScaler, LabelEncoder
- **FastAPI & Uvicorn**: Asenkron REST API sunucusu ve CORS desteği
- **Pandas & Pydantic**: Veri işleme ve girdi doğrulama

### Arayüz (Frontend)
- **Next.js 14+ (App Router)**
- **React 19 & TypeScript**
- **Tailwind CSS v4**: Dark mode & Glassmorphism tasarım
- **Framer Motion**: Akıcı mikro animasyonlar
- **Lucide Icons**: Modern ikon seti

---

## 🚀 Yerel Kurulum ve Çalıştırma

### 1. Python FastAPI Backend Sunucusunu Başlatma

```bash
# Proje ana dizinindeyken
cd DiamondProject

# Sanal ortamı aktifleştirin
source .venv/bin/activate

# Gerekli kütüphaneleri yükleyin (Eğer yüklü değilse)
pip install -r requirements.txt

# FastAPI sunucusunu 8000 portunda başlatın
uvicorn app:app --reload --port 8000
```
Backend API adresiniz: `http://127.0.0.1:8000`

---

### 2. Next.js Frontend Arayüzünü Başlatma

```bash
# Frontend klasörüne geçin
cd frontend

# Bağımlılıkları yükleyin
npm install

# Geliştirici sunucusunu başlatın
npm run dev
```
Arayüz adresiniz: `http://localhost:3000`

---

## 📡 API Uç Noktaları (Endpoints)

### `POST /predict`
Elmas özelliklerini alarak SVR makine öğrenmesi modeliyle tahmini fiyatı döndürür.

**İstek (Request Body):**
```json
{
  "carat": 1.0,
  "cut": "Ideal",
  "color": "E",
  "clarity": "VS1",
  "depth": 61.5,
  "table": 57.0,
  "x": 6.45,
  "y": 6.48,
  "z": 3.98
}
```

**Yanıt (Response):**
```json
{
  "predicted_price": 5593.98,
  "price_per_carat": 5593.98,
  "tier": "High Investment"
}
```

---

## 📄 Lisans
MIT License
