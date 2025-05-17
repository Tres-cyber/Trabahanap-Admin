from fastapi import FastAPI
from contextlib import asynccontextmanager
from admin_api.database import init_db
from admin_api.routers import crud
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(lifespan=lifespan)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],  
    allow_headers=["Authorization", "Content-Type"],  
)


app.include_router(crud.router, prefix="/admin", tags=["admin"])












