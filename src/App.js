import axios from 'axios';
import React, { Component } from 'react';
import { useForm } from 'react-hook-form';

import './App.css';

const HTTP_200_OK = 200


function SearchBar(props) {
  const { register, handleSubmit, watch, errors } = useForm();

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit(props.filterBookList)}>
        <input
          name="filterTerm"
          placeholder="Filter by..."
          ref={register({ required: true })}
        />
        <input type="submit" />
      </form>
      <a href="#" onClick={props.clearFilter}>Clear filter</a>
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
  let img_src = 'https://catalog.loc.gov/vwebv/ui/en_US/images/icons/Book.png';

  if (props.info.cover) {
    img_src = props.info.cover.medium
  }

  return (
    <div className="book">
      <div><img src={img_src} /></div>
      <div className="book-info">
        <div><strong>Title:</strong> {props.info.title}</div>
        <div><strong>Authors(s): </strong>
        {props.info.authors.map((author, index) => <span key={index}>{author.name}</span>)}
        </div>
        <div><strong>Year:</strong> {props.info.publish_date}</div>
        <div><strong>Pages:</strong> {props.info.number_of_pages}</div>
        <div className="book-moreInfo"><a href={props.info.url} target="_blank">Click here for more info</a></div>
      </div>
    </div>
  );
}


class App extends Component {
  localStorageKey = 'bookIds'

  constructor() {
    super();
    this.state = {
        allBooks: [],
        listedBooks: [],
        filterKey: '',
    };
  }

  cleanISBN(isbn) {
    return isbn.trim().replaceAll('-', '')
  }

  getBookKey(isbn) {
    return `ISBN:${isbn}`;
  }

  addBook({isbn}) {
    const cleanISBN = this.cleanISBN(isbn);

    if (!cleanISBN) {
        return;
    }

    return this.fetchBook(cleanISBN).then(book => {
      if (!book) {
        return;
      }

      const allBooks = this.state.allBooks.slice();
      allBooks.push(book);

      this.setState({
        allBooks: allBooks,
        listedBooks: this.getFilteredBooks(allBooks),
      }, this.storeLocalBook.call(this, cleanISBN));
    });
  }

  fetchBook(isbn) {
    const bookKey = this.getBookKey(isbn);

    const booksUrl = `https://openlibrary.org/api/books`;
    const queryParams = {
      format: 'json',
      jscmd: 'data',
      bibkeys: bookKey,
    }

    return axios.get(booksUrl, {params: queryParams}).then(response => {
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

  storeLocalBook(bookId) {
    const storedBookIds = this.getBookIds();
    storedBookIds.push(bookId);
    localStorage.setItem(this.localStorageKey, JSON.stringify(storedBookIds));
  }

  componentDidMount() {
    const bookIds = this.getBookIds();
    return Promise.all(
        bookIds.map(bookId => this.fetchBook(bookId))
    ).then(allBooks => {
        this.setState({
            allBooks: allBooks,
            listedBooks: allBooks,
        });
    });
  }

  getFilteredBooks(allBooks) {
    if (!this.state.filterKey) {
        return allBooks;
    }

    return allBooks.map(book => book.bib_key === this.state.filterKey);
  }

  clearFilter() {
    this.setState({
      filterKey: '',
      listedBooks: this.state.allBooks.slice()
    })
  }

  filterBookList({filterTerm}) {
    this.setState({
        filterKey: filterTerm,
        listedBooks: this.state.allBooks.filter(book => {
          return JSON.stringify(book).indexOf(filterTerm) >= 0
        })
    })
  }

  render() {
    return (
      <div className="App">
        <SearchBar
          filterBookList={this.filterBookList.bind(this)}
          clearFilter={this.clearFilter.bind(this)}
        />
        <BookList books={this.state.listedBooks}/>
        <BookForm addBook={this.addBook.bind(this)}/>
      </div>
    )
  }
}

export default App;
