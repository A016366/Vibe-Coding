interface SummaryCardProps {
  title: string;
  amount: number;
  color: string;
  icon: string;
}

export default function SummaryCard({ title, amount, color, icon }: SummaryCardProps) {
  return (
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      flex: 1,
      minWidth: '200px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', color: '#666' }}>{title}</span>
        <span style={{ fontSize: '24px' }}>{icon}</span>
      </div>
      <div style={{ fontSize: '28px', fontWeight: 'bold', color, marginTop: '8px' }}>
        ${amount.toLocaleString()}
      </div>
    </div>
  );
}
