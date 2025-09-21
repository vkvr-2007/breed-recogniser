from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np

app = FastAPI()

# Allow CORS (Streamlit + Expo Go frontend can call)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in dev allow all, later restrict to frontend IP
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
buffalo_model = YOLO("models/buffalo_v1.pt")
cow_model = YOLO("models/cow_v1.pt")

@app.post("/predict/")
async def predict(file: UploadFile = File(...), animal: str = "cow"):
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Invalid image file.")

        if animal.lower() == "cow":
            model = cow_model
        elif animal.lower() == "buffalo":
            model = buffalo_model
        else:
            raise ValueError("Invalid animal type. Use 'cow' or 'buffalo'.")

        results = model(img)
        probs = results[0].probs
        breed_name = model.names[int(probs.top1)]
        confidence = float(probs.top1conf)

        return JSONResponse(content={
            "animal": animal,
            "breed": breed_name,
            "confidence": round(confidence, 3),
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def root():
    return {"status": "ok", "message": "FastAPI backend running"}
