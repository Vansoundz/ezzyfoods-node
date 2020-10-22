import multer from "multer";
import { Request, Response, Router } from "express";

const fileUpload = Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./static");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});

var upload = multer({ storage: storage });

fileUpload.post(
  "/",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ errors: [{ message: "Error uploading image" }] });
      }

      return res.json({ data: { filename: req.file.filename } });
    } catch (error) {
      return res
        .status(500)
        .json({ errors: [{ message: "Error uploading image" }] });
    }
  }
);

export default fileUpload;
