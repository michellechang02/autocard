import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock, AsyncMock
from main import app
from models.models import Card, QuestionRequest, QuestionAnswer

client = TestClient(app)


# Test root endpoint
def test_read_root():
    """Test the root endpoint returns welcome message"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to FastAPI!"}


# Test generate-questions endpoint
@patch("main.openai.ChatCompletion.create")
def test_generate_questions_success(mock_openai):
    """Test successful question generation"""
    # Mock OpenAI response
    mock_openai.return_value = MagicMock(
        choices=[
            MagicMock(
                message={
                    "content": '1. {"question": "What is FastAPI?", "answer": "FastAPI is a modern web framework."}\n2. {"question": "What is Python?", "answer": "Python is a programming language."}'
                }
            )
        ]
    )
    
    request_data = {
        "text": "FastAPI is a modern, fast web framework for building APIs with Python.",
        "numQuestions": 2
    }
    
    response = client.post("/generate-questions", json=request_data)
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["question"] == "What is FastAPI?"
    assert data[0]["answer"] == "FastAPI is a modern web framework."


@patch("main.openai.ChatCompletion.create")
def test_generate_questions_openai_error(mock_openai):
    """Test error handling when OpenAI API fails"""
    mock_openai.side_effect = Exception("OpenAI API error")
    
    request_data = {
        "text": "Test text",
        "numQuestions": 1
    }
    
    response = client.post("/generate-questions", json=request_data)
    assert response.status_code == 500
    assert "Error generating questions" in response.json()["detail"]


@patch("main.openai.ChatCompletion.create")
def test_generate_questions_invalid_json(mock_openai):
    """Test error handling when OpenAI returns invalid JSON"""
    mock_openai.return_value = MagicMock(
        choices=[
            MagicMock(
                message={
                    "content": '1. {invalid json}'
                }
            )
        ]
    )
    
    request_data = {
        "text": "Test text",
        "numQuestions": 1
    }
    
    response = client.post("/generate-questions", json=request_data)
    assert response.status_code == 500


# Test card CRUD operations
@patch("main.cards_collection")
@pytest.mark.asyncio
async def test_create_card(mock_collection):
    """Test creating a new card"""
    # Mock the insert and find operations
    mock_inserted_id = "507f1f77bcf86cd799439011"
    mock_collection.insert_one = AsyncMock(
        return_value=MagicMock(inserted_id=mock_inserted_id)
    )
    mock_collection.find_one = AsyncMock(
        return_value={
            "_id": mock_inserted_id,
            "id": "test-id-1",
            "question": "What is FastAPI?",
            "answer": "A web framework"
        }
    )
    
    card_data = {
        "id": None,
        "question": "What is FastAPI?",
        "answer": "A web framework"
    }
    
    response = client.post("/card", json=card_data)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["question"] == "What is FastAPI?"
    assert data["answer"] == "A web framework"


@patch("main.cards_collection")
@pytest.mark.asyncio
async def test_get_cards(mock_collection):
    """Test retrieving all cards"""
    # Mock the find operation
    mock_cursor = MagicMock()
    mock_cursor.limit = MagicMock(return_value=mock_cursor)
    mock_cursor.to_list = AsyncMock(
        return_value=[
            {
                "id": "test-id-1",
                "question": "What is FastAPI?",
                "answer": "A web framework"
            },
            {
                "id": "test-id-2",
                "question": "What is Python?",
                "answer": "A programming language"
            }
        ]
    )
    mock_collection.find = MagicMock(return_value=mock_cursor)
    
    response = client.get("/cards")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["question"] == "What is FastAPI?"


@patch("main.cards_collection")
@pytest.mark.asyncio
async def test_get_card_success(mock_collection):
    """Test retrieving a single card by ID"""
    mock_collection.find_one = AsyncMock(
        return_value={
            "id": "test-id-1",
            "question": "What is FastAPI?",
            "answer": "A web framework"
        }
    )
    
    response = client.get("/cards/test-id-1")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "test-id-1"
    assert data["question"] == "What is FastAPI?"


@patch("main.cards_collection")
@pytest.mark.asyncio
async def test_get_card_not_found(mock_collection):
    """Test retrieving a non-existent card"""
    mock_collection.find_one = AsyncMock(return_value=None)
    
    response = client.get("/cards/non-existent-id")
    assert response.status_code == 404
    assert response.json()["detail"] == "Card not found"


@patch("main.cards_collection")
@pytest.mark.asyncio
async def test_update_card_success(mock_collection):
    """Test updating a card"""
    mock_collection.find_one_and_update = AsyncMock(
        return_value={
            "id": "test-id-1",
            "question": "What is FastAPI updated?",
            "answer": "An updated web framework"
        }
    )
    
    update_data = {
        "id": None,
        "question": "What is FastAPI updated?",
        "answer": "An updated web framework"
    }
    
    response = client.put("/cards/test-id-1", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["question"] == "What is FastAPI updated?"
    assert data["answer"] == "An updated web framework"


@patch("main.cards_collection")
@pytest.mark.asyncio
async def test_update_card_not_found(mock_collection):
    """Test updating a non-existent card"""
    mock_collection.find_one_and_update = AsyncMock(return_value=None)
    
    update_data = {
        "id": None,
        "question": "Updated question",
        "answer": "Updated answer"
    }
    
    response = client.put("/cards/non-existent-id", json=update_data)
    assert response.status_code == 404
    assert response.json()["detail"] == "Card not found"


@patch("main.cards_collection")
@pytest.mark.asyncio
async def test_delete_card_success(mock_collection):
    """Test deleting a card"""
    mock_collection.delete_one = AsyncMock(
        return_value=MagicMock(deleted_count=1)
    )
    
    response = client.delete("/cards/test-id-1")
    assert response.status_code == 204


@patch("main.cards_collection")
@pytest.mark.asyncio
async def test_delete_card_not_found(mock_collection):
    """Test deleting a non-existent card"""
    mock_collection.delete_one = AsyncMock(
        return_value=MagicMock(deleted_count=0)
    )
    
    response = client.delete("/cards/non-existent-id")
    assert response.status_code == 404
    assert response.json()["detail"] == "Card not found"
