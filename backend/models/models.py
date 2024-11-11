from pydantic import BaseModel
from typing import Optional

# Define the Pydantic model for the request body
class QuestionRequest(BaseModel):
    text: str
    numQuestions: int

# Define the structure for the response
class QuestionAnswer(BaseModel):
    question: str
    answer: str


class Card(BaseModel):
    id: Optional[str]  # MongoDB generates an `_id` field
    question: str
    answer: str