from fastapi import FastAPI
from contextlib import asynccontextmanager
from admin_api.database import init_db
from admin_api.routers import crud


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(crud.router, prefix="/admin", tags=["admin"])












