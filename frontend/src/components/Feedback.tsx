import { useState } from "react";
import ReactDOM from "react-dom";
import Rating from "@mui/material/Rating";
import emailjs from "@emailjs/browser";
import "../sass/base.scss";

const sendEmail = (
  rating: number,
  feedback: string,
  closeModal: () => void
) => {
  const templateParams = {
    email: "luke@rmg.io, devin@rmg.io",
    rating: rating.toString(),
    feedback: feedback,
  };
  closeModal();
  emailjs
    .send(
      import.meta.env.VITE_EMAIL_SERVICE_ID,
      "template_jbol0zw",
      templateParams,
      {
        publicKey: import.meta.env.VITE_EMAIL_PUBLIC_KEY,
      }
    )
    .then(
      () => {
        console.log("SUCCESS!");
      },
      (error) => {
        console.log("FAILED...", error.text);
      }
    );
};

export const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button
        className="btn rainbow-btn !mt-5 text-sm!"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        Feedback
      </button>
      <FeedbackForm isOpen={isOpen} closeModal={() => setIsOpen(false)} />
    </div>
  );
};

interface FeedbackFormProps {
  isOpen: boolean;
  closeModal: () => void;
  onSubmit?: (data: { rating: number; feedback: string }) => void;
}

const FeedbackForm = ({ isOpen, closeModal }: FeedbackFormProps) => {
  const [feedback, setFeedback] = useState<string>("");
  const [rating, setRating] = useState<number>(3);

  let root: HTMLElement | null = null;
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    root = document.getElementById("root");
  }

  if (!isOpen) return null;

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return ReactDOM.createPortal(
    <div
      onClick={closeModal}
      className="fixed inset-0 z-[9998] flex items-center justify-center !p-4"
    >
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
        aria-hidden="true"
      />
      <div
        onClick={handleModalClick}
        className="relative w-full max-w-[40%] z-[9999]"
      >
        <div
          className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-fuchsia-500/40 via-purple-500/40 to-indigo-500/40 blur opacity-70"
          aria-hidden="true"
        />
        <div className="flex flex-col gap-5 relative !p-8 rounded-3xl border border-white/10 bg-gradient-to-b from-black/70 to-black/60 text-white shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full bg-fuchsia-500/30 blur-xl"
                aria-hidden="true"
              />
              <img
                src="/smile2.png"
                alt="Feedback"
                className="relative w-16 h-16 drop-shadow-xl filter brightness-0 invert"
              />
            </div>
          </div>

          <div
            className="text-2xl sm:text-3xl font-semibold text-center tracking-tight"
            style={{
              fontFamily: '"Tachyon W00 Light"',
              color: "var(--text-primary)",
            }}
          >
            Share Your Feedback
          </div>
          <p
            className="text-center text-white/90 text-sm sm:text-base"
            style={{ color: "var(--text-tertiary)" }}
          >
            Help us improve by sharing your thoughts
          </p>

          {/* Rating */}
          <div className="flex flex-col items-center !gap-6 !mt-2">
            <label
              className="text-sm font-medium"
              style={{
                fontFamily: '"Tachyon W00 Light"',
                color: "var(--text-secondary)",
              }}
            >
              How would you rate your experience?
            </label>
            <div
              className="flex !py-3 !px-6 justify-center rounded-full"
              style={{
                backgroundColor: "var(--bg-tertiary)",
                border: "1px solid var(--border-primary)",
              }}
            >
              <Rating
                value={rating}
                onChange={(_, v) => setRating(v || 0)}
                precision={0.5}
                size="large"
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: "var(--accent-red)",
                  },
                  "& .MuiRating-iconHover": {
                    color: "var(--accent-red)",
                  },
                  "& .MuiRating-iconEmpty": {
                    color: "var(--border-tertiary)",
                  },
                }}
              />
            </div>
          </div>

          {/* Textarea */}
          <div className="flex flex-col !gap-4">
            <label
              className="text-sm font-medium"
              style={{
                fontFamily: '"Tachyon W00 Light"',
                color: "var(--text-secondary)",
              }}
            >
              Your feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what you think..."
              className="min-h-32 w-full resize-none rounded-lg !p-4 outline-none transition-all duration-200"
              style={{
                backgroundColor: "var(--input-bg)",
                border: "1px solid var(--form-border)",
                color: "var(--input-text)",
                fontFamily: '"Bicyclette"',
                fontSize: "14px",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--accent-blue)";
                e.target.style.boxShadow = "0 0 0 3px rgba(47, 92, 252, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--form-border)";
                e.target.style.boxShadow = "none";
              }}
            />
            <style>{`
                textarea::placeholder {
                  color: var(--text-tertiary);
                  opacity: 0.6;
                }
              `}</style>
          </div>

          {/* Buttons */}
          <div className="flex w-full justify-center !gap-3 !mt-2">
            <button
              type="button"
              onClick={closeModal}
              className="btn black-btn flex-1"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => {
                if (feedback.trim()) {
                  sendEmail(rating, feedback, closeModal);
                }
              }}
              className={`btn rainbow-btn flex-1 ${
                !feedback.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:opacity-90"
              }`}
              disabled={!feedback.trim()}
            >
              Send Feedback
            </button>
          </div>
        </div>
      </div>
    </div>,
    root
  );
};

export default FeedbackForm;
