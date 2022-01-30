export const getWeekStartDate = () => {
  const date = new Date();
  const sevenDays = new Date(date.setDate(date.getDate() - 7)).toISOString();
  const fourteenDays = new Date(
    date.setDate(date.getDate() - 14)
  ).toISOString();
  const oneDay = new Date(date.setDate(date.getDate() - 1)).toISOString();

  return {
    oneDay,
    sevenDays,
    fourteenDays,
  };
};
