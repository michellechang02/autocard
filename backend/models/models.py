from pydantic import BaseModel

# Define the Pydantic model for the request body
class QuestionRequest(BaseModel):
    text: str
    numQuestions: int

# Define the structure for the response
class QuestionAnswer(BaseModel):
    question: str
    answer: str