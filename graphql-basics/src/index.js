import { GraphQLServer } from "graphql-yoga";

//Type Defination
const typeDefs = `
  type Query{
      hello: String
      location: String
      bio: String
  }
`;

//Resolver
const resolvers = {
  Query: {
    hello() {
      return "This is my first query for graphql";
    },
    location() {
      return "Karachi ,Pakistan";
    },
    bio() {
      return "Keen to learn programming. Age 20";
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
