from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import openai
import os
from dotenv import load_dotenv
from typing import List
from models.models import QuestionRequest, QuestionAnswer
import json
import logging
import re

load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", 
                   "https://michellechang02.github.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai.api_key = os.getenv("OPENAI_API_KEY")

# Set up logging
logging.basicConfig(level=logging.INFO)


@app.get("/")
async def read_root():
    return {"message": "Welcome to FastAPI!"}

@app.post("/generate-questions", response_model=List[QuestionAnswer])
async def generate_questions(request: QuestionRequest):
    try:

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
