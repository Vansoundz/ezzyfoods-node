import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth.middleware";
import OrderModel from "../models/order.model";

const router = Router();

router.get(`/`, [auth], async (req: Request, res: Response) => {
  try {
    let orders = await OrderModel.find({}).populate("products", [
      "name",
      "category",
      "price",
      "image",
    ]);
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

router.patch(`/:id/delivered`, auth, async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    let order = await OrderModel.findByIdAndUpdate(id, {
      $set: { status: "delivered" },
    });
    if (!order) {
      return res.status(404).json({
        errors: [
          {
            msg: "Order not found",
          },
        ],
      });
    }
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

router.patch(`/:id/failed`, auth, async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    let order = await OrderModel.findByIdAndUpdate(id, {
      $set: { status: "failed" },
    });
    if (!order) {
      return res.status(404).json({
        errors: [
          {
            msg: "Order not found",
          },
        ],
      });
    }
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

router.get(`/delivered`, auth, async (req: Request, res: Response) => {
  try {
    let orders = await OrderModel.find({
      status: "delivered",
    }).populate("products", ["name", "category", "price", "image"]);
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

router.get(`/failed`, auth, async (req: Request, res: Response) => {
  try {
    let orders = await OrderModel.find({
      status: "failed",
    }).populate("products", ["name", "category", "price", "image"]);
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

router.delete(`/failed`, auth, async (req: Request, res: Response) => {
  try {
    let orders = await OrderModel.deleteMany({ status: "failed" });
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

router.delete(`/delivered`, auth, async (req: Request, res: Response) => {
  try {
    let orders = await OrderModel.deleteMany({ status: "delivered" });
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

router.get(`/stats`, auth, async (req: Request, res: Response) => {
  try {
    let pending = (await OrderModel.find({ status: "pending" })).length;
    let delivered = (await OrderModel.find({ status: "delivered" })).length;
    let failed = (await OrderModel.find({ status: "failed" })).length;
    let total = pending + delivered + failed;
    res.json({
      stats: {
        total,
        pending,
        delivered,
        failed,
      },
    });
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
