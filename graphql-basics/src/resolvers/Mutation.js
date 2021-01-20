import uuidv4 from "uuid/v4";

const mutation = {
  createUser(parent, args, { db: { users } }, info) {
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
  deleteUser(parent, args, { db: { users, comments } }, info) {
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
  updateUser(parent, args, { db: { users } }, info) {
    const { id, data } = args;
    const user = users.find((user) => user.id === id);

    if (!user) {
      throw new Error("User Not Found");
    }

    if (typeof data.email === "string") {
      const emailTaken = users.some((user) => user.email === data.email);

      if (emailTaken) {
        throw new Error("Email taken");
      }

      user.email = data.email;
    }

    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }

    return user;
  },
  createPost(parent, args, { db: { users, posts } }, info) {
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
  deletePost(parent, args, { db: { posts, comments } }, info) {
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
  updatePost(parent, args, { db: { posts } }, info) {
    const { id, data } = args;
    const postExists = posts.find((post) => post.id === id);

    if (!postExists) {
      throw new Error("Posts not available");
    }

    if (typeof data.title === "string") {
      postExists.title = data.title;
    }

    if (typeof data.body === "string") {
      postExists.body = data.body;
    }

    if (typeof data.published === "boolean") {
      postExists.published = data.published;
    }

    return postExists;
  },
  createComment(parent, args, { db: { comments, posts, users } }, info) {
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
  deleteComment(parent, args, { db: { comments } }, info) {
    const commentIndex = comments.findIndex(
      (comment) => comment.id === args.id
    );

    if (commentIndex === -1) {
      throw new Error("Comment Not Found");
    }

    const deltedComments = comments.splice(commentIndex, 1);

    return deltedComments[0];
  },
  updateComment(parent, args, { db: { comments } }, info) {
    const comment = comments.find((comment) => comment.id === args.id);

    if (typeof args.textField === "string") {
      comment.textField = args.textField;
    }

    return comment;
  },
};
export { mutation as default };
