from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.services import category_service

router = APIRouter()


@router.get("/categories", response_model=list[CategoryResponse])
def list_categories(type: str | None = None, db: Session = Depends(get_db)):
    return category_service.get_categories(db, type=type)


@router.post("/categories", response_model=CategoryResponse, status_code=201)
def create_category(data: CategoryCreate, db: Session = Depends(get_db)):
    return category_service.create_category(db, name=data.name, type=data.type, icon=data.icon)


@router.put("/categories/{category_id}", response_model=CategoryResponse)
def update_category(category_id: int, data: CategoryUpdate, db: Session = Depends(get_db)):
    update_data = data.model_dump(exclude_unset=True)
    return category_service.update_category(db, category_id, **update_data)


@router.delete("/categories/{category_id}", status_code=204)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    category_service.delete_category(db, category_id)
    return Response(status_code=204)
