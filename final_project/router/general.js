const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

/* =========================
   TASK 7 – Register User
========================= */
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered" });
});

/* =========================
   TASK 2 – Get all books
========================= */
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

/* =========================
   TASK 3 – Get book by ISBN
========================= */
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }
  return res.status(404).json({ message: "Book not found" });
});

/* =========================
   TASK 4 – Get books by author
========================= */
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const result = Object.values(books).filter(
    book => book.author === author
  );

  if (result.length > 0) {
    return res.status(200).json(result);
  }
  return res.status(404).json({ message: "Book not found" });
});

/* =========================
   TASK 5 – Get books by title
========================= */
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const result = Object.values(books).filter(
    book => book.title === title
  );

  if (result.length > 0) {
    return res.status(200).json(result);
  }
  return res.status(404).json({ message: "Book not found" });
});

/* =========================
   TASK 6 – Get book reviews
========================= */
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

/* =================================================
   TASK 11 – ASYNC / PROMISE BASED IMPLEMENTATIONS
================================================= */

/* Async/Await – Get all books */
public_users.get('/async/books', async (req, res) => {
  try {
    const data = await Promise.resolve(books);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

/* Promise – Get book by ISBN */
public_users.get('/promise/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
    books[isbn] ? resolve(books[isbn]) : reject("Book not found");
  })
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json({ message: err }));
});

/* Promise – Get books by author */
public_users.get('/promise/author/:author', (req, res) => {
  const author = req.params.author;

  new Promise((resolve, reject) => {
    const result = Object.values(books).filter(
      book => book.author === author
    );
    result.length ? resolve(result) : reject("Author not found");
  })
    .then(result => res.status(200).json(result))
    .catch(err => res.status(404).json({ message: err }));
});

/* Promise – Get books by title */
public_users.get('/promise/title/:title', (req, res) => {
  const title = req.params.title;

  new Promise((resolve, reject) => {
    const result = Object.values(books).filter(
      book => book.title === title
    );
    result.length ? resolve(result) : reject("Title not found");
  })
    .then(result => res.status(200).json(result))
    .catch(err => res.status(404).json({ message: err }));
});

module.exports.general = public_users;
