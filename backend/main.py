from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Welcome to FastAPI!"}

# make a post request to find 
@app.post("/")