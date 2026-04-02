from datetime import date

from sqlalchemy.orm import Session

from app.models.expense import Expense
from app.exceptions import NotFoundError


def create_expense(db: Session, amount: float, type: str, category_id: int, exp_date: date, note: str | None = None) -> Expense:
    expense = Expense(amount=amount, type=type, category_id=category_id, date=exp_date, note=note)
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


def get_expenses(
    db: Session,
    page: int = 1,
    page_size: int = 20,
    start_date: date | None = None,
    end_date: date | None = None,
    category_id: int | None = None,
) -> tuple[list[Expense], int]:
    query = db.query(Expense)
    if start_date:
        query = query.filter(Expense.date >= start_date)
    if end_date:
        query = query.filter(Expense.date <= end_date)
    if category_id:
        query = query.filter(Expense.category_id == category_id)
    total = query.count()
    items = query.order_by(Expense.date.desc(), Expense.id.desc()).offset((page - 1) * page_size).limit(page_size).all()
    return items, total


def get_expense_by_id(db: Session, expense_id: int) -> Expense:
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise NotFoundError(f"Expense with id {expense_id} not found")
    return expense


def update_expense(db: Session, expense_id: int, **kwargs) -> Expense:
    expense = get_expense_by_id(db, expense_id)
    for key, value in kwargs.items():
        if value is not None:
            setattr(expense, key, value)
    db.commit()
    db.refresh(expense)
    return expense


def delete_expense(db: Session, expense_id: int) -> None:
    expense = get_expense_by_id(db, expense_id)
    db.delete(expense)
    db.commit()


def get_summary(
    db: Session,
    start_date: date | None = None,
    end_date: date | None = None,
) -> dict:
    from app.models.category import Category

    # Default to current month
    if not start_date:
        today = date.today()
        start_date = today.replace(day=1)
    if not end_date:
        import calendar
        today = date.today()
        _, last_day = calendar.monthrange(today.year, today.month)
        end_date = today.replace(day=last_day)

    total_income = sum(
        e.amount for e in db.query(Expense).filter(
            Expense.date >= start_date, Expense.date <= end_date, Expense.type == "income"
        ).all()
    ) or 0

    total_expense_val = sum(
        e.amount for e in db.query(Expense).filter(
            Expense.date >= start_date, Expense.date <= end_date, Expense.type == "expense"
        ).all()
    ) or 0

    # By category breakdown
    all_expenses = db.query(Expense).filter(
        Expense.date >= start_date, Expense.date <= end_date
    ).all()

    category_totals: dict[int, float] = {}
    for e in all_expenses:
        category_totals[e.category_id] = category_totals.get(e.category_id, 0) + float(e.amount)

    total_all = sum(category_totals.values()) or 1  # avoid division by zero

    by_category = []
    for cat_id, amount in sorted(category_totals.items(), key=lambda x: -x[1]):
        cat = db.query(Category).filter(Category.id == cat_id).first()
        by_category.append({
            "category_id": cat_id,
            "category_name": cat.name if cat else "未知",
            "amount": round(amount, 2),
            "percentage": round(amount / total_all * 100, 2),
        })

    return {
        "total_income": round(float(total_income), 2),
        "total_expense": round(float(total_expense_val), 2),
        "balance": round(float(total_income) - float(total_expense_val), 2),
        "by_category": by_category,
    }


def get_trend(
    db: Session,
    group_by: str = "month",
    start_date: date | None = None,
    end_date: date | None = None,
) -> list[dict]:
    from collections import defaultdict

    if not start_date:
        today = date.today()
        start_date = today.replace(month=1, day=1)
    if not end_date:
        end_date = date.today()

    expenses = db.query(Expense).filter(
        Expense.date >= start_date, Expense.date <= end_date
    ).all()

    income_map: dict[str, float] = defaultdict(float)
    expense_map: dict[str, float] = defaultdict(float)

    for e in expenses:
        if group_by == "day":
            key = e.date.isoformat()
        elif group_by == "week":
            key = f"{e.date.isocalendar()[0]}-W{e.date.isocalendar()[1]:02d}"
        else:  # month
            key = f"{e.date.year}-{e.date.month:02d}"

        if e.type == "income":
            income_map[key] += float(e.amount)
        else:
            expense_map[key] += float(e.amount)

    all_keys = sorted(set(list(income_map.keys()) + list(expense_map.keys())))

    return [
        {
            "period": k,
            "income": round(income_map.get(k, 0), 2),
            "expense": round(expense_map.get(k, 0), 2),
            "balance": round(income_map.get(k, 0) - expense_map.get(k, 0), 2),
        }
        for k in all_keys
    ]
