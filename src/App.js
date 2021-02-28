import axios from 'axios';
import React, { Component } from 'react';
import { useForm } from 'react-hook-form';

import './App.css';

const HTTP_200_OK = 200


function SearchBar(props) {
  return (
    <div className="search-bar">
      <input className="search-bar--Text" />
      <div className="search-bar--Button">Search</div>
    </div>
  );
}


function BookList(props) {
  if (!props.books.length) {
    return (
        <div className="book-list-none">
            You do not have any books stored. Please add a book below.
        </div>
    );
  }

  return (
    <div className="book-list">
      <span><strong>Your Book List</strong></span>
      {
        props.books.map((book, index) => <Book info={book} key={index}/>)
      }
    </div>
  );
}


function BookForm(props) {
  const { register, handleSubmit, watch, errors } = useForm();

  return (
    <div className='book-form'>
      <span>Add a book to the list</span>
      <form onSubmit={handleSubmit(props.addBook)}>
        <input
          name="isbn"
          placeholder="Enter book ISBN..."
          ref={register({ required: true })}
        />
        <input type="submit" />
      </form>
    </div>
  );
}


function Book(props) {
  return (
    <div className="book">
      <img src={props.info.thumbnail_url} />
      <span><a href={props.info.info_url} target="_blank">Click here for more info</a></span>
    </div>
  );
}


class App extends Component {
  localStorageKey = 'bookIds'

  constructor() {
    super();
    this.state = {
        books: [],
    };
  }

  addBook({isbn}) {
    const cleanISBN = isbn.trim().replaceAll('-', '')

    if (!cleanISBN) {
        return;
    }

    return this.fetchBook(cleanISBN).then(book => {
      if (!book) {
        return;
      }

      const books = this.state.books.slice();
      books.push(book);

      this.setState({books}, this.storeBookId.call(this, cleanISBN));
    });
  }

  fetchBook(isbn) {
    const bookKey = `ISBN:${isbn}`;
    const booksUrl = `https://openlibrary.org/api/books?bibkeys=${bookKey}&format=json`;
    return axios.get(booksUrl).then(response => {
      if (response.status !== HTTP_200_OK) {
        return null;
      }

      return response.data[bookKey];
    });
  }

  getBookIds() {
    const storedBookIds = localStorage.getItem(this.localStorageKey);

    if (storedBookIds && storedBookIds.length) {
        return JSON.parse(storedBookIds);
    }

    return [];
  }

  storeBookId(bookId) {
    const storedBookIds = this.getBookIds();
    storedBookIds.push(bookId);
    localStorage.setItem(this.localStorageKey, JSON.stringify(storedBookIds));
  }

  componentDidMount() {
    const bookIds = this.getBookIds();
    return Promise.all(
        bookIds.map(bookId => this.fetchBook(bookId))
    ).then(books => {
        this.setState({books});
    });
  }

  render() {
    return (
      <div className="App">
        <SearchBar />
        <BookList books={this.state.books}/>
        <BookForm addBook={this.addBook.bind(this)}/>
      </div>
    )
  }
}

export default App;
