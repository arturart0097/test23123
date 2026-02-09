import ReactDOM from "react-dom";

interface CancelModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export const CancelModal = ({ isOpen, closeModal }: CancelModalProps) => {
  if (typeof document === "undefined" || !isOpen) return null;

  const root = document.getElementById("root") || document.body;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4!">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity"
        onClick={closeModal}
      />
      <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl bg-white/90 p-8! shadow-2xl ring-1 ring-black/5 backdrop-blur-xl transition-all dark:bg-slate-900/90 dark:ring-white/10">
        <div className="text-center mb-6! text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Please email support at: <b>support@rmg.io</b> to cancel your
          subscription
        </div>

        <button
          onClick={closeModal}
          className="w-full rounded-2xl bg-slate-100 px-4! py-2! text-sm font-semibold text-slate-600 hover:bg-slate-500 transition-colors dark:bg-slate-800 dark:text-slate-300 hover:cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>,
    root,
  );
};
