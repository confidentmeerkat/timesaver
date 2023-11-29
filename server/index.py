from fastapi import FastAPI, Depends
from .router import index
from .core.config import settings
from .db.database import Base, engine


app = FastAPI(title=settings.PROJECT_NAME)

Base.metadata.create_all(bind=engine)

app.include_router(index.router)
