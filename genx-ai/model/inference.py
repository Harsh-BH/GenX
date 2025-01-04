import sys
import os
import requests
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "api")))
from huggingface_hub import InferenceClient
from config import HF_MODEL_ID_TTI, HF_TOKEN ,HF_MODEL_ID_ITT
from utils import save_image

client = InferenceClient(HF_MODEL_ID_TTI, token=HF_TOKEN)

def generate_image(preprocessed_prompt):

    print("generate image is called")
    try:

        image = client.text_to_image(preprocessed_prompt)

        image_path = save_image(image)

        return image_path

    except Exception as e:
        raise Exception(f"Error during image generation: {str(e)}")


def image_to_text(image_filename):
    try:

        with open(image_filename, "rb") as image_file:
            image_data = image_file.read()

        response = requests.post(HF_MODEL_ID_ITT, headers=HF_TOKEN, data=image_data)

        if response.status_code == 200:
            text_result = response.json().get("text", "")
            return text_result
        else:
            raise Exception(f"API responded with status {response.status_code}: {response.text}")

    except Exception as e:
        raise Exception(f"Error during image-to-text conversion: {str(e)}")


