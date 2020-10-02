import Express, { Application, Request, Response } from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
// import { graphqlHTTP } from "express-graphql";
// import schema from "./schema";
// import fileUpload from "./upload";
import products from "./routes/product.routes";
import users from "./routes/auth.routes";
import orders from "./routes/order.routes";

config();

const app: Application = Express();
const PORT = process.env.PORT || 5000;

app.use(Express.json());

(async () => {
  const MONGO_URI = process.env.MONGO_URI!;
  try {
    mongoose.connection.once("open", () => console.log("Connected to db"));
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

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
app.use(Express.static("static"));

app.get(`/`, (req: Request, res: Response) => {
  res.send(Date.now());
});
app.use(`/products`, products);
app.use(`/users`, users);
app.use(`/orders`, orders);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
