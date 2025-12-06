import cohere
import base64
import os
import base64
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
import uuid
import sys
from nomic import embed
import numpy as np
import torch
from PIL import Image
import requests
from transformers import AutoProcessor, CLIPModel

load_dotenv()

#initialize pinecone client
pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])


def get_image_embedding(image_path):
    model_name = "openai/clip-vit-base-patch32" 
    model = CLIPModel.from_pretrained(model_name)
    processor = AutoProcessor.from_pretrained(model_name)
    
    image = Image.open(".."+image_path)
    
    inputs = processor(images=image, return_tensors="pt", padding=True)
    
    with torch.no_grad():
        image_features = model.get_image_features(**inputs)

    
    
    print(image_features.shape)
    
    return [image_features[0].cpu().numpy().tolist()]
    

def save_db(embeddings, user_name: str, user_id: str, image_path, clothing_type):
    index_name = "fitspiration"
    dimension = 512
    metric = "cosine"
    
    if index_name not in pc.list_indexes().names():
        pc.create_index(
            name=index_name,
            dimension=dimension,
            metric=metric,
            spec=ServerlessSpec(cloud="aws", region="us-east-1")
        )
        
    index = pc.Index(index_name)
    
    vectors_to_upsert = [
        {"id": f"{user_id}_{uuid.uuid4()}", "values": vec, "metadata": {"image_path": image_path, "type": clothing_type}} for i, vec in enumerate(embeddings)
    ]
    namespace = f"{user_name}-{user_id}"
    index.upsert(vectors=vectors_to_upsert, namespace=namespace)
    
    
    stats = index.describe_index_stats()
    print(stats)

    
    result = index.query(
        vector=embeddings[0],  # or any query vector
        top_k=10,
        namespace=namespace,
        include_values=False,
        include_metadata=True
    )
    print(result)

    return "success!"
    
def main(image_path: str, user_name: str, user_id: str, clothing_type: str):
    embeddings = get_image_embedding(image_path)
    return save_db(embeddings, user_name, user_id, image_path, clothing_type)

if __name__ == "__main__":
    image_path = sys.argv[1]
    user_name = sys.argv[2]
    user_id = sys.argv[3]
    clothing_type = sys.argv[4]
    main(image_path, user_name, user_id, clothing_type)
    index = pc.Index("fitspiration")
    stats = index.describe_index_stats()
    print(stats)

