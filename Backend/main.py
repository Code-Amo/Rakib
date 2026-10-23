import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import engine, Base
import modules.identity.models
from  modules.Panel.router import router as dashboard_router 
import modules.Panel.models
from modules.identity.router import router as identity_router
from modules.Calendar.router import router as calendar_router
from modules.Panel.router import router as panel_router
import modules.Checkins.models 
from modules.Checkins.router import router as checkins_router
Base.metadata.create_all(bind=engine)
app= FastAPI(
    title="Rakib API",
    version="1.0.0"
)

app.include_router(checkins_router, prefix="/api/checkins", tags=["Checkins"])
app.include_router(panel_router)
app.include_router(calendar_router, prefix="/calendar", tags=["Calendar"])
app.include_router(identity_router, prefix="/auth", tags=["Auth"])
app.include_router(dashboard_router, prefix="/panel", tags=["Dashboard"])
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