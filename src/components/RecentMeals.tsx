// src/components/RecentMeals.tsx
import MealCard from "./MealCard";

type Meal = {
  id?: string;        // optional, used for stable keys if present
  img: string;
  title: string;
};

type Props = {
  title?: string;
  meals: Meal[];                       // array of meals to show
  onSelect?: (meal: Meal) => void;     // optional click handler
};

export default function RecentMeals({ title = "Recent Meals", meals, onSelect }: Props) {
  const headingId = "recent-meals-title";

  return (
    <section className="block" aria-labelledby={headingId}>
      <h3 id={headingId} className="block_title">
        {title}
      </h3>

      {meals.length === 0 ? (
        <div
          style={{
            border: "1px dashed #d1d5db",
            borderRadius: 16,
            padding: 16,
            color: "#6b7280",
            background: "#f9fafb",
          }}
        >
          No recent meals yet.
        </div>
      ) : (
        <div className="grid">
          {meals.map((meal, index) => (
            <MealCard
              key={meal.id ?? `${meal.title}-${index}`}
              img={meal.img}
              title={meal.title}
              onClick={onSelect ? () => onSelect(meal) : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}