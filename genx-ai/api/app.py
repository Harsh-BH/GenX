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
from postprocess import postprocess_image
from PIL import Image, ImageFilter
import uuid
from config import HF_MODEL_ID_TTI, HF_TOKEN ,HF_MODEL_ID_ITT
import aiohttp
import asyncio

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

FILTER_MAP = {
    "sharpen": ImageFilter.SHARPEN,
    "blur": ImageFilter.BLUR,
    "contour": ImageFilter.CONTOUR,
    "detail": ImageFilter.DETAIL,
    "edge_enhance": ImageFilter.EDGE_ENHANCE,
    "emboss": ImageFilter.EMBOSS,
    "smooth": ImageFilter.SMOOTH,
}

# Data model for filter request
class FilterRequest(BaseModel):
    image_url: str
    filter: str

async def fetch_image(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url, timeout=60) as response:
            if response.status != 200:
                raise HTTPException(status_code=400, detail="Failed to fetch the image.")
            return await response.read()

@app.post("/apply-filter")
async def api_apply_filter(request: FilterRequest):
    print("Applying filters")
    try:
        # Validate filter
        if request.filter not in FILTER_MAP and request.filter != "enhance_resolution":
            raise HTTPException(status_code=400, detail=f"Invalid filter: {request.filter}. Allowed filters: {list(FILTER_MAP.keys()) + ['enhance_resolution']}")

        # Validate and log image URL
        print(f"Image URL: {request.image_url}")
        from urllib.parse import urlparse
        parsed_url = urlparse(request.image_url)
        if not parsed_url.scheme or not parsed_url.netloc:
            raise HTTPException(status_code=400, detail="Invalid image URL.")

        # Fetch image asynchronously
        image_content = await fetch_image(request.image_url)

        # Save temporary image
        generated_images_dir = "static/generated_images"
        os.makedirs(generated_images_dir, exist_ok=True)
        temp_image_path = os.path.abspath(os.path.join(generated_images_dir, f"temp_{uuid.uuid4().hex}.png"))
        with open(temp_image_path, "wb") as f:
            f.write(image_content)

        # Apply filter
        output_image_path = os.path.abspath(os.path.join(generated_images_dir, f"filtered_{uuid.uuid4().hex}.png"))
        postprocess_image(temp_image_path, request.filter, output_image_path)

        # Cleanup temp file
        os.remove(temp_image_path)

        # Return filtered image URL
        return {"filtered_image_url": f"http://localhost:8000/static/generated_images/{os.path.basename(output_image_path)}"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error applying filter: {str(e)}")

# Other API routes
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
