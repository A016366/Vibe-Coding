from datetime import date

from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.expense import (
    ExpenseCreate, ExpenseUpdate, ExpenseResponse, PaginatedResponse,
    SummaryResponse, TrendResponse,
)
from app.services import expense_service

router = APIRouter()


@router.post("/expenses", response_model=ExpenseResponse, status_code=201)
def create_expense(data: ExpenseCreate, db: Session = Depends(get_db)):
    expense = expense_service.create_expense(
        db, amount=data.amount, type=data.type,
        category_id=data.category_id, exp_date=data.date, note=data.note,
    )
    return expense


@router.get("/expenses", response_model=PaginatedResponse)
def list_expenses(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    start_date: date | None = None,
    end_date: date | None = None,
    category_id: int | None = None,
    db: Session = Depends(get_db),
):
    items, total = expense_service.get_expenses(
        db, page=page, page_size=page_size,
        start_date=start_date, end_date=end_date, category_id=category_id,
    )
    return PaginatedResponse(items=items, total=total, page=page, page_size=page_size)


@router.get("/expenses/summary", response_model=SummaryResponse)
def get_summary(
    start_date: date | None = None,
    end_date: date | None = None,
    db: Session = Depends(get_db),
):
    return expense_service.get_summary(db, start_date=start_date, end_date=end_date)


@router.get("/expenses/trend", response_model=TrendResponse)
def get_trend(
    group_by: str = Query("month", pattern="^(day|week|month)$"),
    start_date: date | None = None,
    end_date: date | None = None,
    db: Session = Depends(get_db),
):
    items = expense_service.get_trend(db, group_by=group_by, start_date=start_date, end_date=end_date)
    return TrendResponse(items=items)


@router.get("/expenses/{expense_id}", response_model=ExpenseResponse)
def get_expense(expense_id: int, db: Session = Depends(get_db)):
    return expense_service.get_expense_by_id(db, expense_id)


@router.put("/expenses/{expense_id}", response_model=ExpenseResponse)
def update_expense(expense_id: int, data: ExpenseUpdate, db: Session = Depends(get_db)):
    update_data = data.model_dump(exclude_unset=True)
    if "date" in update_data:
        update_data["date"] = update_data["date"]
    return expense_service.update_expense(db, expense_id, **update_data)


@router.delete("/expenses/{expense_id}", status_code=204)
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    expense_service.delete_expense(db, expense_id)
    return Response(status_code=204)
