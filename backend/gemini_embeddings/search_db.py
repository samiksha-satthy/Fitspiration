from openai import OpenAI
from pinecone import Pinecone
import os
from dotenv import load_dotenv
import sys
import torch
from PIL import Image
import requests
from transformers import AutoProcessor, CLIPModel
from openai import OpenAI
from langchain_core.prompts import PromptTemplate

load_dotenv()

template="""
give me the most relevant top and bottom from the list of matches below. Only give me one top and one bottom.:


{matches}: answer the above prompt given these matches 

Sample Output:
Top: <image_url metadata>
Bottom: <image_url metadata>

"""

def search_db(namespace, query):

    # Initialize Pinecone client
    pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])

    # Define your Pinecone index name and dimension
    index_name = "fitspiration"

    index = pc.Index(index_name)

    #embed query
    model_name = "openai/clip-vit-base-patch32" # or "openai/clip-vit-large-patch14" for better performance
    model = CLIPModel.from_pretrained(model_name)
    processor = AutoProcessor.from_pretrained(model_name)
    
    inputs = processor(text=query, return_tensors="pt", padding=True)
    with torch.no_grad():
        text_features = model.get_text_features(**inputs)
    query_vector = [text_features[0].cpu().numpy().tolist()]

    # Query Pinecone
    search_results = index.query(
        vector=query_vector,
        namespace=namespace,
        top_k=5,
        include_metadata=True,  # Include metadata if you stored it with your vectors
    )
    
    for match in search_results.matches:
        print(f"ID: {match.id}, Score: {match.score}")
        if match.metadata:
            print(
                f"Text: {match.metadata}"
            )  # Assuming you stored 'text_chunk' in metadata
        print("-" * 20)
    
    return search_results




def call_llm(search_results):
    client = OpenAI()
    prompt = PromptTemplate.from_template(template)
    
    response = client.responses.create(
        model="gpt-4o-mini-2024-07-18",
        input=prompt.format(matches=search_results)
    )
    print(response.output_text)
    

if __name__ == "__main__":
    namespace = sys.argv[1]
    query = sys.argv[2]
    search_results = search_db(namespace, query)
    call_llm(search_results)
