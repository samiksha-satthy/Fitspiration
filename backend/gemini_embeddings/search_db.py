import cohere
from pinecone import Pinecone
import os
from dotenv import load_dotenv

load_dotenv()

def search_db(namespace, query):
    
    # Initialize Cohere client
    co = cohere.ClientV2(api_key=os.environ["COHERE_API_KEY"])

    # Initialize Pinecone client
    pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])

    # Define your Pinecone index name and dimension
    index_name = "fitspiration" 

    index = pc.Index(index_name)


    query_embedding_response = co.embed(
        texts=[query],
        model="embed-english-v3.0",  
        input_type="search_query"
    )
    query_vector = query_embedding_response.embeddings.float[0]
    
    
    # Query Pinecone
    search_results = index.query(
        vector=query_vector,
        namespace=namespace,
        top_k=5,
        include_metadata=True  # Include metadata if you stored it with your vectors
    )

    for match in search_results.matches:
        print(f"ID: {match.id}, Score: {match.score}")
        if match.metadata:
            print(f"Text: {match.metadata.get('text_chunk')}") # Assuming you stored 'text_chunk' in metadata
        print("-" * 20)
        
search_db("samiksha-2", "can you give me a pant?")