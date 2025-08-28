// src/components/MealCard.tsx
type Props = {
  img: string;
  title: string;
  onClick?: () => void;        // optional click handler
  className?: string;          // optional for custom styling
  ariaLabel?: string;          // optional for screen readers
};

export default function MealCard({ img, title, onClick, className = "", ariaLabel }: Props) {
  return (
    <button
      type="button"
      className={`meal-card ${className}`}
      onClick={onClick}
      aria-label={ariaLabel ?? title}
    >
      <img
        className="meal-card_img"
        src={img}
        alt={title}
        loading="lazy"
        decoding="async"
      />
      <p className="meal-card_title">{title}</p>
    </button>
  );
}