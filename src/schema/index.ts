import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
} from "graphql";
import ProductModel from "../models/product.model";
import ProductMutations from "../mutation/product.motation";
import OrderSchema from "./order.schema";
import ProductSchema from "./product.schema";
import OrderModel from "../models/order.model";

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    products: {
      type: new GraphQLList(ProductSchema),
      resolve() {
        return ProductModel.find({});
      },
    },
    product: {
      type: ProductSchema,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return ProductModel.findById(args.id);
      },
    },
    orders: {
      type: new GraphQLList(OrderSchema),
      resolve() {
        return OrderModel.find({});
      },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: ProductMutations,
});

export default schema;
