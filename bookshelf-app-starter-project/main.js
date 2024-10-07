let books = [];

if (localStorage.getItem('books')) {
  books = JSON.parse(localStorage.getItem('books')).map(book => ({
    ...book,
    year: Number(book.year) 
  }));
  renderBooks();
}

function saveToLocalStorage() {
  localStorage.setItem('books', JSON.stringify(books));
}

function createBookElement(book) {
  const bookElement = document.createElement('div');
  bookElement.setAttribute('data-bookid', book.id);
  bookElement.setAttribute('data-testid', 'bookItem');

  bookElement.innerHTML = `
    <h3 data-testid="bookItemTitle">${book.title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
    <p data-testid="bookItemYear">Tahun: ${book.year}</p>
    <div>
      <button data-testid="bookItemIsCompleteButton">
        ${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}
      </button>
      <button data-testid="bookItemDeleteButton">Hapus buku</button>
      <button data-testid="bookItemEditButton">Edit buku</button>
    </div>
  `;

  const isCompleteButton = bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]');
  isCompleteButton.addEventListener('click', () => toggleBookComplete(book.id));

  const deleteButton = bookElement.querySelector('[data-testid="bookItemDeleteButton"]');
  deleteButton.addEventListener('click', () => deleteBook(book.id));

  const editButton = bookElement.querySelector('[data-testid="bookItemEditButton"]');
  editButton.addEventListener('click', () => editBook(book));

  return bookElement;
}

function renderBooks() {
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  books.forEach(book => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

function addBook(event) {
  event.preventDefault();
  const title = document.getElementById('bookFormTitle').value;
  const author = document.getElementById('bookFormAuthor').value;
  const yearInput = document.getElementById('bookFormYear').value;
  const year = isNaN(Number(yearInput)) ? 0 : Number(yearInput); 
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  const book = {
    id: new Date().getTime(),
    title,
    author,
    year,
    isComplete,
  };

  books.push(book);
  saveToLocalStorage();
  renderBooks();

  event.target.reset();
}


function scrollToBottom() {
  const completeBookList = document.getElementById('completeBookList');
  completeBookList.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

document.getElementById('bookForm').addEventListener('submit', function(event) {
  addBook(event);
  scrollToBottom(); 
});

function toggleBookComplete(bookId) {
  const book = books.find(b => b.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveToLocalStorage();
    renderBooks();
  }
}

function deleteBook(bookId) {
  if (confirm("Apakah Anda yakin ingin menghapus buku ini?")) {
    books = books.filter(b => b.id !== bookId);
    saveToLocalStorage();
    renderBooks();
  }
}

function editBook(book) {
  document.getElementById('bookFormTitle').value = book.title;
  document.getElementById('bookFormAuthor').value = book.author;
  document.getElementById('bookFormYear').value = book.year;
  document.getElementById('bookFormIsComplete').checked = book.isComplete;

  books = books.filter(b => b.id !== book.id);
  saveToLocalStorage();
  renderBooks();

  const formElement = document.getElementById('bookForm');
  formElement.scrollIntoView({ behavior: 'smooth' }); 
}

document.getElementById('searchBook').addEventListener('submit', function(event) {
  event.preventDefault();
  const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTitle));
  const incompleteBookList = document.getElementById('incompleteBookList');
  const completeBookList = document.getElementById('completeBookList');

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  filteredBooks.forEach(book => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
});

document.getElementById('bookFormIsComplete').addEventListener('change', function() {
  const submitButton = document.getElementById('bookFormSubmit').querySelector('span');
  submitButton.textContent = this.checked ? 'Selesai dibaca' : 'Belum selesai dibaca';
});
