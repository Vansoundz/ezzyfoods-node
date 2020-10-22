import { Schema, model, Types } from "mongoose";

const OrderSchema = new Schema({
  products: [
    {
      type: Types.ObjectId,
      ref: "product",
    },
  ],
  quantities: {},
  customer: {
    name: { type: String },
    phone: { type: String },
  },
  discount: {
    type: String,
  },
  date: { type: Date, default: Date.now() },
  status: {
    type: String,
    enum: ["pending", "delivered", "failed"],
    default: "pending",
  },
});

export default model("order", OrderSchema);
