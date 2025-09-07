from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import cv2
import numpy as np
import base64
import io

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = YOLO("yolov8n.pt")

class_map = {
    0: "Angus Cow",
    1: "Gertrudis Cow",
    2: "Zebu Cow",
    3: "Cape Buffalo",
    4: "Water Buffalo",
    5: "Angus Buffalo"
}

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        # In-memory image processing
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Invalid image file.")

        results = model(img)

        class_ids = results[0].boxes.cls.tolist()
        breed_name = class_map.get(int(class_ids[0]), "Unknown") if class_ids else "Unknown"

        annotated = results[0].plot()
        annotated_rgb = cv2.cvtColor(annotated, cv2.COLOR_BGR2RGB)
        _, buffer = cv2.imencode(".jpg", annotated_rgb)
        img_base64 = base64.b64encode(buffer).decode("utf-8")

        return JSONResponse(content={
            "breed": breed_name,
            "health": "Healthy",  # placeholder
            "image": img_base64
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
