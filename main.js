document.addEventListener('DOMContentLoaded', function () {
    const bookForm = document.getElementById('bookForm');
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');
    let isEditing = false;
    let editingBookId = null;

    // Load books from local storage
    loadBooksFromLocalStorage();

    bookForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const bookTitle = document.getElementById('bookFormTitle').value;
        const bookAuthor = document.getElementById('bookFormAuthor').value;
        const bookYear = parseInt(document.getElementById('bookFormYear').value, 10); // Menggunakan parseInt untuk mengubah year menjadi number
        const isComplete = document.getElementById('bookFormIsComplete').checked;

        if (isEditing) {
            updateBookInLocalStorage(editingBookId, bookTitle, bookAuthor, bookYear, isComplete);
            loadBooksFromLocalStorage();
            isEditing = false;
            editingBookId = null;
        } else {
            const bookId = new Date().getTime().toString();
            const bookItem = createBookItem(bookId, bookTitle, bookAuthor, bookYear, isComplete);

            if (isComplete) {
                completeBookList.appendChild(bookItem);
            } else {
                incompleteBookList.appendChild(bookItem);
            }

            saveBookToLocalStorage(bookId, bookTitle, bookAuthor, bookYear, isComplete);
        }

        bookForm.reset();
    });

    function createBookItem(id, title, author, year, isComplete) {
        const bookItem = document.createElement('div');
        bookItem.setAttribute('data-bookid', id);
        bookItem.setAttribute('data-testid', 'bookItem');

        const bookTitle = document.createElement('h3');
        bookTitle.setAttribute('data-testid', 'bookItemTitle');
        bookTitle.textContent = title;

        const bookAuthor = document.createElement('p');
        bookAuthor.setAttribute('data-testid', 'bookItemAuthor');
        bookAuthor.textContent = `Penulis: ${author}`;

        const bookYear = document.createElement('p');
        bookYear.setAttribute('data-testid', 'bookItemYear');
        bookYear.textContent = `Tahun: ${year}`;

        const buttonContainer = document.createElement('div');

        const toggleButton = document.createElement('button');
        toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
        toggleButton.textContent = isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
        toggleButton.addEventListener('click', function () {
            if (isComplete) {
                incompleteBookList.appendChild(bookItem);
                toggleButton.textContent = 'Selesai dibaca';
            } else {
                completeBookList.appendChild(bookItem);
                toggleButton.textContent = 'Belum selesai dibaca';
            }
            isComplete = !isComplete;
            updateBookStatusInLocalStorage(id, isComplete);
        });

        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
        deleteButton.textContent = 'Hapus Buku';
        deleteButton.addEventListener('click', function () {
            bookItem.remove();
            removeBookFromLocalStorage(id);
        });

        const editButton = document.createElement('button');
        editButton.setAttribute('data-testid', 'bookItemEditButton');
        editButton.textContent = 'Edit Buku';
        editButton.addEventListener('click', function () {
            fillFormForEdit(id, title, author, year, isComplete);
        });

        buttonContainer.appendChild(toggleButton);
        buttonContainer.appendChild(deleteButton);
        buttonContainer.appendChild(editButton);

        bookItem.appendChild(bookTitle);
        bookItem.appendChild(bookAuthor);
        bookItem.appendChild(bookYear);
        bookItem.appendChild(buttonContainer);

        return bookItem;
    }

    function fillFormForEdit(id, title, author, year, isComplete) {
        document.getElementById('bookFormTitle').value = title;
        document.getElementById('bookFormAuthor').value = author;
        document.getElementById('bookFormYear').value = year;
        document.getElementById('bookFormIsComplete').checked = isComplete;

        isEditing = true;
        editingBookId = id;
    }

    function saveBookToLocalStorage(id, title, author, year, isComplete) {
        const book = { id, title, author, year, isComplete };
        let books = JSON.parse(localStorage.getItem('books')) || [];
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    function loadBooksFromLocalStorage() {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        incompleteBookList.innerHTML = '';
        completeBookList.innerHTML = '';
        books.forEach(book => {
            const bookItem = createBookItem(book.id, book.title, book.author, book.year, book.isComplete);
            if (book.isComplete) {
                completeBookList.appendChild(bookItem);
            } else {
                incompleteBookList.appendChild(bookItem);
            }
        });
    }

    function removeBookFromLocalStorage(id) {
        let books = JSON.parse(localStorage.getItem('books')) || [];
        books = books.filter(book => book.id !== id);
        localStorage.setItem('books', JSON.stringify(books));
    }

    function updateBookStatusInLocalStorage(id, isComplete) {
        let books = JSON.parse(localStorage.getItem('books')) || [];
        const bookIndex = books.findIndex(book => book.id === id);
        if (bookIndex !== -1) {
            books[bookIndex].isComplete = isComplete;
            localStorage.setItem('books', JSON.stringify(books));
        }
    }

    function updateBookInLocalStorage(id, title, author, year, isComplete) {
        let books = JSON.parse(localStorage.getItem('books')) || [];
        const bookIndex = books.findIndex(book => book.id === id);
        if (bookIndex !== -1) {
            books[bookIndex].title = title;
            books[bookIndex].author = author;
            books[bookIndex].year = year;
            books[bookIndex].isComplete = isComplete;
            localStorage.setItem('books', JSON.stringify(books));
        }
    }
});
