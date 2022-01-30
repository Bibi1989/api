import mongoose from "mongoose";

const FoodSchema: any = new mongoose.Schema(
  {
    food: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    calories: {
      type: Number,
      required: true,
    },
    dateTime: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("food", FoodSchema);
