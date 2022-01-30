import mongoose from "mongoose";

const FoodSchema: any = new mongoose.Schema(
  {
    food: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    totalCalories: {
      type: Number,
    },
    dateTime: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("food", FoodSchema);
