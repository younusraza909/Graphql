import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";

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

const comments = [
  {
    id: "1",
    textField: "HelpFul Article",
    author: "1",
    post: "1",
  },
  {
    id: "2",
    textField: "Irrelevent Information ,author is not up to point",
    author: "3",
    post: "3",
  },
  {
    id: "3",
    textField: "Best Author to read",
    author: "1",
    post: "1",
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
     comments:[Comment!]!
     me: User!
     post: Post!

  }

  type Mutation{
    createUser(name: String!,email: String!,age:Int): User!
    createPost(title: String!,body: String!,published: Boolean!,author: ID!): Post!
    createComment(textField: String!,author: ID!,post: ID!): Comment!
  }

  type User{
    id: ID!
    name:String
    email:String!
    age:Int
    posts:[Post!]!
    comments:[Comment]!
  }

  type Post{
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment]!
  }

  type Comment{
    id: ID!
    textField: String!
    author: User!
    post: Post!
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
    comments(parent, args, ctx, info) {
      return comments;
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
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => {
        return user.email === args.email;
      });

      if (emailTaken) {
        throw new Error("Email already taken");
      }

      const user = {
        id: uuidv4(),
        name: args.name,
        email: args.email,
        age: args.age,
      };

      users.push(user);

      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => {
        return user.id === args.author;
      });

      if (!userExists) {
        throw new Error("User not found");
      }

      const post = {
        id: uuidv4(),
        title: args.title,
        body: args.body,
        published: args.published,
        author: args.author,
      };

      posts.push(post);

      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => {
        return user.id === args.author;
      });

      if (!userExists) {
        throw new Error("User not found");
      }

      const postPublished = posts.some((post) => {
        return post.id === args.post && post.published === true;
      });

      if (!postPublished) {
        throw new Error("Post not found or published");
      }

      const comment = {
        id: uuidv4(),
        textField: args.textField,
        author: args.author,
        post: args.post,
      };

      comments.push(comment);

      return comment;
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id;
      });
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id;
      });
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post;
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
