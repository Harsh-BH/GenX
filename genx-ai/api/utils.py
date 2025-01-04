import os
from PIL import Image
import requests
from io import BytesIO
import uuid

def save_image(image):
    # Generate a unique filename using UUID
    unique_filename = f"{uuid.uuid4().hex}.png"

    # Define the path to the 'generated_images' folder within the 'static' directory
    image_path = os.path.join("static", "generated_images", unique_filename)

    # Ensure the 'generated_images' directory exists
    os.makedirs(os.path.dirname(image_path), exist_ok=True)

    # Save the PIL image to the specified path
    image.save(image_path)

    # Return the relative path for accessing the image via the FastAPI static files mount
    return f"/static/generated_images/{unique_filename}"

