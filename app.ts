import Express, { Application, Request, Response } from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
// import { graphqlHTTP } from "express-graphql";
// import schema from "./schema";
// import fileUpload from "./upload";
import products from "./routes/product.routes";
import users from "./routes/auth.routes";
import orders from "./routes/order.routes";
import cors from "cors";

config();

const app: Application = Express();
const PORT = process.env.PORT || 5000;

app.use(Express.json());
app.use(cors());
(async () => {
  const MONGO_URI = process.env.MONGO_URI!;
  try {
    mongoose.connection.once("open", () => console.log("Connected to db"));
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    // app.use(Express.static("static"));

    app.use(`/products`, products);
    app.use(`/users`, users);
    app.use(`/orders`, orders);

    app.get(`/`, (req: Request, res: Response) => {
      res.json(Date.now());
    });

    const server = app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );

    server.on("error", (err) => console.log(err));
    server.on("close", () => server.close());

    process.on("uncaughtException", () => server.close());

    // app.use(
    //   "/gql",
    //   graphqlHTTP({
    //     schema,
    //     graphiql: true,
    //   })
    // );
  } catch (error) {
    console.log(error);
  }
})();

// app.use(`/upload`, fileUpload);
