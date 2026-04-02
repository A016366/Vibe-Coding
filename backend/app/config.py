from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:postgres@localhost:5433/expense_tracker"
    app_name: str = "Expense Tracker API"
    debug: bool = True

    class Config:
        env_file = ".env"


settings = Settings()
