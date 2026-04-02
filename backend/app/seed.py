from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import Category


DEFAULT_CATEGORIES = [
    {"name": "餐飲", "type": "expense", "icon": "🍔", "is_default": True},
    {"name": "交通", "type": "expense", "icon": "🚗", "is_default": True},
    {"name": "購物", "type": "expense", "icon": "🛒", "is_default": True},
    {"name": "娛樂", "type": "expense", "icon": "🎮", "is_default": True},
    {"name": "醫療", "type": "expense", "icon": "🏥", "is_default": True},
    {"name": "教育", "type": "expense", "icon": "📚", "is_default": True},
    {"name": "居住", "type": "expense", "icon": "🏠", "is_default": True},
    {"name": "其他支出", "type": "expense", "icon": "📦", "is_default": True},
    {"name": "薪資", "type": "income", "icon": "💰", "is_default": True},
    {"name": "獎金", "type": "income", "icon": "🎁", "is_default": True},
    {"name": "投資", "type": "income", "icon": "📈", "is_default": True},
    {"name": "其他收入", "type": "income", "icon": "💵", "is_default": True},
]


def seed_categories(db: Session) -> None:
    existing = db.query(Category).filter(Category.is_default == True).count()
    if existing > 0:
        return
    for cat_data in DEFAULT_CATEGORIES:
        db.add(Category(**cat_data))
    db.commit()


def run_seed() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_categories(db)
        print(f"Seeded {len(DEFAULT_CATEGORIES)} default categories")
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
