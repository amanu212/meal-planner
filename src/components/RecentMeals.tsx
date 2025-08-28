import MealCard from "./MealCard";

type Meal = {
  id: string;
  img: string;
  title: string;
};

type Props = {
  title?: string;
  meals: Meal[];
  onSelect?: (meal: Meal) => void; // <-- will receive the meal clicked
};

export default function RecentMeals({ title = "Recent Meals", meals, onSelect }: Props) {
  return (
    <section className="block">
      <h3 className="block_title">{title}</h3>
      <div className="grid">
        {meals.map((meal) => (
          <MealCard
            key={meal.id}
            img={meal.img}
            title={meal.title}
            onClick={() => onSelect?.(meal)}
          />
        ))}
      </div>
    </section>
  );
}