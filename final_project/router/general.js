const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');

public_users.get('/booksdata', (req, res) => {
    return res.status(200).json(books);
});

public_users.post("/register", (req,res) => {
  
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required"});
    }

    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: "Username already exists"});
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/booksdata');
        return res.status(200).json(response.data);
      } catch (err) {
        return res.status(500).json({ message: "Error fetching books" });
      }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  
  const isbn = req.params.isbn;
  try {
    const response = await axios.get('http://localhost:5000/booksdata');
    const book = response.data[isbn];
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error fetching book" });
  }

 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  
    const author = req.params.author.toLowerCase();
    try {
      const response = await axios.get('http://localhost:5000/booksdata');
      const booksData = response.data;
      const matchingBooks = [];
  
      for (const isbn in booksData) {
        if (booksData[isbn].author.toLowerCase() === author) {
          matchingBooks.push({ isbn, ...booksData[isbn] });
        }
      }
  
      if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
      } else {
        return res.status(404).json({ message: "No books found for the given author" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Error fetching books by author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  
    const title = req.params.title.toLowerCase();
    try {
      const response = await axios.get('http://localhost:5000/booksdata');
      const booksData = response.data;
      const matchingBooks = [];
  
      for (const isbn in booksData) {
        if (booksData[isbn].title.toLowerCase() === title) {
          matchingBooks.push({ isbn, ...booksData[isbn] });
        }
      }
  
      if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
      } else {
        return res.status(404).json({ message: "No books found with the given title" });
      }
    } catch (err) {
      return res.status(500).json({ message: "Error fetching books by title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        res.status(200).json(books.reviews);
    } else {
        res.status(404).json({ message: "Book not found"});
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
