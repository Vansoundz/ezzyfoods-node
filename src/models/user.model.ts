import { Schema, model, Types } from "mongoose";

const UserSchema = new Schema({
  name: { type: String },
  email: { type: String, unique: true, lowercase: true },
  phone: { type: String },
  password: { type: String },
  products: [
    {
      type: Types.ObjectId,
      ref: "product",
    },
  ],
  role: { type: String },
  date: { type: Date, default: Date.now() },
});

export default model("user", UserSchema);
