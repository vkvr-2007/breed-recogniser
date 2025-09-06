from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO

app = FastAPI()
model = YOLO("best.pt")

#breed names
class_map = {
    0: "Angus Cow",
    1: "Gertrudis Cow",
    2: "Zebu Cow",
    3: "Cape Buffalo",
    4: "Water Buffalo",
    5: "Angus Buffalo"
}

@app.get("/")
def read_root():
    return {"message": "Backend is running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read() #(read uploaded image)
        

        with open("temp.jpg", "wb") as f: #(save image temporarily)
            f.write(contents)

        
        results = model("temp.jpg") #(run YOLO prediction)

        
        class_ids = results[0].boxes.cls.tolist() #(parse results)
        if class_ids:
            breed_name = class_map.get(int(class_ids[0]), "Unknown")
            health_status = "Healthy"  # placeholder
            return {"breed": breed_name, "health": health_status}
        else:
            return {"breed": "Unknown", "health": "Unknown"}
        
        
    except Exception as e:
        return {"error": str(e)}
