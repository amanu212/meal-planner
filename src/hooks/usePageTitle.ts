import { useEffect } from "react";
export function usePageTitle(title: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} · Meal Planner` : "Meal Planner";
    return () => { document.title = prev; };
  }, [title]);
}