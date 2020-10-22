import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLInt,
} from "graphql";

const ProductSchema = new GraphQLObjectType({
  name: "ProductSchema",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    price: { type: GraphQLFloat },
    image: { type: GraphQLString },
    images: { type: new GraphQLList(GraphQLString) },
    quantity: { type: GraphQLInt },
    category: { type: GraphQLString },
  }),
});

export default ProductSchema;
