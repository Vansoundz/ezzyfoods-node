import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth.middleware";
import OrderModel from "../models/order.model";

const router = Router();

router.get(`/`, [auth], async (req: Request, res: Response) => {
  try {
    let orders = await OrderModel.find({});
    res.json({ orders });
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
});

router.post(
  `/`,
  [
    check("products")
      .notEmpty()
      .withMessage("You have not selected any products"),
    check("customer")
      .notEmpty()
      .withMessage("You have not entered your details"),
  ],
  async (req: Request, res: Response) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({
        errors: result.array(),
      });
    }
    try {
      let order = new OrderModel({ ...req.body });
      await order.save();
      res.json({ order });
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

router.delete(`/:id`, [auth], async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    let order = await OrderModel.findById(id);

    if (!order) {
      return res.status(404).json({
        errors: [
          {
            msg: "Order not found",
          },
        ],
      });
    }

    await OrderModel.findByIdAndDelete(id);
    res.json({ order });
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
});

export default router;
