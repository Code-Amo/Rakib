import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import engine, Base
import modules.identity.models
from modules.identity.router import router as identity_router

Base.metadata.create_all(bind=engine)
app= FastAPI(
    title="Beyond the Rise API",
    version="1.0.0"
)
app.include_router(identity_router, prefix="/auth", tags=["Auth"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials= True,
    allow_methods= ["*"],
    allow_headers= ["*"],
)
@app.get("/")
def root():
    return {"status": "ok", "message": "Good"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)