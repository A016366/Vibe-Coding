import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SummaryCard from '../components/SummaryCard';
import { getExpenseSummary, getExpenses } from '../api/client';
import type { Summary, Expense } from '../types';

export default function Dashboard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, expensesRes] = await Promise.all([
          getExpenseSummary(),
          getExpenses({ page: 1, page_size: 5 }),
        ]);
        setSummary(summaryRes.data);
        setRecentExpenses(expensesRes.data.items);
      } catch {
        setError('無法載入資料，請確認後端服務是否正在運行');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>載入中...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: '#e94560' }}>{error}</div>;

  return (
    <div>
      <h1 style={{ marginTop: 0, marginBottom: '24px' }}>📊 儀表板</h1>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
        <SummaryCard title="本月收入" amount={summary?.total_income ?? 0} color="#27ae60" icon="💰" />
        <SummaryCard title="本月支出" amount={summary?.total_expense ?? 0} color="#e94560" icon="💸" />
        <SummaryCard title="結餘" amount={summary?.balance ?? 0} color="#2980b9" icon="📊" />
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '18px' }}>最近交易</h2>
          <Link to="/transactions" style={{ color: '#e94560', textDecoration: 'none' }}>查看全部 →</Link>
        </div>
        {recentExpenses.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>尚無交易記錄</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <th style={{ textAlign: 'left', padding: '8px', color: '#666', fontWeight: 'normal' }}>日期</th>
                <th style={{ textAlign: 'left', padding: '8px', color: '#666', fontWeight: 'normal' }}>備註</th>
                <th style={{ textAlign: 'right', padding: '8px', color: '#666', fontWeight: 'normal' }}>金額</th>
              </tr>
            </thead>
            <tbody>
              {recentExpenses.map(exp => (
                <tr key={exp.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '10px 8px' }}>{exp.date}</td>
                  <td style={{ padding: '10px 8px' }}>{exp.note || '-'}</td>
                  <td style={{ padding: '10px 8px', textAlign: 'right', color: exp.type === 'income' ? '#27ae60' : '#e94560', fontWeight: 'bold' }}>
                    {exp.type === 'income' ? '+' : '-'}${exp.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
