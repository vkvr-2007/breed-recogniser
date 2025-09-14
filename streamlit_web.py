import streamlit as st
import requests
import base64
from PIL import Image
import io

st.title("🐄 Animal Breed Recognizer")

uploaded_file = st.file_uploader("Upload an image", type=["jpg", "jpeg", "png"])

if uploaded_file is not None:
    st.image(uploaded_file, caption="Uploaded Image", use_container_width=True)


    if st.button("Predict"):
        files = {"file": uploaded_file.getvalue()}
        res = requests.post("https://breed-recogniser-2.onrender.com", files=files)

        if res.status_code == 200:
            data = res.json()

            st.success(f"Prediction: {data['breed']}")
            st.info(f"Health: {data['health']}")

            if "image" in data:
                img_bytes = base64.b64decode(data["image"])
                img = Image.open(io.BytesIO(img_bytes))
                st.image(img, caption="Detected", use_column_width=True)

        else:
            st.error("Prediction failed 💀")
