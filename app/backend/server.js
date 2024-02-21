// server.js

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'MySQL@2003',
  database: 'librarymanagement',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// GET route to fetch books
app.get('/books', (req, res) => {
  connection.query('SELECT id, title, author, sub, publishyear FROM books', (error, results, fields) => {
    if (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

// POST route to add a new book
app.post('/books', (req, res) => {
  const { title, author, sub, publishyear } = req.body;
  // Insert the new book into the database
  connection.query(
    'INSERT INTO books (title, author, sub, publishyear) VALUES (?, ?, ?, ?)',
    [title, author, sub, publishyear],
    (error, results, fields) => {
      if (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        // Retrieve the inserted book from the database
        connection.query('SELECT * FROM books WHERE id = LAST_INSERT_ID()', (error, results, fields) => {
          if (error) {
            console.error('Error fetching book:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          } else {
            res.status(201).json(results[0]);
          }
        });
      }
    }
  );
});

// DELETE route to delete a book
app.delete('/books/:id', (req, res) => {
  const bookId = req.params.id;
  connection.query('DELETE FROM books WHERE id = ?', [bookId], (error, results, fields) => {
    if (error) {
      console.error('Error deleting book:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json({ message: 'Book deleted successfully' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
