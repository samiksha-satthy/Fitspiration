import os
import google.generativeai as genai
from PIL import Image


def generate_vector_embedding():
    genai.configure(api_key="AIzaSyAzgfJv5FoXNGFEjQoiXlPqD8A9Q21VaLM")
    
        
    content = [
    {"inline_data": Image.open("./test_images/pant.jpg")},  # Image part
    {"text": "Generate an embedding for this image"}  # Text part
]

    result = genai.embed_content(
        model="embedding-001",
        content=content
    )

    vector_embedding = result["embedding"]
    print(f"generated embedding with dimension: {len(vector_embedding)}")
    print(vector_embedding[:10])


generate_vector_embedding()
