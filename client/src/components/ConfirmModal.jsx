export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'CONFIRMAR',
  cancelText = 'CANCELAR',
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff',
        border: '3px solid #000',
        boxShadow: '6px 6px 0 #000',
        padding: '20px',
        maxWidth: '400px',
        width: '90%',
        position: 'relative'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          marginBottom: '15px'
        }}>
          {title}
        </h3>
        <p style={{
          marginBottom: '20px',
          color: '#333'
        }}>
          {message}
        </p>
        <div style={{
          display: 'flex',
          gap: '10px'
        }}>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '10px 15px',
              backgroundColor: '#c0392b',
              color: '#fff',
              border: '2px solid #000',
              cursor: 'pointer',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '12px'
            }}
          >
            {confirmText}
          </button>
          {cancelText && (
            <button
              onClick={onCancel}
              style={{
                flex: 1,
                padding: '10px 15px',
                backgroundColor: '#fff',
                color: '#000',
                border: '2px solid #000',
                cursor: 'pointer',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: '12px'
              }}
            >
              {cancelText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}