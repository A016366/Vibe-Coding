import { useState, useEffect } from 'react';
import type { Category, ExpenseFormData, Expense } from '../types';

interface ExpenseFormProps {
  categories: Category[];
  onSubmit: (data: ExpenseFormData) => void;
  onCancel: () => void;
  initialData?: Expense;
}

export default function ExpenseForm({ categories, onSubmit, onCancel, initialData }: ExpenseFormProps) {
  const [form, setForm] = useState<ExpenseFormData>({
    amount: '',
    type: 'expense',
    category_id: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        amount: initialData.amount,
        type: initialData.type,
        category_id: initialData.category_id,
        date: initialData.date,
        note: initialData.note || '',
      });
    }
  }, [initialData]);

  const filteredCategories = categories.filter(c => c.type === form.type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.amount === '' || form.category_id === '') return;
    onSubmit(form);
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#fff', borderRadius: '12px', padding: '24px',
        width: '400px', maxWidth: '90vw',
      }}>
        <h3 style={{ marginTop: 0 }}>{initialData ? '編輯記錄' : '新增記錄'}</h3>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#555' }}>類型</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['expense', 'income'] as const).map(t => (
              <button key={t} type="button" onClick={() => setForm({ ...form, type: t, category_id: '' })}
                style={{
                  flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px',
                  backgroundColor: form.type === t ? (t === 'expense' ? '#ffe0e0' : '#e0ffe0') : '#fff',
                  cursor: 'pointer', fontWeight: form.type === t ? 'bold' : 'normal',
                }}>
                {t === 'expense' ? '💸 支出' : '💰 收入'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#555' }}>金額</label>
          <input type="number" step="0.01" min="0.01" required value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value ? Number(e.target.value) : '' })}
            style={inputStyle} placeholder="輸入金額" />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#555' }}>分類</label>
          <select required value={form.category_id}
            onChange={e => setForm({ ...form, category_id: Number(e.target.value) })}
            style={inputStyle}>
            <option value="">選擇分類</option>
            {filteredCategories.map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#555' }}>日期</label>
          <input type="date" required value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            style={inputStyle} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#555' }}>備註</label>
          <input type="text" value={form.note}
            onChange={e => setForm({ ...form, note: e.target.value })}
            style={inputStyle} placeholder="選填" />
        </div>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCancel}
            style={{ padding: '8px 20px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer' }}>
            取消
          </button>
          <button type="submit"
            style={{ padding: '8px 20px', border: 'none', borderRadius: '6px', backgroundColor: '#e94560', color: '#fff', cursor: 'pointer' }}>
            {initialData ? '更新' : '新增'}
          </button>
        </div>
      </form>
    </div>
  );
}
