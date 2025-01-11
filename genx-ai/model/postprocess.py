import os
from PIL import Image, ImageFilter
from RealESRGAN import RealESRGAN
import torch

# Directory for generated images
generated_images_dir = "static/generated_images"
os.makedirs(generated_images_dir, exist_ok=True)

# Mapping of filter keywords to their respective operations
FILTER_MAP = {
    "sharpen": ImageFilter.SHARPEN,
    "blur": ImageFilter.BLUR,
    "contour": ImageFilter.CONTOUR,
    "detail": ImageFilter.DETAIL,
    "edge_enhance": ImageFilter.EDGE_ENHANCE,
    "emboss": ImageFilter.EMBOSS,
    "smooth": ImageFilter.SMOOTH,
}

# Function to enhance resolution using RealESRGAN
import os
import torch

def enhance_resolution(image, model_weights="weights/models--sberbank-ai--Real-ESRGAN/snapshots/8110204ebf8d25c031b66c26c2d1098aa831157e/RealESRGAN_x4.pth", scale=4):
    # Build the absolute path to the weights file
    model_weights = os.path.join(os.path.dirname(__file__), model_weights)

    # Check if the weights file exists
    if not os.path.exists(model_weights):
        raise FileNotFoundError(f"Weights file not found: {model_weights}")

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = RealESRGAN(device, scale=scale)
    model.load_weights(model_weights, download=True)
    sr_image = model.predict(image)
    return sr_image

# Function to apply filters based on the frontend keywords
def postprocess_image(image_path, filter_name, output_image_path):
    """
    Applies the specified filter to the input image.

    Args:
        image_path (str): Path to the input image.
        filter_name (str): The filter to apply (e.g., "sharpen", "blur").
        output_image_path (str): Path to save the processed image.

    Returns:
        None
    """
    image = Image.open(image_path)

    # Check if the filter name is valid
    if filter_name not in FILTER_MAP and filter_name != "enhance_resolution":
        raise ValueError(f"Invalid filter: {filter_name}. Allowed filters: {list(FILTER_MAP.keys()) + ['enhance_resolution']}")

    if filter_name == "enhance_resolution":
        # Apply enhance resolution
        processed_image = enhance_resolution(image)
    else:
        # Apply standard PIL filters
        processed_image = image.filter(FILTER_MAP[filter_name])

    # Save the processed image
    processed_image.save(output_image_path)
