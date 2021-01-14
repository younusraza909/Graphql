import { GraphQLServer } from "graphql-yoga";

//Scalar Type- String,Boolean,Int,Float,ID

//Type Defination
const typeDefs = `
  type Query{
     me: User!
     post: Post!
  }

  type User{
    id: ID!
    name:String
    email:String!
    age:Int
  }

  type Post{
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`;

//Resolver
const resolvers = {
  Query: {
    me() {
      return {
        id: "123098",
        name: "Mike",
        email: "example.com",
      };
    },
    post() {
      return {
        id: "book65748",
        title: "My First Post",
        body: "This is my first post regarding graphql",
        published: true,
      };
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
