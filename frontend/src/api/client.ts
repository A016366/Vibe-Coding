import axios from 'axios';
import type { Category, Expense, PaginatedResponse, Summary, ExpenseFormData } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

// Expenses
export const getExpenses = (params?: {
  page?: number;
  page_size?: number;
  start_date?: string;
  end_date?: string;
  category_id?: number;
}) => api.get<PaginatedResponse<Expense>>('/api/expenses', { params });

export const getExpense = (id: number) =>
  api.get<Expense>(`/api/expenses/${id}`);

export const createExpense = (data: ExpenseFormData) =>
  api.post<Expense>('/api/expenses', data);

export const updateExpense = (id: number, data: Partial<ExpenseFormData>) =>
  api.put<Expense>(`/api/expenses/${id}`, data);

export const deleteExpense = (id: number) =>
  api.delete(`/api/expenses/${id}`);

export const getExpenseSummary = (params?: {
  start_date?: string;
  end_date?: string;
}) => api.get<Summary>('/api/expenses/summary', { params });

// Categories
export const getCategories = (params?: { type?: string }) =>
  api.get<Category[]>('/api/categories', { params });

export const createCategory = (data: { name: string; type: string; icon?: string }) =>
  api.post<Category>('/api/categories', data);

export const updateCategory = (id: number, data: { name?: string; icon?: string }) =>
  api.put<Category>(`/api/categories/${id}`, data);

export const deleteCategory = (id: number) =>
  api.delete(`/api/categories/${id}`);
