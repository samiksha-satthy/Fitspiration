import google.generativeai as genai
import os

# Replace with your actual API key or get it from an environment variable
genai.configure(api_key="AIzaSyAzgfJv5FoXNGFEjQoiXlPqD8A9Q21VaLM")

models = genai.list_models()

for m in models:
    print(m.name, m.supported_generation_methods)