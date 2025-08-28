// src/components/QuickAccessCard.tsx
type Props = {
  img: string;
  title: string;
  onClick?: () => void;
  className?: string;       // optional extra styling
  ariaLabel?: string;       // optional for screen readers
};

export default function QuickAccessCard({ img, title, onClick, className = "", ariaLabel }: Props) {
  return (
    <button
      type="button"
      className={`qcard ${className}`}
      onClick={onClick}
      aria-label={ariaLabel ?? title}
    >
      <img
        className="qcard__img"
        src={img}
        alt={title}
        loading="lazy"
        decoding="async"
      />
      <div className="qcard__label">{title}</div>
    </button>
  );
}