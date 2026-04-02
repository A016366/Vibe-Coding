import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/', label: '📊 儀表板', end: true },
  { path: '/transactions', label: '📋 交易記錄' },
  { path: '/categories', label: '🏷️ 分類管理' },
];

export default function Sidebar() {
  return (
    <nav style={{
      width: '220px',
      backgroundColor: '#1a1a2e',
      color: '#fff',
      padding: '20px 0',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <h2 style={{ padding: '0 20px', marginBottom: '30px', fontSize: '18px' }}>
        💰 記帳工具
      </h2>
      {navItems.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.end}
          style={({ isActive }) => ({
            display: 'block',
            padding: '12px 20px',
            color: isActive ? '#fff' : '#aaa',
            backgroundColor: isActive ? '#16213e' : 'transparent',
            textDecoration: 'none',
            borderLeft: isActive ? '3px solid #e94560' : '3px solid transparent',
            transition: 'all 0.2s',
          })}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
