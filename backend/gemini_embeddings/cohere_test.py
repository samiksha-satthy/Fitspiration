import cohere
import requests
import base64
import os
import base64
from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec
import uuid
import sys
from nomic import embed
import numpy as np

load_dotenv()

#initialize cohere client
co = cohere.ClientV2(api_key=os.environ["COHERE_API_KEY"])

#initialize pinecone client
pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])



def convert_base64(image_path):
    try:
        with open(image_path, "rb") as image_file:
            image_data = image_file.read()
            encoded_image_bytes = base64.b64encode(image_data)
            base64_string = encoded_image_bytes.decode('utf-8')
            return base64_string
    except FileNotFoundError:
        print(f"error: image file not found")
        return None
    except Exception as e:
        print(f"an error has occurred {e}")
        return None


def get_image_embedding(base64string: str, image_format: str):
    """
    Takes an image as a base 64 string
    Returns semantic vector embedding using Cohere embed model
    """

    image_url = f"data:image/{image_format};base64,{base64string}" 

    image_inputs = [
        {"content": [{"type": "image_url", "image_url": {"url": image_url}}]}
    ]
    response = co.embed(
        model="embed-v4.0",
        input_type="image",
        embedding_types=["float"],
        inputs=image_inputs, 
    )

    return [response.embeddings.float[0]]

def save_db(embeddings, user_name: str, user_id: str, image_path):
    index_name = "fitspiration"
    dimension = 1536
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
        {"id": f"{user_id}_{uuid.uuid4()}", "values": vec, "metadata": {"image_url": image_path}} for i, vec in enumerate(embeddings)
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
    
def main(image_path: str, image_format: str, user_name: str, user_id: str):
    base64 = convert_base64(image_path)
    embeddings = get_image_embedding(base64, image_format)
    return save_db(embeddings, user_name, user_id, image_path)

if __name__ == "__main__":
    image_path = sys.argv[1]
    image_format = sys.argv[2]
    user_name = sys.argv[3]
    user_id = sys.argv[4]
    main(image_path, image_format, user_name, user_id)
