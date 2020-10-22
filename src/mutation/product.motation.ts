import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import OrderModel from "../models/order.model";
import ProductModel from "../models/product.model";
import OrderSchema from "../schema/order.schema";
import ProductSchema from "../schema/product.schema";

const ProductMutations = new GraphQLObjectType({
  name: "ProductMutation",
  fields: {
    createProduct: {
      type: ProductSchema,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLInt) },
        image: { type: GraphQLString },
        images: { type: new GraphQLList(GraphQLString) },
        category: { type: new GraphQLNonNull(GraphQLString) },
        quantity: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(_, args: any) {
        let product = new ProductModel({ ...args });
        return product.save();
      },
    },
    updateProduct: {
      type: ProductSchema,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLInt) },
        image: { type: GraphQLString },
        images: { type: new GraphQLList(GraphQLString) },
        category: { type: new GraphQLNonNull(GraphQLString) },
        quantity: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (_, args: any) => {
        let product = await ProductModel.findById(args.id);
        if (!product) return null;

        Object.keys(args).forEach((key) => {
          if (args[key] !== `id`) {
            if (args[key]) {
              // @ts-ignore
              product[key] = args[key];
            }
          }
        });

        return product.save();
      },
    },
    placeOrder: {
      type: OrderSchema,
      args: {
        discount: { type: GraphQLString },
        customer: {
          type: new GraphQLInputObjectType({
            name: "customer",
            fields: {
              name: { type: GraphQLString },
              phone: { type: GraphQLString },
            },
          }),
        },
        products: {
          type: new GraphQLList(
            new GraphQLInputObjectType({
              name: "products",
              fields: {
                id: { type: GraphQLID },
                quantity: { type: GraphQLInt },
              },
            })
          ),
        },
      },
      resolve(_, args: any) {
        console.log(args);
        let order = new OrderModel({ ...args });
        return order.save();
      },
    },
  },
});

export default ProductMutations;
