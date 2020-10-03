import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import auth from "../middleware/auth.middleware";
import ProductModel from "../models/product.model";
import multer from "multer";
import multerS3 from "multer-s3";
// @ts-ignore
import aws, { S3 } from "aws-sdk";
import { config } from "dotenv";
import CategoryModel from "../models/category.model";

config();

var s3 = new S3({
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey,
});

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "ezzyfoodz",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `${Date.now()}${file.originalname}`);
    },
  }),
});

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./static");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}${file.originalname}`);
//   },
// });

// var upload = multer({ storage: storage });

const router = Router();

router.get(`/`, async (req: Request, res: Response) => {
  try {
    let products = await ProductModel.find({}).populate("category", ["name"]);
    res.send({ products });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      errors: [
        {
          msg: "Server error",
        },
      ],
    });
  }
});

router.get(`/categories`, async (req: Request, res: Response) => {
  try {
    let categories = await CategoryModel.find({}).select("-products -date");
    res.send({ categories });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      errors: [
        {
          msg: "Server error",
        },
      ],
    });
  }
});

router.get(`/category/:category`, async (req: Request, res: Response) => {
  try {
    let category = req.params.category;
    let products = await ProductModel.find({}).where("category", category);
    res.json({ products });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      errors: [
        {
          msg: "Server error",
        },
      ],
    });
  }
});

router.post(
  `/categories`,
  [auth, check("name").notEmpty().withMessage("Category name is required")],
  async (req: Request, res: Response) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).send({ errors: result.array() });
    }
    try {
      let category = new CategoryModel({ ...req.body });
      await category.save();
      res.send({ category });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send({
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
  `/categories/:id`,
  [auth, check("name").notEmpty().withMessage("Category name is required")],
  async (req: Request, res: Response) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).send({ errors: result.array() });
    }
    try {
      const id = req.params.id;
      let category = await CategoryModel.findById(id);

      if (!category) {
        return res
          .status(404)
          .send({ errors: [{ msg: "Category not found" }] });
      }

      // @ts-ignore
      category.name = req.body.name;

      await category.save();
      res.send({ category });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send({
        errors: [
          {
            msg: "Server error",
          },
        ],
      });
    }
  }
);

router.delete(`/categories/:id`, auth, async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    let category = await CategoryModel.findById(id);

    if (!category) {
      return res.status(404).send({ errors: [{ msg: "Category not found" }] });
    }

    await CategoryModel.findByIdAndDelete(id);

    res.send({ category });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
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
      return res.status(404).send({
        errors: [
          {
            msg: "product not found",
          },
        ],
      });
    }
    res.send({ product });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
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
      return res.status(400).send({ errors: result.array() });
    }
    try {
      const product = new ProductModel({ ...req.body });
      if (req.file) {
        // @ts-ignore
        product.image = req.file.location;
      }
      // @ts-ignore
      product.user = req.userId;

      await product.save();

      res.send({ product });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send({
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
        return res.status(404).send({
          errors: [
            {
              msg: "product not found",
            },
          ],
        });
      }

      if (req.file) {
        // @ts-ignore
        product.image = req.file.location;
      }

      Object.keys(req.body).forEach((key) => {
        if (req.body[key]) {
          // @ts-ignore
          product[key] = req.body[key];
        }
      });

      await product.save();

      res.send({ product });
    } catch (error) {
      console.log(error.message);
      return res.status(500).send({
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
      return res.status(404).send({
        errors: [
          {
            msg: "product not found",
          },
        ],
      });
    }

    await ProductModel.findByIdAndDelete(id);
    res.send({ product });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      errors: [
        {
          msg: "Server error",
        },
      ],
    });
  }
});

export default router;
