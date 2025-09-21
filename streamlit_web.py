import streamlit as st
import requests
from deep_translator import GoogleTranslator

# ---------------- Config ----------------
st.set_page_config(page_title="Smart Livestock Analyzer", layout="centered")
st.title("🐄 Smart Livestock Analyzer – Cow & Buffalo Breed Detection")

if "page" not in st.session_state:
    st.session_state.page = "page1"
if "animal_type" not in st.session_state:
    st.session_state.animal_type = None
if "uploaded_file" not in st.session_state:
    st.session_state.uploaded_file = None
if "analysis_type" not in st.session_state:
    st.session_state.analysis_type = None
if "language" not in st.session_state:
    st.session_state.language = "en"
if "dark_mode" not in st.session_state:
    st.session_state.dark_mode = False

# ---------------- Translator ----------------
translator = GoogleTranslator(source='auto', target=st.session_state.language)
def t(text):
    if st.session_state.language == "en":
        return text
    try:
        return GoogleTranslator(source='auto', target=st.session_state.language).translate(text)
    except:
        return text

# ---------------- CSS ----------------
def apply_css():
    if st.session_state.dark_mode:
        st.markdown(
            """<style>
                body { background-color: #1e1e1e; color: white; }
                .stButton>button { background-color: #444; color: white; border-radius: 8px; }
            </style>""", unsafe_allow_html=True)
    else:
        st.markdown(
            """<style>
                body { background-color: white; color: black; }
                .stButton>button { background-color: #007BFF; color: white; border-radius: 8px; }
            </style>""", unsafe_allow_html=True)

    st.markdown("""<style>
        div.stButton { display: flex; justify-content: center; }
    </style>""", unsafe_allow_html=True)

apply_css()

# ---------------- Sidebar ----------------
st.sidebar.header("🌐 Language")
lang_choice = st.sidebar.selectbox(
    "Choose your language:",
    options={
        "en": "English",
        "hi": "Hindi",
        "te": "Telugu",
        "ta": "Tamil",
        "bn": "Bengali",
        "kn": "Kannada"
    }.items(),
    format_func=lambda x: x[1]
)
st.session_state.language = lang_choice[0]

if st.sidebar.button("🌞 / 🌙 Toggle Mode"):
    st.session_state.dark_mode = not st.session_state.dark_mode
    st.rerun()

# Backend API URL
API_URL = "http://127.0.0.1:8000/predict/"  # if same PC
# API_URL = "http://192.168.xx.xx:8000/predict/"  # if calling from phone

# ---------------- Page 1: Select Animal ----------------
if st.session_state.page == "page1":
    st.subheader(t("Step 1: Select Animal Type"))

    animal = st.radio(
        t("Which animal do you want to analyze?"),
        (t("Cow"), t("Buffalo")),
        index=None
    )

    if st.button(t("Submit")):
        if animal:
            if "Cow" in animal or "గోవు" in animal or "गाय" in animal:
                st.session_state.animal_type = "cow"
            else:
                st.session_state.animal_type = "buffalo"
            st.session_state.page = "page2"
            st.rerun()
        else:
            st.warning("⚠️ " + t("Please select an option before proceeding."))

# ---------------- Page 2: Upload Image ----------------
elif st.session_state.page == "page2":
    st.subheader(t(f"Step 2: Upload a {st.session_state.animal_type.capitalize()} Image"))

    uploaded_file = st.file_uploader(
        t(f"Upload an image of the {st.session_state.animal_type}"),
        type=["jpg", "jpeg", "png"]
    )

    if st.button(t("Submit")):
        if uploaded_file:
            st.session_state.uploaded_file = uploaded_file
            st.session_state.page = "page3"
            st.rerun()
        else:
            st.warning("⚠️ " + t("Please upload an image before proceeding."))

    if st.button("⬅ " + t("Back")):
        st.session_state.page = "page1"
        st.rerun()

# ---------------- Page 3: Select Analysis ----------------
elif st.session_state.page == "page3":
    st.subheader(t("Step 3: Select Analysis Type"))

    col1, col2 = st.columns([1, 2])

    with col1:
        if st.session_state.uploaded_file:
            st.image(st.session_state.uploaded_file, caption=t("Uploaded Image"), use_container_width=True)

    with col2:
        analysis = st.radio(
            t("Choose what you want to analyze:"),
            (t("Breed Analysis"), t("Health Analysis"), t("Cost Analysis")),
            index=None
        )

        if st.button(t("Submit")):
            if analysis:
                st.session_state.analysis_type = analysis
                st.success("✅ " + t("You selected: ") + analysis)

                if "Breed" in analysis:
                    with st.spinner("🔍 " + t("Processing image...")):
                        try:
                            files = {"file": st.session_state.uploaded_file.getvalue()}
                            data = {"animal": st.session_state.animal_type}
                            response = requests.post(API_URL, files={"file": st.session_state.uploaded_file.getvalue()}, data=data)
                            if response.status_code == 200:
                                result = response.json()
                                st.success(f"🐮 {t('Detected Breed')}: **{result['breed']}** ({result['confidence']*100:.1f}% confidence)")
                            else:
                                st.error(f"❌ {t('Error from server:')} {response.text}")
                        except Exception as e:
                            st.error(f"⚠️ {t('Failed to connect to backend:')} {e}")

                else:
                    st.info("ℹ️ " + t("This feature is coming soon."))

            else:
                st.warning("⚠️ " + t("Please select an option before proceeding."))

        if st.button("⬅ " + t("Back")):
            st.session_state.page = "page2"
            st.rerun()
