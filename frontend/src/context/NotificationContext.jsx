import { createContext, useContext } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};

export const NotificationProvider = ({ children }) => {
  const notify = {
    success: (message) => toast.success(message, {
      style: {
        background: 'var(--toast-bg, #1e1e2e)',
        color: 'var(--toast-color, #f4f4f5)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '12px',
        backdropFilter: 'blur(20px)',
      },
      iconTheme: { primary: '#10b981', secondary: '#fff' },
      duration: 3000
    }),
    error: (message) => toast.error(message, {
      style: {
        background: 'var(--toast-bg, #1e1e2e)',
        color: 'var(--toast-color, #f4f4f5)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '12px',
        backdropFilter: 'blur(20px)',
      },
      iconTheme: { primary: '#ef4444', secondary: '#fff' },
      duration: 4000
    }),
    info: (message) => toast(message, {
      icon: 'ℹ️',
      style: {
        background: 'var(--toast-bg, #1e1e2e)',
        color: 'var(--toast-color, #f4f4f5)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '12px',
        backdropFilter: 'blur(20px)',
      },
      duration: 3000
    }),
    loading: (message) => toast.loading(message, {
      style: {
        background: 'var(--toast-bg, #1e1e2e)',
        color: 'var(--toast-color, #f4f4f5)',
        borderRadius: '12px',
        backdropFilter: 'blur(20px)',
      }
    }),
    dismiss: (id) => toast.dismiss(id)
  };

  return (
    <NotificationContext.Provider value={notify}>
      <Toaster position="top-right" toastOptions={{ className: 'toast-glass' }} />
      {children}
    </NotificationContext.Provider>
  );
};
