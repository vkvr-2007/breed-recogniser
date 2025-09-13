from ultralytics import YOLO

# Load pre-trained YOLOv8 small classification model
model = YOLO("yolov8n-cls.pt")

# Train on buffalo dataset using buffalo.yaml
model.train(
    data=r"C:\Users\REHAN\OneDrive\Desktop\project\buffallo_dataset",
    epochs=50,
    imgsz=224,
    
)
