from datetime import datetime

from pydantic import BaseModel, Field


class CategoryCreate(BaseModel):
    name: str = Field(..., max_length=100)
    type: str = Field(..., pattern="^(income|expense)$")
    icon: str | None = None


class CategoryUpdate(BaseModel):
    name: str | None = Field(None, max_length=100)
    icon: str | None = None


class CategoryResponse(BaseModel):
    id: int
    name: str
    type: str
    icon: str | None
    is_default: bool
    created_at: datetime

    model_config = {"from_attributes": True}
