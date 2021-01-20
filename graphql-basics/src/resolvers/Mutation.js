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
};
export { mutation as default };
