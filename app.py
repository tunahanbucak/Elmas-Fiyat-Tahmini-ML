from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pickle
import pandas as pd
from pydantic import BaseModel, Field

app = FastAPI(
    title="GemVal AI — Elmas Fiyat Tahmin API",
    description="SVR Makine Öğrenmesi Modeli Tabanlı Elmas Değerleme API Servisi",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model, encoders, and scaler saved during course training
with open("30-diamond_model_complete.pkl", "rb") as f:
    saved_data = pickle.load(f)
    model = saved_data["model"]
    encoders = saved_data["encoders"]
    scaler = saved_data["scaler"]


class DiamondFeatures(BaseModel):
    carat: float = Field(..., example=1.0, description="Elmasın karat ağırlığı")
    cut: str = Field(..., example="Ideal", description="Kesim kalitesi: Fair, Good, Very Good, Premium, Ideal")
    color: str = Field(..., example="G", description="Renk derecesi: J - D arası")
    clarity: str = Field(..., example="VS1", description="Berraklık derecesi: I1 - IF arası")
    depth: float = Field(..., example=61.5, description="Derinlik yüzdesi")
    table: float = Field(..., example=57.0, description="Tabla genişlik yüzdesi")
    x: float = Field(..., example=6.45, description="Uzunluk (mm)")
    y: float = Field(..., example=6.48, description="Genişlik (mm)")
    z: float = Field(..., example=3.98, description="Derinlik (mm)")


@app.get("/")
def home():
    return {
        "status": "online",
        "service": "GemVal AI Diamond Price Prediction API",
        "version": "1.0.0",
        "documentation": "/docs",
        "endpoints": {
            "predict": "/predict (POST)",
            "presets": "/api/presets (GET)",
            "docs": "/docs"
        }
    }


@app.get("/api/presets")
def get_presets():
    """Arayüzde hızlı seçim için önceden tanımlanmış örnek elmaslar"""
    return [
        {
            "id": "ideal_solitaire",
            "title": "1.0 Karat İdeal Tektaş",
            "description": "Yüksek parlaklığa sahip evlilik yüzüğü standardı",
            "features": {
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
        },
        {
            "id": "flawless_luxury",
            "title": "2.0 Karat Flawless Koleksiyon",
            "description": "Kusursuz berraklık ve renksiz nadir yatırım elması",
            "features": {
                "carat": 2.0,
                "cut": "Ideal",
                "color": "D",
                "clarity": "IF",
                "depth": 60.8,
                "table": 56.0,
                "x": 8.10,
                "y": 8.13,
                "z": 4.94
            }
        },
        {
            "id": "daily_sparkler",
            "title": "0.5 Karat Günlük Şık",
            "description": "Fiyat/performans oranı yüksek zarif tasarım",
            "features": {
                "carat": 0.5,
                "cut": "Very Good",
                "color": "G",
                "clarity": "VS2",
                "depth": 62.1,
                "table": 58.0,
                "x": 5.12,
                "y": 5.15,
                "z": 3.19
            }
        },
        {
            "id": "high_carat_investment",
            "title": "3.5 Karat Yüksek Yatırım",
            "description": "Büyük karatlı koleksiyonluk yüksek segment taş",
            "features": {
                "carat": 3.5,
                "cut": "Premium",
                "color": "F",
                "clarity": "VVS1",
                "depth": 61.2,
                "table": 59.0,
                "x": 9.65,
                "y": 9.70,
                "z": 5.92
            }
        }
    ]


@app.post("/predict")
@app.post("/api/predict")
def predict(features: DiamondFeatures):
    try:
        # Create single-row DataFrame for features
        df = pd.DataFrame([{
            'carat': features.carat,
            'cut': features.cut,
            'color': features.color,
            'clarity': features.clarity,
            'depth': features.depth,
            'table': features.table,
            'x': features.x,
            'y': features.y,
            'z': features.z
        }])

        # Encode categorical columns
        for col in ['cut', 'color', 'clarity']:
            df[col] = encoders[col].transform(df[col])

        # Scale all features
        scaled_features = scaler.transform(df)

        # Make price prediction
        prediction = model.predict(scaled_features)[0]

        # Ensure prediction is positive
        predicted_price = round(max(0.0, float(prediction)), 2)
        price_per_carat = round(predicted_price / max(0.01, features.carat), 2)

        # Market tier classification
        tier = "Standart Segment"
        if predicted_price > 10000:
            tier = "Lüks Koleksiyon"
        elif predicted_price > 5000:
            tier = "Yatırımlık Segment"
        elif predicted_price > 2000:
            tier = "Fine Jewelry"

        return {
            "predicted_price": predicted_price,
            "price_per_carat": price_per_carat,
            "tier": tier,
            "isBackendConnected": True,
            "features": features.model_dump()
        }

    except Exception as e:
        return {"error": str(e)}
