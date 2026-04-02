interface DeleteConfirmProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirm({ message, onConfirm, onCancel }: DeleteConfirmProps) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#fff', borderRadius: '12px', padding: '24px',
        width: '360px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <p style={{ marginBottom: '24px', color: '#333' }}>{message}</p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button onClick={onCancel}
            style={{ padding: '8px 24px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer' }}>
            取消
          </button>
          <button onClick={onConfirm}
            style={{ padding: '8px 24px', border: 'none', borderRadius: '6px', backgroundColor: '#e94560', color: '#fff', cursor: 'pointer' }}>
            確認刪除
          </button>
        </div>
      </div>
    </div>
  );
}
