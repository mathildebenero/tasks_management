import os
import requests
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

headers = {
    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
    "Content-Type": "application/json"
}

data = {
    "model": "openai/gpt-3.5-turbo",  # or try another model like "google/gemma-7b-it" or "mistralai/mistral-7b-instruct"
    "messages": [
        {"role": "user", "content": "Give me a category for: 'Buy groceries for dinner'"}
    ]
}

response = requests.post(
    "https://openrouter.ai/api/v1/chat/completions",
    headers=headers,
    json=data
)

print(response.json()["choices"][0]["message"]["content"].strip())
