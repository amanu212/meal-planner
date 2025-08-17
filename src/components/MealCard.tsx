// src/components/MealCard.tsx
type Props = {
  img: string;
  title: string;
  onClick?: () => void; // optional
};

export default function MealCard({ img, title, onClick }: Props) {
  return (
    <button className="meal-card" onClick={onClick}>
      <img className="meal-card_img" src={img} alt={title} />
      <p className="meal-card_title">{title}</p>
    </button>
  );
}