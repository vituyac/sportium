from PIL import Image, ImageDraw, ImageFont
from .jwt_auth import generate_code
import os, re

def generate_avatar(initials: str):
    
    font_path = "utils/fonts/Boldonse-Regular.ttf"

    img_size=(200, 200)
    bg_color=(255, 255, 255)
    text_color=(139, 217, 77)
    font_size=100
   
    img = Image.new("RGB", img_size, bg_color)
    draw = ImageDraw.Draw(img)

    font = ImageFont.truetype(font_path, font_size)

    text_bbox = draw.textbbox((0, 0), initials.upper(), font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]

    text_x = (img_size[0] - text_width) // 2
    text_y = (img_size[1] - text_height) // 2 - text_bbox[1]

    draw.text((text_x, text_y), initials.upper(), fill=text_color, font=font)

    path = f"media/{generate_code(16)}.png"

    img.save(path)

    return f"/api/users/{path}"
