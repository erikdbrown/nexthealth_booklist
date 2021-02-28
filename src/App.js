import axios from 'axios';
import React, { Component } from 'react';
import { useForm } from 'react-hook-form';

import './App.css';

const HTTP_404_NOT_FOUND = 404

function SearchBar(props) {
  return (
    <div className="search-bar">
      <input className="search-bar--Text" />
      <div className="search-bar--Button">Search</div>
    </div>
  )
}

function BookList(props) {
  return (
    <div className="book-list">
      <span>Your Book List</span>
      {props.books.map((book, index) => (
        <Book info={book} key={index}/>
      ))}
    </div>
  )
}

function BookForm(props) {
  const { register, handleSubmit, watch, errors } = useForm();
  const onSubmit = data => console.log(data);

  return (
    <div className='book-form'>
      <span>Add a book to the list</span>
      <form onSubmit={handleSubmit(props.onSubmit)}>
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
    super()
    this.state = {
        books: [],
        bookIds: [],
    }
  }

  addBook({isbn}) {
    const bookKey = `ISBN:${isbn}`;
    const booksUrl = `https://openlibrary.org/api/books?bibkeys=${bookKey}&format=json`;
    return axios.get(booksUrl).then(response => {
        if (response.status === HTTP_404_NOT_FOUND) {
            console.log('do something');
        }
        const book = response.data[bookKey];
        const books = this.state.books.slice()
        const bookIds = this.state.bookIds.slice()

        books.push(book)
        bookIds.push(isbn)
        this.setState({books, bookIds})
    })
  }

  componentDidMount() {}

  render() {
    return (
      <div className="App">
        <SearchBar />
        <BookList books={this.state.books}/>
        <BookForm onSubmit={this.addBook.bind(this)}/>
      </div>
    )
  }
}

export default App;
