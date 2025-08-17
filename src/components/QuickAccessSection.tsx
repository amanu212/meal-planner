
import QuickAccessCard from "./QuickAccessCard";

type Card = { img: string; title: string; onClick?: () => void };

type Props = {
  title?: string;
  cards: Card[];
};

export default function QuickAccessSection({
  title = "Quick Access Meals",
  cards,
}: Props) {
  return (
    <section className="block">
      <h3 className="block__title">{title}</h3>
      <div className="grid3">
        {cards.map((c) => (
          <QuickAccessCard key={c.title} {...c} />
        ))}
      </div>
    </section>
  );
}