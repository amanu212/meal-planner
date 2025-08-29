// src/types/meal.ts
export type Meal = {
  id: string;
  title: string;
  image: string;
  source: "mealdb" | "edamam" | "local";
  url?: string;              // source link (MealDB or Edamam)
  cuisine?: string;
  tags?: string[];
  ingredients?: string[];
  instructions?: string[];
  calories?: number;
  carbs?: number;
  protein?: number;
  fat?: number;
  fiber?: number;
};