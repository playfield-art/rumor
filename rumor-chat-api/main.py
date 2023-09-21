from fastapi import FastAPI
from pydantic_settings import BaseSettings
from config import settings
from DataFetcher import downloadSessionData, getAmountOfSessions

app = FastAPI()

@app.get("/amountOfSessions")
async def root():
    return {"data": getAmountOfSessions()}


@app.get("/downloadSessionData")
async def root():
    sessionData = downloadSessionData()
    return {"data": sessionData}
