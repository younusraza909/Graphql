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

const db = {
  users,
  posts,
  comments,
};

export { db as default };
