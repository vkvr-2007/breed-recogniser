import streamlit as st
import requests

st.set_page_config(page_title="Cattle Breed & Health Prediction", layout="centered")
st.title("Cattle Breed & Health Prediction")

st.write("Upload an image of the cattle, and the system will predict the breed and health status.")

# Image upload
uploaded_file = st.file_uploader("Upload a cattle image", type=["jpg", "jpeg", "png"])

if uploaded_file is not None:
    st.image(uploaded_file, caption="Uploaded Image", use_column_width=True)
    
    # Predict button
    if st.button("Predict"):
        with st.spinner("Predicting... Please wait!"):
            # Convert uploaded file to bytes
            files = {"file": uploaded_file.getvalue()}
            
            # Replace this with your backend API URL
            backend_url = "http://localhost:5000/predict"
            
            try:
                response = requests.post(backend_url, files=files)
                data = response.json()
                
                if "error" in data:
                    st.error(f"Backend Error: {data['error']}")
                else:
                    # Display predictions
                    st.success("✅ Prediction Results")
                    st.write(f"**Breed:** {data.get('breed', 'N/A')}")
                    st.write(f"**Health:** {data.get('health', 'N/A')}")
                    
            except Exception as e:
                st.error(f"Error connecting to backend: {e}")
