const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}


public_users.post("/register", (req,res) => {
  //Write your code here

 const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});


  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get the book list available in the shop using Axios Promise callbacks
public_users.get('/books-promise', function (req, res) {
  axios.get('http://localhost:5000/')
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      console.error('Axios Promise error:', error.message);
      return res.status(500).json({ message: 'Failed to load book list' });
    });
});

// Get the book list available in the shop using Axios async/await
public_users.get('/books-async', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Axios async/await error:', error.message);
    return res.status(500).json({ message: 'Failed to load book list' });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  res.send(books[req.params.isbn])
  // return res.status(300).json({message: "Yet to be implemented"});
 });

// Get book details based on ISBN using Axios Promise callbacks
public_users.get('/isbn-promise/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      console.error('Axios ISBN Promise error:', error.message);
      const status = error.response ? error.response.status : 500;
      const message = error.response ? error.response.data : { message: 'Failed to load book details' };
      return res.status(status).json(message);
    });
});

// Get book details based on ISBN using Axios async/await
public_users.get('/isbn-async/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Axios ISBN async/await error:', error.message);
    const status = error.response ? error.response.status : 500;
    const message = error.response ? error.response.data : { message: 'Failed to load book details' };
    return res.status(status).json(message);
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let book_s = []
  for (const isbn in books) {
    if (books[isbn].author === author) {
      book_s.push(books[isbn])
      
    }
  }
  if (book_s.length > 0){
    return res.status(200).json(book_s);
  }else{
    return res.status(404).json({ message: "No books found for that author" });
  }
  
});

// Get book details based on author using Axios Promise callbacks
public_users.get('/author-promise/:author', function (req, res) {
  const author = req.params.author;
  axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      console.error('Axios author Promise error:', error.message);
      const status = error.response ? error.response.status : 500;
      const message = error.response ? error.response.data : { message: 'Failed to load author book details' };
      return res.status(status).json(message);
    });
});

// Get book details based on author using Axios async/await
public_users.get('/author-async/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Axios author async/await error:', error.message);
    const status = error.response ? error.response.status : 500;
    const message = error.response ? error.response.data : { message: 'Failed to load author book details' };
    return res.status(status).json(message);
  }
});

// Get book details based on title using Axios Promise callbacks
public_users.get('/title-promise/:title', function (req, res) {
  const title = req.params.title;
  axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      console.error('Axios title Promise error:', error.message);
      const status = error.response ? error.response.status : 500;
      const message = error.response ? error.response.data : { message: 'Failed to load title book details' };
      return res.status(status).json(message);
    });
});

// Get book details based on title using Axios async/await
public_users.get('/title-async/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Axios title async/await error:', error.message);
    const status = error.response ? error.response.status : 500;
    const message = error.response ? error.response.data : { message: 'Failed to load title book details' };
    return res.status(status).json(message);
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  for (const isbn in books) {
    if (books[isbn].title === title) {
      return res.status(200).json(books[isbn]);
    }
  }
  return res.status(404).json({ message: "No books found with that title" });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  res.send(books[req.params.isbn].reviews);
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
