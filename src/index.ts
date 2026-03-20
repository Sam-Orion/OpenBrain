import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { UserModel, ContentModel } from "./db.js";
import { JWT_PASSWORD } from "./config.js";
import { userMiddleware } from "./middleware.js";

const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
  // TODO: zod validation, hash the password
  const username = req.body.username;
  const password = req.body.password;

  try {
    // TODO: {{username should be 3-10 letters}, {Password should be 8 to 20 letters, should have atleast one uppercase, one lowercase, one special character, one number}}
    await UserModel.create({
      username: username,
      password: password,
    });

    // TODO: {{Status 200 - Signed up}, {Status 411 - Error in inputs}, {Status 403 -  User already exists with this username}, {Status 500 - Server error}}
    res.json({
      message: "User signed up",
    });
  } catch (e) {
    res.status(411).json({
      message: "User already exists",
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const existingUser = await UserModel.findOne({
    username,
    password,
  });
  if (existingUser) {
    const token = jwt.sign(
      {
        id: existingUser._id,
      },
      JWT_PASSWORD,
    );

    res.json({
      token,
    });
  } else {
    res.status(403).json({
      message: "Incorrect Credentials",
    });
  }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const title = req.body.title;
  const link = req.body.link;
  const type = req.body.type;
  await ContentModel.create({
    title,
    link,
    type,
    //@ts-ignore
    userId: req.userId,
    tags: [],
  });

  res.json({
    message: "Content Added",
  });
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  const content = await ContentModel.find({
    userId: userId,
  }).populate("userId", "username");

  res.json({
    content,
  });
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  const contentId = req.body.contentId;

  await ContentModel.deleteMany({
    _id: contentId,
    //@ts-ignore
    userId: req.userId,
  });

  res.json({
    message: "deleted",
  });
});

app.post("/api/v1/brain/share", (req, res) => {});

app.post("/api/v1/brain/:shareLink", (req, res) => {});

app.listen(3000);
