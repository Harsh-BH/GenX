import os
import shutil
from PIL import Image, ImageFilter
import torch
from torchvision import transforms
from torch import nn
import numpy as np
import cv2
from RealESRGAN import RealESRGAN
import uuid

unique_filename= f"{uuid.uuid4().hex}.png"

# Ensure the generated images directory exists
base_path = os.path.abspath(os.path.join(os.getcwd(), "..", "..", "genx-ai"))
generated_images_dir = os.path.join(base_path, "static", "generated_images")

if not os.path.exists(generated_images_dir):
    os.makedirs(generated_images_dir)

# Function to apply filter (sharpening by default)
def apply_filter1(image, filter_type=ImageFilter.SHARPEN):
    return image.filter(filter_type)

def apply_filter2(image, filter_type=ImageFilter.BLUR):
    return image.filter(filter_type)

def apply_filter3(image, filter_type=ImageFilter.CONTOUR):
    return image.filter(filter_type)

def apply_filter4(image, filter_type=ImageFilter.DETAIL):
    return image.filter(filter_type)

def apply_filter5(image, filter_type=ImageFilter.EDGE_ENHANCE):
    return image.filter(filter_type)

def apply_filter6(image, filter_type=ImageFilter.EMBOSS):
    return image.filter(filter_type)

def apply_filter7(image, filter_type=ImageFilter.SMOOTH):
    return image.filter(filter_type)


# Function to enhance image resolution using FSRCNN

def enhance_resolution(image, model_weights='weights/RealESRGAN_x4.pth', scale=4):
   
    # Select device (GPU if available, else CPU)
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    # Initialize the model
    model = RealESRGAN(device, scale=scale)
    
    # Load the pre-trained weights
    model.load_weights(model_weights, download=True)
    
    # Open and preprocess the input image
  
    
    # Perform super-resolution prediction
    sr_image = model.predict(image)

    return sr_image
    


# Function to adjust the aspect ratio by cropping
def adjust_aspect_ratio(image, target_aspect_ratio=(1, 1)):
    width, height = image.size
    target_width, target_height = target_aspect_ratio

    if width / height > target_width / target_height:
        new_width = int(height * (target_width / target_height))
        offset = (width - new_width) // 2
        image = image.crop((offset, 0, offset + new_width, height))
    else:
        new_height = int(width * (target_height / target_width))
        offset = (height - new_height) // 2
        image = image.crop((0, offset, width, offset + new_height))

    return image

# Function to apply basic color correction (e.g., increasing contrast)
def apply_color_correction(image):
    np_image = np.array(image)
    lab = cv2.cvtColor(np_image, cv2.COLOR_RGB2LAB)
    l, a, b = cv2.split(lab)

    # Apply histogram equalization to the L channel for contrast enhancement
    l = cv2.equalizeHist(l)
    lab = cv2.merge((l, a, b))

    # Convert back to RGB
    result = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)
    return Image.fromarray(result)

# Main function to interact with the user and apply effects
def postprocess_image(image_path):
    image = Image.open(image_path)

    print("Welcome to the Image Post-Processing Tool!")
    print("Select an effect to apply:")
    print("1. Sharpen Image")
    print("2. Enhance Resolution (FSRCNN)")
    print("3. Adjust Aspect Ratio (1:1)")
    print("4. Apply Color Correction")
    print("5. Blur Image")
    print("6. Add Contour")
    print("7. Add Detail to Image")
    print("8. Edge Enhancement")
    print("9. Add Embossing Effect")
    print("10. Smoothen Image")
    print("11. Exit")

    # Get user choice
    choice = input("Enter the number corresponding to your choice: ")

    if choice == "1":
        effect = apply_filter1(image)
        effect.show()
        effect.save(os.path.join(generated_images_dir, f"sharpened_image_{unique_filename}.jpg"))
        print(f"Image sharpened and saved as 'generated_images/sharpened_image_{unique_filename}.jpg'")

    elif choice == "2":
        effect = enhance_resolution(image)
        effect.show()
        effect.save(os.path.join(generated_images_dir, f"enhanced_resolution_image_{unique_filename}.jpg"))
        print(f"Resolution enhanced and saved as 'generated_images/enhanced_resolution_image_{unique_filename}.jpg'")

    elif choice == "3":
        target_aspect_ratio = input("Enter the target aspect ratio (e.g., 1:1): ").split(":")
        target_aspect_ratio = tuple(map(int, target_aspect_ratio))
        effect = adjust_aspect_ratio(image, target_aspect_ratio)
        effect.show()
        effect.save(os.path.join(generated_images_dir, f"aspect_ratio_{target_aspect_ratio[0]}_{target_aspect_ratio[1]}_{unique_filename}.jpg"))
        print(f"Aspect ratio adjusted and saved with ratio {target_aspect_ratio}.")

    elif choice == "4":
        effect = apply_color_correction(image)
        effect.show()
        effect.save(os.path.join(generated_images_dir, f"color_corrected_image_{unique_filename}.jpg"))
        print(f"Color corrected and saved as 'generated_images/color_corrected_image_{unique_filename}.jpg'")

    elif choice == "5":
        effect = apply_filter2(image)
        effect.show()
        effect.save(os.path.join(generated_images_dir, f"blurred_image_{unique_filename}.jpg"))
        print(f"Image sharpened and saved as 'generated_images/blurred_image_{unique_filename}.jpg'")

    elif choice == "6":
        effect = apply_filter3(image)
        effect.show()
        effect.save(os.path.join(generated_images_dir, f"contoured_image_{unique_filename}.jpg"))
        print(f"Image sharpened and saved as 'generated_images/contoured_image_{unique_filename}.jpg'")

    elif choice == "7":
        effect = apply_filter4(image)
        effect.show()
        effect.save(os.path.join(generated_images_dir, f"detailed_image_{unique_filename}.jpg"))
        print(f"Image sharpened and saved as 'generated_images/detailed_image_{unique_filename}.jpg'")

    elif choice == "8":
        effect = apply_filter5(image)
        effect.show()
        effect.save(os.path.join(generated_images_dir, f"edge_enhaced_image_{unique_filename}.jpg"))
        print(f"Image sharpened and saved as 'generated_images/edge_enhanced_image_{unique_filename}.jpg'")

    elif choice == "9":
        effect = apply_filter6(image)
        effect.show()
        effect.save(os.path.join(generated_images_dir, f"embossed_image_{unique_filename}.jpg"))
        print(f"Image sharpened and saved as 'generated_images/embossed_image_{unique_filename}.jpg'")

    elif choice == "10":
        effect = apply_filter7(image)
        effect.show()
        effect.save(os.path.join(generated_images_dir, f"smoothened_image_{unique_filename}.jpg"))
        print(f"Image sharpened and saved as 'generated_images/smoothened_image_{unique_filename}.jpg'")

    elif choice == "11":
        print("Exiting the program.")
        return

    else:
        print("Invalid choice. Please try again.")

base_path = os.path.abspath(os.path.join(os.getcwd(), "..", "..", "genx-ai"))
image_path = os.path.join(base_path, "static", "temp", unique_filename)
    
print("Absolute image path:", image_path)

    # Ensure the image exists
if not os.path.exists(image_path):
    print(f"Error: Image file '{image_path}' not found!")
else:
    print("Image found. Proceeding with postprocessing...")
    # Call your postprocessing function here
    postprocess_image(image_path)
