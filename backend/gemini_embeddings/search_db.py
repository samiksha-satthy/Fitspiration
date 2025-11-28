from openai import OpenAI
from pinecone import Pinecone
import os
from dotenv import load_dotenv
import sys

load_dotenv()


def search_db(namespace, query):

    # Initialize Cohere client
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

    # Initialize Pinecone client
    pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])

    # Define your Pinecone index name and dimension
    index_name = "fitspiration"

    index = pc.Index(index_name)

    #embed query
    query_embedding_response = client.embeddings.create(
        model="text-embedding-3-small", input=query
    )
    query_vector = query_embedding_response.data[0].embedding

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


if __name__ == "__main__":
    namespace = sys.argv[1]
    query = sys.argv[2]
    search_db(namespace, query)
