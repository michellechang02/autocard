from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from fastapi import Response
from fastapi.middleware.cors import CORSMiddleware
import openai
import os
from dotenv import load_dotenv
from typing import List
from models.models import QuestionRequest, QuestionAnswer, Card
from motor.motor_asyncio import AsyncIOMotorClient
# from database import cards_collection
from bson import ObjectId
import json
import logging
import re

load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", 
                   "http://localhost:4173",
                   "https://michellechang02.github.io",
                   "https://autocard-frontend.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables
openai_api_key = os.getenv("OPENAI_API_KEY")
mongo_url = os.getenv("MONGODB_URI")
data_api_url = os.getenv("DATA_API_URL")
data_api_key = os.getenv("DATA_API_KEY")


# Check if environment variables are set
if not openai_api_key:
    logging.warning("OPENAI_API_KEY is not set. Ensure it is configured in the environment.")
if not mongo_url:
    logging.warning("MONGODB_URI is not set. Ensure it is configured in the environment.")
if not data_api_url or not data_api_key:
    logging.warning("DATA_API_URL or DATA_API_KEY is not set. Ensure both are configured in the environment.")


client = AsyncIOMotorClient(mongo_url)
database = client["cards_db"]
cards_collection = database["cards"]

# Set up logging
logging.basicConfig(level=logging.INFO)


@app.get("/")
async def read_root():
    return {"message": "Welcome to FastAPI!"}

@app.post("/generate-questions", response_model=List[QuestionAnswer])
async def generate_questions(request: QuestionRequest):
    try:
        logging.info(f"Request text: {request}")
        prompt = (
            f"Provide in string JSON format the user's question as 'question', "
            f"then answer the question as 'answer' by answering the user's question "
            f"using the current text:\n\n{request.text}"
        )
        # Use OpenAI API to generate questions based on the input text
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "user",
                    "content": f"Generate {request.numQuestions} questions and answers "
                               f"based on the following text:\n\n{prompt}"
                }
            ],
            max_tokens=150 * request.numQuestions,  # Adjust max tokens as needed
            temperature=0.7
        )

        # Log the raw response for inspection
        raw_response = response.choices[0].message['content'].strip()
        logging.info(f"Raw response content: {raw_response}")

        # Parse the response into individual JSON objects and create a JSON array
        raw_json_objects = re.split(r'\d+\.\s+', raw_response)  # Split on numbered list pattern
        json_array = []

        for raw_json in raw_json_objects:
            raw_json = raw_json.strip()
            if raw_json.startswith("{") and raw_json.endswith("}"):
                try:
                    parsed_response = json.loads(raw_json)
                    json_array.append(parsed_response)
                except json.JSONDecodeError as json_err:
                    logging.error(f"JSON parsing error: {str(json_err)}")
                    raise HTTPException(status_code=500, detail=f"JSON parsing error: {str(json_err)}")

        return json_array

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating questions: {str(e)}")


## CRUD operations for cards


# Create a card
@app.post("/card", response_model=Card)
async def create_card(card: Card):
    new_card = await cards_collection.insert_one(card.dict())
    created_card = await cards_collection.find_one({"_id": new_card.inserted_id})
    return {**created_card, "id": str(created_card["_id"])}

# Read all cards
@app.get("/cards", response_model=List[Card])
async def get_cards():
    cards = await cards_collection.find().limit(50).to_list(50)
    return [{**card, "id": str(card["id"])} for card in cards]

# Read a single card
@app.get("/cards/{card_id}", response_model=Card)
async def get_card(card_id: str):
    card = await cards_collection.find_one({"id": card_id})
    if card is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
    return {**card, "id": str(card["id"])}

# Update a card
@app.put("/cards/{card_id}", response_model=Card)
async def update_card(card_id: str, card: Card):
    updated_card = await cards_collection.find_one_and_update(
        {"id": card_id},
        {"$set": card.dict(exclude_unset=True)},
        return_document=True
    )
    if updated_card is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
    return {**updated_card, "id": str(updated_card["id"])}

@app.delete("/cards/{card_id}")
async def delete_card(card_id: str):
    print(card_id)
    result = await cards_collection.delete_one({"id": card_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Card not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)