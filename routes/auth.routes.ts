import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import UserModel from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import auth from "../middleware/auth.middleware";

config();

const router = Router();

router.get(`/`, [auth], async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    let user = await UserModel.findById(req.userId).select("-password");
    if (!user) {
      return res.status(401).json({ errors: [{ msg: "Unauthorized" }] });
    }
    res.json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      errors: [
        {
          msg: "Server error",
        },
      ],
    });
  }
});

router.post(
  "/login",
  [
    body("email").not().isEmpty().withMessage("Email is required"),
    body("password").not().isEmpty().withMessage("Password is required"),
  ],
  async (req: Request, res: Response) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({
        errors: result.array(),
      });
    }

    try {
      const { email, password } = req.body;
      let user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(404).json({
          errors: [
            {
              msg: "User not found",
            },
          ],
        });
      }

      // @ts-ignore
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          errors: [
            {
              msg: "Invalid password",
            },
          ],
        });
      }

      // @ts-ignore
      const userId = user._id;

      // @ts-ignore
      const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: `48h`,
      });
      console.log(token);

      res.json({ token, user });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        errors: [
          {
            msg: "Server error",
          },
        ],
      });
    }
  }
);

router.post(
  `/register`,
  [
    body("email").notEmpty().withMessage("Email is required"),
    body("email").isEmail().withMessage("Email is invalid"),
    body("password").notEmpty().withMessage("Password is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password should more than 6 characters long"),
  ],
  async (req: Request, res: Response) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({
        errors: result.array(),
      });
    }
    try {
      const { email, password } = req.body;
      let user = await UserModel.findOne({ email });

      if (user) {
        return res.status(404).json({
          errors: [
            {
              msg: "Email already taken",
            },
          ],
        });
      }

      user = new UserModel({ ...req.body });

      const salt = await bcrypt.genSalt(10);

      // @ts-ignore
      user.password = await bcrypt.hash(password, salt);

      // @ts-ignore
      const userId = user._id;

      // @ts-ignore
      const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: `48h`,
      });

      await user.save();

      user = await UserModel.findById(userId).select("-password");

      res.json({ token, user });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        errors: [
          {
            msg: "Server error",
          },
        ],
      });
    }
  }
);

export default router;
