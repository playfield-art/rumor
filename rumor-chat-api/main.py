from fastapi import FastAPI
from DataFetcher import downloadSessionData, getAmountOfSessions
from LangChain import prompt
from pydantic import BaseModel

class Prompt(BaseModel):
    question: str

app = FastAPI()

@app.get("/amountOfSessions")
async def amountOfSessiong():
    return {"data": getAmountOfSessions()}

@app.get("/downloadSessionData")
async def downloadSessionData():
    downloadSessionData()
    return {"data": "Downloaded sessions."}

@app.post("/prompt")
def prompt(incoming: Prompt):
    answer = prompt("Wie ben jij?")
    return {"data": answer}

