from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://192.168.29.215:5000/predict/"],  # Replace later with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Rehan’s models
buffalo_model = YOLO("../models/buffalo_v1.pt")
cow_model = YOLO("../models/cow_v1.pt")


@app.post("/predict/")
async def predict(file: UploadFile = File(...), animal: str = "cow"):
    """
    Upload image + specify animal type ('cow' or 'buffalo')
    """
    try:
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Invalid image file.")

        # Pick model
        if animal.lower() == "cow":
            model = cow_model
        elif animal.lower() == "buffalo":
            model = buffalo_model
        else:
            raise ValueError("Invalid animal type. Use 'cow' or 'buffalo'.")

        # Run prediction
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
