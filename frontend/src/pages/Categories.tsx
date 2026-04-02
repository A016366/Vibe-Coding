import { useState, useEffect } from 'react';
import DeleteConfirm from '../components/DeleteConfirm';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/client';
import type { Category } from '../types';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'income' | 'expense'>('expense');
  const [newIcon, setNewIcon] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch {
      console.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createCategory({ name: newName, type: newType, icon: newIcon || undefined });
      setNewName(''); setNewIcon('');
      fetchCategories();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status: number } };
      if (axiosErr.response?.status === 409) setError('此分類名稱已存在');
      else setError('新增失敗');
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      await updateCategory(id, { name: editName, icon: editIcon || undefined });
      setEditingId(null);
      fetchCategories();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status: number } };
      if (axiosErr.response?.status === 400) setError('預設分類無法修改');
    }
  };

  const handleDelete = async () => {
    if (deletingId === null) return;
    try {
      await deleteCategory(deletingId);
      setDeletingId(null);
      fetchCategories();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status: number } };
      if (axiosErr.response?.status === 400) setError('預設分類無法刪除');
      setDeletingId(null);
    }
  };

  const inputStyle = { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' };

  const expenseCategories = categories.filter(c => c.type === 'expense');
  const incomeCategories = categories.filter(c => c.type === 'income');

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>載入中...</div>;

  const renderCategoryList = (cats: Category[], title: string) => (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ color: '#333', marginBottom: '12px' }}>{title}</h3>
      {cats.map(cat => (
        <div key={cat.id} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px', borderBottom: '1px solid #f0f0f0',
        }}>
          {editingId === cat.id ? (
            <div style={{ display: 'flex', gap: '8px', flex: 1, alignItems: 'center' }}>
              <input value={editIcon} onChange={e => setEditIcon(e.target.value)} placeholder="圖示" style={{ ...inputStyle, width: '60px' }} />
              <input value={editName} onChange={e => setEditName(e.target.value)} style={{ ...inputStyle, flex: 1 }} />
              <button onClick={() => handleUpdate(cat.id)} style={{ padding: '6px 12px', border: 'none', borderRadius: '4px', backgroundColor: '#27ae60', color: '#fff', cursor: 'pointer' }}>儲存</button>
              <button onClick={() => setEditingId(null)} style={{ padding: '6px 12px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fff' }}>取消</button>
            </div>
          ) : (
            <>
              <span>{cat.icon} {cat.name} {cat.is_default && <span style={{ fontSize: '11px', color: '#999', marginLeft: '8px' }}>預設</span>}</span>
              {!cat.is_default && (
                <div>
                  <button onClick={() => { setEditingId(cat.id); setEditName(cat.name); setEditIcon(cat.icon || ''); }}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', marginRight: '8px' }}>✏️</button>
                  <button onClick={() => setDeletingId(cat.id)}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px' }}>🗑️</button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <h1 style={{ marginTop: 0, marginBottom: '24px' }}>🏷️ 分類管理</h1>

      {error && <div style={{ backgroundColor: '#ffe0e0', color: '#c0392b', padding: '10px 16px', borderRadius: '8px', marginBottom: '16px' }}>{error}</div>}

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
        <h3 style={{ marginTop: 0 }}>新增分類</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input value={newIcon} onChange={e => setNewIcon(e.target.value)} placeholder="圖示 (emoji)" style={{ ...inputStyle, width: '100px' }} />
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="分類名稱" required style={{ ...inputStyle, flex: 1, minWidth: '150px' }} />
          <select value={newType} onChange={e => setNewType(e.target.value as 'income' | 'expense')} style={inputStyle}>
            <option value="expense">支出</option>
            <option value="income">收入</option>
          </select>
          <button type="submit" style={{ padding: '8px 20px', border: 'none', borderRadius: '6px', backgroundColor: '#e94560', color: '#fff', cursor: 'pointer' }}>新增</button>
        </form>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        {renderCategoryList(expenseCategories, '💸 支出分類')}
        {renderCategoryList(incomeCategories, '💰 收入分類')}
      </div>

      {deletingId !== null && (
        <DeleteConfirm
          message="確定要刪除此分類嗎？相關記錄將移至「其他」分類。"
          onConfirm={handleDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
}
