from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.category import Category
from app.models.expense import Expense
from app.exceptions import NotFoundError, ConflictError, BadRequestError


def get_categories(db: Session, type: str | None = None) -> list[Category]:
    query = db.query(Category)
    if type:
        query = query.filter(Category.type == type)
    return query.order_by(Category.is_default.desc(), Category.name).all()


def get_category_by_id(db: Session, category_id: int) -> Category:
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise NotFoundError(f"Category with id {category_id} not found")
    return category


def create_category(db: Session, name: str, type: str, icon: str | None = None) -> Category:
    existing = db.query(Category).filter(
        and_(Category.name == name, Category.type == type)
    ).first()
    if existing:
        raise ConflictError(f"Category '{name}' of type '{type}' already exists")
    category = Category(name=name, type=type, icon=icon, is_default=False)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def update_category(db: Session, category_id: int, name: str | None = None, icon: str | None = None) -> Category:
    category = get_category_by_id(db, category_id)
    if category.is_default:
        raise BadRequestError("Cannot modify default category")
    if name is not None:
        category.name = name
    if icon is not None:
        category.icon = icon
    db.commit()
    db.refresh(category)
    return category


def delete_category(db: Session, category_id: int) -> None:
    category = get_category_by_id(db, category_id)
    if category.is_default:
        raise BadRequestError("Cannot delete default category")

    # Find "其他支出" or "其他收入" fallback category
    fallback_name = "其他支出" if category.type == "expense" else "其他收入"
    fallback = db.query(Category).filter(
        and_(Category.name == fallback_name, Category.is_default == True)
    ).first()

    if fallback:
        db.query(Expense).filter(Expense.category_id == category_id).update(
            {Expense.category_id: fallback.id}
        )

    db.delete(category)
    db.commit()
