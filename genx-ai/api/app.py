from fastapi import FastAPI, HTTPException, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import sys
import requests
from huggingface_hub import InferenceClient
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "model")))
from preprocess import preprocess_prompt
from inference import generate_image, image_to_text
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse


from config import HF_MODEL_ID_TTI, HF_TOKEN ,HF_MODEL_ID_ITT

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (you can specify domains if needed)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")
client = InferenceClient(HF_MODEL_ID_TTI, token=HF_TOKEN)


# API Routes
class ImageRequest(BaseModel):
    prompt: str

@app.post("/generate-image")
async def api_generate_image(request: ImageRequest):
    print("API is called")

    try:
        preprocessed_prompt = preprocess_prompt(request.prompt)
        print("Processing the prompt...")
        image_path = generate_image(preprocessed_prompt)
        return {"message": "Image generated successfully", "image_path": image_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/image-to-text")
async def api_image_to_text(file: UploadFile):
    try:
        file_path = f"temp/{file.filename}"
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "wb") as f:
            f.write(file.file.read())

        result_text = image_to_text(file_path)

        os.remove(file_path)

        return {"message": "Image to text conversion successful", "text": result_text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
async def root():
    return FileResponse("static/index.html")  # Serve the HTML file

