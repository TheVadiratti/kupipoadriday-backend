export const getReised = (reised: number, amount: number): number => {
  const result = reised + amount;
  return Number(result.toFixed(2));
};
