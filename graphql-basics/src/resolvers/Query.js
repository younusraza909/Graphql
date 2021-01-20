const Query = {
  users(parent, args, { db: { users } }, info) {
    if (!args.query) {
      return users;
    }

    return users.filter((user) => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  posts(parent, args, { db: { posts } }, info) {
    if (!args.query) {
      return posts;
    }

    return posts.filter((post) => {
      return post.title.toLowerCase().includes(args.query.toLowerCase());
    });
  },
  comments(parent, args, { db: { comments } }, info) {
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
};

export { Query as default };
