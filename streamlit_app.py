import streamlit as st
import requests

# Page setup
st.set_page_config(page_title="Breed Identifier", layout="centered")
st.title("🐄 Cattle Breed Confirmation System")
st.write("""
Upload an image of the cattle and our system will process it using advanced image recognition algorithms to confirm its breed and provide health insights.
""")

# Upload section
uploaded_file = st.file_uploader("Choose an image file (jpg, jpeg, png)", type=["jpg", "jpeg", "png"])

if uploaded_file is not None:
    st.image(uploaded_file, caption="Uploaded Image", use_column_width=True)
    
    if st.button("Confirm Breed"):
        with st.spinner("Processing image..."):
            files = {"file": uploaded_file.getvalue()}
            backend_url = "http://localhost:5000/predict"
            
            try:
                response = requests.post(backend_url, files=files)
                data = response.json()
                
                if "error" in data:
                    st.error(f"Backend error: {data['error']}")
                else:
                    st.success("✅ Breed Confirmation Results")
                    col1, col2 = st.columns(2)
                    col1.metric("Breed", data.get('breed', 'N/A'))
                    col2.metric("Health", data.get('health', 'N/A'))
                    
            except Exception as e:
                st.error(f"Could not connect to backend: {e}")
else:
    st.info("Please upload an image to start the confirmation process.")