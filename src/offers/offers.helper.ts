export const getReised = (reised: number, amount: number): number => {
  reised = Number(reised);
  amount = Number(amount);
  const result = reised + amount;
  return Number(result.toFixed(2));
};
