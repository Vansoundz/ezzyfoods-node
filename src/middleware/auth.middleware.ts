import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export default async (req: Request, res: Response, next: NextFunction) => {
  const token: string = req.headers["ezzy-auth"] as string;
  if (!token)
    return res.status(401).json({
      errors: [
        {
          msg: "Unauthorized",
        },
      ],
    });
  try {
    // @ts-ignore
    let decoded = jwt.verify(token, process.env.JWT_SECRET);

    // @ts-ignore
    if (!decoded.userId) {
      return res.status(401).json({
        errors: [
          {
            msg: "Unauthorized",
          },
        ],
      });
    }

    // @ts-ignore
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      errors: [
        {
          msg: "Unauthorized",
        },
      ],
    });
  }
};
