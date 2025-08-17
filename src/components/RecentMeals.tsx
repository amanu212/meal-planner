
import MealCard from "./MealCard";

type Meal = {
  img: string;
  title: string;
};

type Props = {
  title?: string;
  meals: Meal[]; // ✅ ensure meals is an array of Meal objects
};

export default function RecentMeals({ title = "Recent Meals", meals }: Props) {
  return (
    <section className="block">
      <h3 className="block_title">{title}</h3>
      <div className="grid">
        {meals.map((meal, index) => (
          <MealCard key={index} {...meal} />
        ))}
      </div>
    </section>
  );
}