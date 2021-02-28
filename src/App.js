import axios from 'axios';
import React, { Component } from 'react';
import { useForm } from 'react-hook-form';

import './App.css';

const HTTP_404_NOT_FOUND = 404

function BookForm(props) {
  const { register, handleSubmit, watch, errors } = useForm();
  const onSubmit = data => console.log(data);

  return (
    <div className='book-form'>
      <span>Add a book to the list</span>
      <form onSubmit={handleSubmit(props.onSubmit)}>
        <input
          name="title"
          placeholder="Enter book title..."
          ref={register({ required: true })}
        />
        <input type="submit" />
      </form>
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

  addBook({title}) {}

  componentDidMount() {}

  render() {
    return (
      <div className="App">
        <div className="search-bar">
          <input className="search-bar--Text" />
          <div className="search-bar--Button">Search</div>
        </div>
        <div className="book-list">
          {this.state.books.map((book, index) => (
            <div>{book.name}</div>
          ))}
        </div>
        <BookForm onSubmit={this.addBook.bind(this)}/>
      </div>
    )
  }
}

export default App;
