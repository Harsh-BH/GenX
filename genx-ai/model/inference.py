import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "api")))

from huggingface_hub import InferenceClient
from config import HF_MODEL_ID, HF_TOKEN
from utils import save_image
from preprocess import preprocess_prompt

# Initialize the Hugging Face Inference Client
client = InferenceClient(HF_MODEL_ID, token=HF_TOKEN)

def generate_image(preprocessed_prompt):
    try:
        # Generate image using Hugging Face's model
        image = client.text_to_image(preprocessed_prompt)
        
        # Save the generated image
        image_path = save_image(image)
        
        return image_path
    
    except Exception as e:
        raise Exception(f"Error during image generation: {str(e)}")
