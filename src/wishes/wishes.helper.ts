export const getReised = (raised: number, amount: number): number => {
  const result = raised + amount;
  return Number(result.toFixed(2));
};
