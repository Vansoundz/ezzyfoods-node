import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} from "graphql";
import ProductSchema from "./product.schema";
import UserSchema from "./user.schema";

const OrderSchema = new GraphQLObjectType({
  name: "OrderSchema",
  fields: () => ({
    _id: { type: GraphQLID },
    discount: { type: GraphQLString },
    customer: { type: UserSchema },
    products: { type: new GraphQLList(ProductSchema) },
  }),
});

export default OrderSchema;
