from __future__ import annotations

from datetime import date as Date, datetime as DateTime
from typing import Optional

from pydantic import BaseModel, Field, field_validator


class ExpenseCreate(BaseModel):
    amount: float = Field(..., gt=0, description="金額必須為正數")
    type: str = Field(..., pattern="^(income|expense)$")
    category_id: int
    date: Date
    note: Optional[str] = Field(None, max_length=500)

    @field_validator("amount")
    @classmethod
    def amount_must_be_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("金額必須為正數")
        return round(v, 2)


class ExpenseUpdate(BaseModel):
    amount: Optional[float] = Field(None, gt=0)
    type: Optional[str] = Field(None, pattern="^(income|expense)$")
    category_id: Optional[int] = None
    date: Optional[Date] = None
    note: Optional[str] = Field(None, max_length=500)


class ExpenseResponse(BaseModel):
    id: int
    amount: float
    type: str
    category_id: int
    date: Date
    note: Optional[str]
    created_at: DateTime
    updated_at: DateTime

    model_config = {"from_attributes": True}


class PaginatedResponse(BaseModel):
    items: list[ExpenseResponse]
    total: int
    page: int
    page_size: int


class CategorySummaryItem(BaseModel):
    category_id: int
    category_name: str
    amount: float
    percentage: float


class SummaryResponse(BaseModel):
    total_income: float
    total_expense: float
    balance: float
    by_category: list[CategorySummaryItem]


class TrendItem(BaseModel):
    period: str
    income: float
    expense: float
    balance: float


class TrendResponse(BaseModel):
    items: list[TrendItem]
