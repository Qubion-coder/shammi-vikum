from PIL import Image
import os

input_path = 'public/Magical Wedding Invitation by Candlelight.png'
output_path = 'public/og.png'

def process():
    if not os.path.exists(input_path):
        print(f"File not found: {input_path}")
        return
        
    img = Image.open(input_path)
    if img.mode != 'RGB':
        img = img.convert('RGB')
        
    # Resize to exactly 1200x630 using LANCZOS if it's not already
    if img.size != (1200, 630):
        print(f"Original size is {img.size}, resizing to 1200x630")
        img = img.resize((1200, 630), Image.Resampling.LANCZOS)
    else:
        print("Image is already 1200x630")
        
    # Compress and save
    img.save(output_path, format="JPEG", quality=85)
    
    # Check size
    size = os.path.getsize(output_path)
    print(f"Saved {output_path} with size {size} bytes")
    
    # Rename implies we remove the original file, or at least we move it. Since we already created og.png, we just delete the original.
    os.remove(input_path)
    print(f"Deleted original file: {input_path}")

process()
