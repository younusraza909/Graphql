import { GraphQLServer } from "graphql-yoga";

//Scalar Type- String,Boolean,Int,Float,ID

// Demo User Data
const users = [
  {
    id: "1",
    name: "Mike",
    email: "mike@example.com",
    age: 20,
  },
  {
    id: "2",
    name: "sara",
    email: "Sara@example.com",
  },
  {
    id: "3",
    name: "andrew",
    email: "andrew@example.com",
  },
];

const posts = [
  {
    id: "1",
    title: "First Post Title",
    body: "First Post Body",
    published: true,
    author: "1",
  },
  {
    id: "2",
    title: "Second Post Title",
    body: "Second Post Body",
    published: true,
    author: "1",
  },
  {
    id: "3",
    title: "Third Post Title",
    body: "Third Post Body",
    published: false,
    author: "2",
  },
];

//Type Defination
const typeDefs = `
  type Query{
     users(query: String): [User!]!
     posts(query: String):[Post!]!
     me: User!
     post: Post!
 
  }

  type User{
    id: ID!
    name:String
    email:String!
    age:Int
    posts:[Post!]!
  }

  type Post{
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author:User!
  }
`;

//Resolver
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }

      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }

      return posts.filter((post) => {
        return post.title.toLowerCase().includes(args.query.toLowerCase());
      });
    },
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
  Post: {
    author(parent, args, context, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
  },
  User: {
    posts(parent, args, context, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
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
