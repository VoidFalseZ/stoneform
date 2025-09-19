// components/Toast.js
import { useEffect } from 'react';

export default function Toast({ open, message, type = 'success', onClose }) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 32,
      left: '50%',
      transform: 'translateX(-50%)',
      background: type === 'success' ? 'linear-gradient(45deg, #a020f0, #00e5ff)' : 'linear-gradient(45deg, #ff3e6d, #a020f0)',
      color: '#fff',
      padding: '16px 32px',
      borderRadius: 12,
      boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
      fontWeight: 600,
      fontSize: 16,
      zIndex: 99999,
      animation: 'toastIn 0.3s',
      minWidth: 220,
      textAlign: 'center',
    }}>
      {message}
      <style jsx>{`
        @keyframes toastIn { from { opacity: 0; transform: translateY(40px) translateX(-50%); } to { opacity: 1; transform: translateY(0) translateX(-50%); } }
      `}</style>
    </div>
  );
}
