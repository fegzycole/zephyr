import { useStore } from '../../store';

const toastTypeClasses: Record<string, string> = {
  error: 'bg-red-300',
  warn: 'bg-yellow-400',
  info: 'bg-primary',
};

export default function ToastContainer() {
  const toasts = useStore((s) => s.toasts);

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((t) => {
        const bgClass =
          toastTypeClasses[t.type || 'info'] || toastTypeClasses.default;
        return (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-lg shadow-md text-white ${bgClass}`}
          >
            <p className="text-sm">{t.message}</p>
          </div>
        );
      })}
    </div>
  );
}
