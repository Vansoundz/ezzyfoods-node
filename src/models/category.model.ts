import { Schema, model, Types } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String },
  products: [
    {
      type: Types.ObjectId,
      ref: "product",
    },
  ],
  date: { type: Date, default: Date.now() },
});

export default model("category", CategorySchema);
