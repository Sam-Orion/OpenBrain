import mongoose, { model, Schema } from "mongoose";
import { MONGODB_CONN_STRING } from "./config.js";

mongoose.connect(MONGODB_CONN_STRING);

const UserSchema = new Schema({
  username: { type: String, unique: true },
  password: String,
});

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
  title: String,
  link: String,
  type: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  //   authorId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

export const ContentModel = model("Content", ContentSchema);
