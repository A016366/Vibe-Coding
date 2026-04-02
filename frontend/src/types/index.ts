export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  icon: string | null;
  is_default: boolean;
  created_at: string;
}

export interface Expense {
  id: number;
  amount: number;
  type: 'income' | 'expense';
  category_id: number;
  date: string;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface Summary {
  total_income: number;
  total_expense: number;
  balance: number;
  by_category: CategorySummary[];
}

export interface CategorySummary {
  category_id: number;
  category_name: string;
  amount: number;
  percentage: number;
}

export interface ExpenseFormData {
  amount: number | '';
  type: 'income' | 'expense';
  category_id: number | '';
  date: string;
  note: string;
}
