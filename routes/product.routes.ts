import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth.middleware";
import ProductModel from "../models/product.model";
import multer from "multer";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./static");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});

var upload = multer({ storage: storage });

const router = Router();

router.get(`/`, async (req: Request, res: Response) => {
  try {
    let products = await ProductModel.find({});
    res.json({ products });
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

router.get(`/:id`, async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    let product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({
        errors: [
          {
            msg: "product not found",
          },
        ],
      });
    }
    res.json({ product });
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
    auth,
    upload.single("image"),
    check("name").notEmpty().withMessage("product name is required"),
    check("price").notEmpty().withMessage("product price is required"),
    check("category").notEmpty().withMessage("product category is required"),
    check("quantity").notEmpty().withMessage("product quantity is required"),
  ],
  async (req: Request, res: Response) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    try {
      const product = new ProductModel({ ...req.body });
      if (req.file) {
        // @ts-ignore
        product.image = req.file.filename;
      }
      // @ts-ignore
      product.user = req.userId;

      await product.save();

      res.json({ product });
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

router.patch(
  `/:id`,
  [auth, upload.single("image")],
  async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
      let product = await ProductModel.findById(id);

      if (!product) {
        return res.status(404).json({
          errors: [
            {
              msg: "product not found",
            },
          ],
        });
      }

      if (req.file) {
        // @ts-ignore
        product.image = req.file.filename;
      }

      Object.keys(req.body).forEach((key) => {
        if (req.body[key]) {
          // @ts-ignore
          product[key] = req.body[key];
        }
      });

      await product.save();

      res.json({ product });
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
    let product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({
        errors: [
          {
            msg: "product not found",
          },
        ],
      });
    }

    await ProductModel.findByIdAndDelete(id);
    res.json({ product });
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
