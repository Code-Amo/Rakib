from pydantic import BaseModel

class JournalSchema(BaseModel):
    content: str

class JournalResponse(BaseModel):
    content: str