export const calculateChangePercentage = (
  current: number,
  previous: number,
): number => {
  if (previous === 0) return 0;
  return Number((((current - previous) / previous) * 100).toFixed(0));
};
