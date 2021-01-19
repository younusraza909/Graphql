import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";

//Scalar Type- String,Boolean,Int,Float,ID

// Demo User Data
let users = [
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

let comments = [
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

let posts = [
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
    createUser(data: CreateUserInput): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput): Post!
    deletePost(id: ID!): Post!
    createComment(data: CreateCommentInput): Comment!
  }

  input CreateUserInput{
    name: String!
    email: String!
    age: Int
  }


  input CreatePostInput{
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput{
    textField: String!
    author: ID!
    post: ID!
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
        return user.email === args.data.email;
      });

      if (emailTaken) {
        throw new Error("Email already taken");
      }

      const user = {
        id: uuidv4(),
        ...args.data,
      };

      users.push(user);

      return user;
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex((user) => {
        return user.id === args.id;
      });

      if (userIndex === -1) {
        throw new Error("No user found!");
      }

      // Will return spliced values
      const deltedUsers = users.splice(userIndex, 1);

      posts = posts.filter((post) => {
        const match = post.author === args.id;

        if (match) {
          comments = comments.filter((comment) => {
            return comment.post !== post.id;
          });
        }
        return !match;
      });

      //to delte comments user have made on others post
      comments = comments.filter((comment) => {
        return comment.author !== args.id;
      });
      return deltedUsers[0];
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => {
        return user.id === args.data.author;
      });

      if (!userExists) {
        throw new Error("User not found");
      }

      const post = {
        id: uuidv4(),
        ...args.data,
      };

      posts.push(post);

      return post;
    },
    deletePost(parent, args, ctx, info) {
      const indexPost = posts.findIndex((post) => {
        return post.id === args.id;
      });

      if (indexPost === -1) {
        throw new Error("Post not found");
      }

      const deletedPost = posts.splice(indexPost, 1);

      comments = comments.filter((comment) => {
        return comment.post !== args.id;
      });
      return deletedPost[0];
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => {
        return user.id === args.data.author;
      });

      if (!userExists) {
        throw new Error("User not found");
      }

      const postPublished = posts.some((post) => {
        return post.id === args.data.post && post.published === true;
      });

      if (!postPublished) {
        throw new Error("Post not found or published");
      }

      const comment = {
        id: uuidv4(),
        ...args.data,
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
