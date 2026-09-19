import { useToast } from '../../context/ToastContext';

export default function Toast() {
  const { toast } = useToast();
  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type}`} role="status">
      <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} />
      <span>{toast.message}</span>
    </div>
  );
}
