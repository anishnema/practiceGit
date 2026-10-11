from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Calculator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AddRequest(BaseModel):
    a: float
    b: float


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/add")
def add(payload: AddRequest):
    try:
        return {"result": payload.a + payload.b}
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
