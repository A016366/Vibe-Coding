import { useState, useEffect, useCallback } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import DeleteConfirm from '../components/DeleteConfirm';
import { getExpenses, getCategories, createExpense, updateExpense, deleteExpense } from '../api/client';
import type { Expense, Category, ExpenseFormData } from '../types';

export default function Transactions() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterCategory, setFilterCategory] = useState<number | ''>('');
  const pageSize = 10;

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, page_size: pageSize };
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      if (filterCategory) params.category_id = filterCategory;
      const res = await getExpenses(params as Parameters<typeof getExpenses>[0]);
      setExpenses(res.data.items);
      setTotal(res.data.total);
    } catch {
      console.error('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  }, [page, startDate, endDate, filterCategory]);

  useEffect(() => {
    getCategories().then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleSubmit = async (data: ExpenseFormData) => {
    if (editingExpense) {
      await updateExpense(editingExpense.id, data);
    } else {
      await createExpense(data);
    }
    setShowForm(false);
    setEditingExpense(undefined);
    fetchExpenses();
  };

  const handleDelete = async () => {
    if (deletingId === null) return;
    await deleteExpense(deletingId);
    setDeletingId(null);
    fetchExpenses();
  };

  const getCategoryName = (id: number) => {
    const cat = categories.find(c => c.id === id);
    return cat ? `${cat.icon || ''} ${cat.name}` : '未知';
  };

  const totalPages = Math.ceil(total / pageSize);

  const inputStyle = {
    padding: '6px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px',
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>📋 交易記錄</h1>
        <button onClick={() => { setEditingExpense(undefined); setShowForm(true); }}
          style={{ padding: '10px 20px', border: 'none', borderRadius: '8px', backgroundColor: '#e94560', color: '#fff', cursor: 'pointer', fontSize: '14px' }}>
          ＋ 新增記錄
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setPage(1); }} style={inputStyle} />
        <span>~</span>
        <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setPage(1); }} style={inputStyle} />
        <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value ? Number(e.target.value) : ''); setPage(1); }} style={inputStyle}>
          <option value="">所有分類</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        {loading ? <p style={{ textAlign: 'center', color: '#999' }}>載入中...</p> : expenses.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>沒有符合條件的記錄</p>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  <th style={{ textAlign: 'left', padding: '10px 8px', color: '#666' }}>日期</th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', color: '#666' }}>分類</th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', color: '#666' }}>備註</th>
                  <th style={{ textAlign: 'right', padding: '10px 8px', color: '#666' }}>金額</th>
                  <th style={{ textAlign: 'center', padding: '10px 8px', color: '#666' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <tr key={exp.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '10px 8px' }}>{exp.date}</td>
                    <td style={{ padding: '10px 8px' }}>{getCategoryName(exp.category_id)}</td>
                    <td style={{ padding: '10px 8px', color: '#666' }}>{exp.note || '-'}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 'bold', color: exp.type === 'income' ? '#27ae60' : '#e94560' }}>
                      {exp.type === 'income' ? '+' : '-'}${exp.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                      <button onClick={() => { setEditingExpense(exp); setShowForm(true); }}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px', marginRight: '8px' }}>✏️</button>
                      <button onClick={() => setDeletingId(exp.id)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' }}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '8px 0' }}>
              <span style={{ color: '#666', fontSize: '14px' }}>共 {total} 筆</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                  style={{ padding: '6px 12px', border: '1px solid #ddd', borderRadius: '4px', cursor: page <= 1 ? 'not-allowed' : 'pointer', backgroundColor: '#fff' }}>
                  上一頁
                </button>
                <span style={{ padding: '6px 12px', color: '#666' }}>{page} / {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}
                  style={{ padding: '6px 12px', border: '1px solid #ddd', borderRadius: '4px', cursor: page >= totalPages ? 'not-allowed' : 'pointer', backgroundColor: '#fff' }}>
                  下一頁
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showForm && (
        <ExpenseForm
          categories={categories}
          initialData={editingExpense}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditingExpense(undefined); }}
        />
      )}

      {deletingId !== null && (
        <DeleteConfirm
          message="確定要刪除這筆記錄嗎？此操作無法復原。"
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
}
