// src/components/QuickAccessSection.tsx
import QuickAccessCard from "./QuickAccessCard";

type Card = {
  img: string;
  title: string;
  onClick?: () => void;   // <-- added
};

type Props = {
  title?: string;
  cards: Card[];
};

export default function QuickAccessSection({ title = "Quick Access Meals", cards }: Props) {
  return (
    <section className="block">
      <h3 className="block_title">{title}</h3>
      <div className="grid">
        {cards.map((c, i) => (
          <QuickAccessCard key={i} img={c.img} title={c.title} onClick={c.onClick} />
        ))}
      </div>
    </section>
  );
}