import { GraphQLServer } from "graphql-yoga";

//Scalar Type- String,Boolean,Int,Float,ID

//Type Defination
const typeDefs = `
  type Query{
     id: ID!
     name: String!
     age: Int!
     employed: Boolean!
     gpa: Float
  }
`;

//Resolver
const resolvers = {
  Query: {
    id() {
      return "abc123";
    },
    name() {
      return "Younus";
    },
    age() {
      return 27;
    },
    employed() {
      return true;
    },
    gpa() {
      return null;
    },
  },
};

const server = new GraphQLServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

server.start(() => {
  console.log("The server is up running");
});
