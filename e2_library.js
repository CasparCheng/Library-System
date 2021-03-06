/* E2 Library - JS */

/*-----------------------------------------------------------*/
/* Starter code - DO NOT edit the code below. */
/*-----------------------------------------------------------*/

// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron objet

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this; // keep book in scope of anon function (why? the call-site for 'this' in the anon function is the DOM window)
		setTimeout(function() {
			
			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function(name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
}


// Adding these books does not change the DOM - we are simply setting up the 
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'))
patrons.push(new Patron('Kelly Jones'))

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime()  // check console to see a log after 3 seconds

console.log(patrons);
/* Select all DOM form elements you'll need. */ 
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron)
bookInfoForm.addEventListener('submit', getBookInfo);

/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary)

/*-----------------------------------------------------------*/
/* End of starter code - do *not* edit the code above. */
/*-----------------------------------------------------------*/


/** ADD your code to the functions below. DO NOT change the function signatures. **/


/*** Functions that don't edit DOM themselves, but can call DOM functions 
     Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()
function addNewBookToBookList(e) {
	e.preventDefault();

	// Add book book to global array
	let bookName = document.querySelector('#newBookName').value;
	let bookAuthor = document.querySelector('#newBookAuthor').value;
	let bookGenre = document.querySelector('#newBookGenre').value;
	libraryBooks.push(new Book(bookName, bookAuthor, bookGenre));
	// Call addBookToLibraryTable properly to add book to the DOM
	addBookToLibraryTable(libraryBooks);
	
}

// Changes book patron information, and calls 
function loanBookToPatron(e) {
	e.preventDefault();

	// Get correct book and patron
	let bookId = document.querySelector('#loanBookId').value;
	let cardNum = document.querySelector('#loanCardNum').value;
	let book = libraryBooks[bookId];
	book.patron = {
		'cardNumber': cardNum
	}
	console.log(book);

	// Add book to the patron's book table in the DOM by calling addBookToPatronLoans()

	addBookToPatronLoans(book);	

	// Start the book loan timer.
	book.setLoanTime();
	

}

// Changes book patron information and calls returnBookToLibraryTable()

function returnBookToLibrary(e){
	e.preventDefault();
	// check if return button was clicked, otherwise do nothing.
	let tar = e.target;
	console.log(tar.tagName);
	if(tar.tagName == 'BUTTON') {
		
		let id = tar.id;
		// Call removeBookFromPatronTable()
		removeBookFromPatronTable(libraryBooks[id]);
		
		// Change the book object to have a patron of 'null'
		libraryBooks[id].patron = null;
	}
	
}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();

	// Add a new patron to global array
	let patronName = document.querySelector('#newPatronName').value;
	patrons.push(new Patron(patronName));
	console.log(patrons);
	// Call addNewPatronEntry() to add patron to the DOM
	addNewPatronEntry(patrons);
}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();

	// Get correct book
	let bookId = document.querySelector('#bookInfoId').value;
	let book;
	console.log(libraryBooks);

	for(var i = 0; i < libraryBooks.length; i++) {
		console.log(libraryBooks[i].bookId + '---' + bookId)
		if(libraryBooks[i].bookId == bookId) {
			book = libraryBooks[i];
			// Call displayBookInfo()	
			
			if(book) {
				displayBookInfo(book);
			}
		}
	}

	
}


/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/

// Adds a book to the library table.
function addBookToLibraryTable(book) {
	// Add code here
	console.log(book);
	let len = book.length - 1;
	let tr = document.createElement('tr');
	console.log(book[len])
	tr.innerHTML = '<td>'+ book[len].bookId +'</td><td><strong>'+ book[len].title +'</strong></td><td id="id'+len+'"></td>';
	bookTable.appendChild(tr);
	

}


// Displays deatiled info on the book in the Book Info Section
function displayBookInfo(book) {
	// Add code here
	let bookInfo = document.querySelector('#bookInfo');
	let str = '';
	let patron = patrons[book.bookId];
	let name = 'N/A';
	if(patron) {
		name = patron.name ? patron.name : 'N/A';
	}
	str += '<p>Book Id: <span>'+ book.bookId +'</span></p>';
	str += '<p>Title: <span>'+ book.title +'</span></p>';
	str += '<p>Author: <span>'+ book.author +'</span></p>';
	str += '<p>Genre: <span>'+ book.genre +'</span></p>';
	str += '<p>Currently loaded to: <span>'+ name +'</span></p>';
	bookInfo.innerHTML = str;

}

// Adds a book to a patron's book list with a status of 'Within due date'. 
// (don't forget to add a 'return' button).
function addBookToPatronLoans(book) {
	// Add code here
	let patrons = document.getElementsByClassName('patron');
	let patron = patrons[parseInt(book.patron.cardNumber)];
	
	console.log(patron);
	let box = patron.getElementsByTagName('tbody')[0];
	let tr = document.createElement('tr');
	tr.innerHTML = '<td>'+ book.bookId +'</td><td>'+ book.title +'</td><td><span class="green">Within due date</span></td><td><button class="return" id="'+book.bookId+'">return</button></td>';
	box.appendChild(tr);
	let id = book.bookId;
	let books = document.getElementById('bookTable');
	let trs = books.getElementsByTagName('tr');
	let tr1 = trs[id + 1];

	let tds = tr1.getElementsByTagName('td');
	let td = tds[2];
	td.innerHTML = book.patron.cardNumber;
}

// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status).
function addNewPatronEntry(patron) {
	// Add code here
	let div = document.createElement('div');
	div.className = 'patron';
	let len = patron.length - 1;
	div.innerHTML += '<p>Name: <span>'+ patron[len].name +'</span></p>';
	div.innerHTML += '<p>Card Number: <span>'+ patron[len].cardNumber +'</span></p>';
	div.innerHTML += '<h4>Books on loan:</h4>';
	div.innerHTML += '<table class="patronLoansTable"><tbody><tr><th>BookID</th><th>Title</th><th>Status</th><th>Return</th></tr></tbody></table>';
	patronEntries.appendChild(div);
}


// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {
	// Add code here
	console.log(book);
	let index = book.bookId;
	let patrons1 = document.getElementsByClassName('patron');
	let patron1 = patrons1[index];
	let trs2 = patron1.getElementsByTagName('tr');
	let tr2 = trs2[1];
	tr2.parentNode.removeChild(tr2);
	let id = book.bookId;
	let books = document.getElementById('bookTable');
	let trs = books.getElementsByTagName('tr');
	let tr1 = trs[id + 1];

	let tds = tr1.getElementsByTagName('td');
	let td = tds[2];
	td.innerHTML = '';
	let patron = patrons[book.bookId];
	patron.name = '';
	delete book;



}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {
	// Add code here
	console.log(book);
	let index = book.bookId;
	let patrons = document.getElementsByClassName('patron');
	let patron = patrons[index];
	let td = patron.getElementsByTagName('td');
	td[2].innerHTML = '<span class="red">Overdue</span>';

}

