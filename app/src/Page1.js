// Page1.js

import React, { useState, useEffect } from 'react';
import './Page1.css';

function Page1() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [sub, setSub] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/books');
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleAddBook = async () => {
    try {
      const response = await fetch('http://localhost:5000/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          author,
          sub,
          publishyear: publishYear, // Ensure consistent property name
        }),
      });
      const data = await response.json();
      console.log('Book added:', data);
      fetchBooks(); // Refresh books list after adding
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await fetch(`http://localhost:5000/books/${id}`, {
        method: 'DELETE',
      });
      fetchBooks(); // Refresh books list after deleting
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  // Pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div>
      <h1>Add Book</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        handleAddBook();
      }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Subject"
          value={sub}
          onChange={(e) => setSub(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Publish Year"
          value={publishYear}
          onChange={(e) => setPublishYear(e.target.value)}
          required
        />
        <button type="submit">Add</button>
      </form>

      <h1>Books</h1>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Subject</th>
            <th>Publish Year</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.sub}</td>
              <td>{book.publishyear}</td>
              <td>
                <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <ul className="pagination">
        {Array.from({ length: Math.ceil(books.length / booksPerPage) }, (_, i) => (
          <li key={i} className={currentPage === i + 1 ? 'active' : ''}>
            <button onClick={() => paginate(i + 1)}>{i + 1}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Page1;
