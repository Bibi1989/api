import { UserI } from "../controllers/user.controller";
import { getWeekStartDate } from "./weeklyDate";

const avgCalories = (foods: any) => {
  const { sevenDays } = getWeekStartDate();
  const filteredFood = foods?.filter(
    (food: any) =>
      new Date(food?.createdAt).getTime() > new Date(sevenDays).getTime()
  );
  const len = filteredFood.length;
  return (
    filteredFood.reduce(
      (acc: number, value: any) => (acc += value?.calories),
      0
    ) / len
  );
};

export const averageCaloriesWithinTheLastSevenDays = (users: UserI[]) => {
  return users?.map((user: UserI) => {
    const foods = user.foods;
    return {
      name: user.name,
      avgCalories: avgCalories(foods),
    };
  });
};
