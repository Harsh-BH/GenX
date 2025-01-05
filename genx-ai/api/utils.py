import os
from PIL import Image
import uuid
import logging

def save_image(image):
    try:
        print("save image is called")

        # Since Dockerfile is in genx-ai, use that as base
        temp_dir = "/app/static/temp"  # Changed from /app/genx-ai/static/temp
        print(f"Temp directory path: {temp_dir}")

        # Generate a unique filename
        unique_filename = f"{uuid.uuid4().hex}.png"

        # Create the full path for the image
        image_path = os.path.join(temp_dir, unique_filename)
        print(f"Attempting to save to: {image_path}")

        # Ensure the directory exists with proper permissions
        os.makedirs(temp_dir, mode=0o777, exist_ok=True)

        # Save the image
        image.save(image_path, format='PNG')
        print(f"Image saved successfully at: {image_path}")

        # Return the relative path for static file serving
        return f"/static/temp/{unique_filename}"

    except Exception as e:
        print(f"Error details: {str(e)}")
        logging.error(f"Error saving image: {str(e)}")
        raise