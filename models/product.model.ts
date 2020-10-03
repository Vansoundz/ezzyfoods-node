import { Schema, model, Types } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: Types.ObjectId, ref: "category" },
  quantity: { type: String, required: true },
  user: { type: Types.ObjectId, ref: "user" },
  images: [
    {
      type: String,
    },
  ],
  date: { type: Date, default: Date.now() },
});

export default model("product", ProductSchema);
