export function calculateSuggestedGoalMl(weightKg: number) {
  const rawGoal = weightKg * 30;

  return Math.round(rawGoal / 50) * 50;
}
