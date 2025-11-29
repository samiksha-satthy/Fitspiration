import torch
from PIL import Image
import requests
from transformers import AutoProcessor, CLIPModel

# 1. Load a pre-trained CLIP model and processor
model_name = "openai/clip-vit-base-patch32" # or "openai/clip-vit-large-patch14" for better performance
model = CLIPModel.from_pretrained(model_name)
processor = AutoProcessor.from_pretrained(model_name)

# 2. Define the image and the text query
path = "../uploads/2/scarf.jpg" # Example image of two cats
image = Image.open(path)

text_queries = ["a red scarf", "a banana", "a pant"]

# 3. Process inputs and get embeddings
inputs = processor(text=text_queries, images=image, return_tensors="pt", padding=True)
outputs = model(**inputs)

# Extract embeddings (text_embeds and image_embeds)
# Note: outputs.logits_per_image is already a similarity score (dot product weighted by temperature)
image_embeds = outputs.image_embeds # shape: (1, embedding_dim)
text_embeds = outputs.text_embeds   # shape: (num_texts, embedding_dim)

print(outputs.text_embeds)

# 4. Calculate the similarity score
# Hugging Face's CLIP model automatically computes the logit similarity for you in the outputs
logits_per_image = outputs.logits_per_image 

# Convert logits to probabilities if needed
probs = logits_per_image.softmax(dim=1)

print("Logits per image (similarity scores):", logits_per_image)
print("Probabilities:", probs)

# To manually calculate cosine similarity between the normalized embeddings (optional):
# Embeddings are already normalized in the CLIP implementation, so the dot product works as cosine similarity
cosine_sim = torch.matmul(image_embeds, text_embeds.T)
print("Manual Cosine Similarity:", cosine_sim)

