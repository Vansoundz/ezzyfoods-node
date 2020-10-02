import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} from "graphql";
import ProductSchema from "./product.schema";

const UserSchema = new GraphQLObjectType({
  name: "UserSchema",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    products: { type: new GraphQLList(ProductSchema) },
    role: { type: GraphQLString },
  }),
});

export default UserSchema;
