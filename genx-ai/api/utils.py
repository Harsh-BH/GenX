import os
from PIL import Image
import requests
from io import BytesIO

def save_image(image):
    # Save the image locally or store it in cloud storage
    image_path = os.path.join("static", "generated_images", "image.png")
    
    # Ensure the directory exists
    os.makedirs(os.path.dirname(image_path), exist_ok=True)
    
    # Convert the PIL image object to a file and save
    image.save(image_path)
    
    return image_path
