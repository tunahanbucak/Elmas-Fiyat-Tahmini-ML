from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import pickle
import pandas as pd
from pydantic import BaseModel, Field
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

app = FastAPI(
    title="Elmas Fiyat Tahmin API",
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

# Templates
templates = Jinja2Templates(directory="templates")

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


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/api/presets")
async def get_presets():
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
            "title": "2.0 Karat Yatırımlık Kusursuz",
            "description": "D Rengi ve IF berraklıkta koleksiyonluk elmas",
            "features": {
                "carat": 2.0,
                "cut": "Ideal",
                "color": "D",
                "clarity": "IF",
                "depth": 62.0,
                "table": 56.0,
                "x": 8.10,
                "y": 8.13,
                "z": 5.03
            }
        },
        {
            "id": "budget_sparkle",
            "title": "0.5 Karat Günlük Şık Elmas",
            "description": "Uygun fiyatlı ve temiz kesimli zarif elmas",
            "features": {
                "carat": 0.5,
                "cut": "Very Good",
                "color": "G",
                "clarity": "SI1",
                "depth": 62.8,
                "table": 58.0,
                "x": 5.05,
                "y": 5.08,
                "z": 3.18
            }
        },
        {
            "id": "statement_gem",
            "title": "3.0 Karat Özel Koleksiyon",
            "description": "Yüksek karat ağırlığı ve mükemmel cila",
            "features": {
                "carat": 3.0,
                "cut": "Premium",
                "color": "F",
                "clarity": "VVS2",
                "depth": 61.2,
                "table": 59.0,
                "x": 9.25,
                "y": 9.29,
                "z": 5.67
            }
        }
    ]


@app.post("/predict")
@app.post("/api/predict")
async def predict(features: DiamondFeatures):
    # Giriş özellikleriyle bir DataFrame oluşturun
    input_dict = features.model_dump()
    input_data = pd.DataFrame([input_dict])

    # Kaydedilen etiket kodlayıcılarını uygulayın
    for col in ['cut', 'color', 'clarity']:
        input_data[col] = encoders[col].transform(input_data[col])

    # Kaydedilen standart ölçekleyiciyi uygulayın
    input_scaled = scaler.transform(input_data)

    # Tahmin yap (SVR modeli tek çıktı üretir)
    raw_prediction = float(model.predict(input_scaled)[0])
    
    # Fiyatın pozitif olmasını sağla
    predicted_price = max(100.0, raw_prediction)
    price_per_carat = predicted_price / max(0.01, features.carat)

    # Arayüz rozeti için fiyat aralığı etiketi (ML çıktısı değildir, UI yardımcısıdır)
    if predicted_price < 1500:
        tier = "Ekonomik Segment"
    elif predicted_price < 5000:
        tier = "Prestij Mücevher"
    elif predicted_price < 15000:
        tier = "Yatırımlık Segment"
    else:
        tier = "Özel Koleksiyon / Lüks"

    return {
        "predicted_price": round(predicted_price, 2),
        "price_per_carat": round(price_per_carat, 2),
        "tier": tier,
        "features": input_dict
    }
