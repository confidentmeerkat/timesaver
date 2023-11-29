from typing import List, Union
import os
from pydantic import validator
from decouple import config
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Timesave"
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    LOG_LEVEL: str = config("LOG_LEVEL", "INFO")
    LOG_FORMAT: str = config("LOG_FORMAT", "%(asctime)s - %(levelname)s - %(message)s")

    DB_CONN_STRING: str = config("DB_CONN_STRING")


settings = Settings()
