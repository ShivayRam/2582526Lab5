const express = require('express');
const app = express(); //call the express function to our constant app
app.use(express.json());
const PORT = 3000; // tje port we are going to usee

let books = []; // where we are going to store the books as we arent using a database

//pretty sure I could have done this another way but yeah
let nxtDetailId = 1; //gonna use this to iterate through books details
let nxtBookId = 1; //same as above except for the books themselves. 

//GET request for when we want to see the the student numbers located in whoami
app.get('/whoami', (req, res) => {
    res.json({ studentNumber: "2582526" }); // i sued my student number as an example
});


//simple GETview the books already there
app.get('/books', (req, res) => {
    res.json(books);
});


//this is a GET to view a specific book by id number
app.get('/books/:id', (req, res) => {

    const book = books.find(book => book.id === req.params.id);

    //checking if a valid book as selected
    if(!book){
        return res.status(404).json({ error: "Book Not Found"}); //throws the status code error appropriate
    }

    res.json(book); // fetches if validation passed
});

//Post request to add a book with all required details to the list
app.post('/books', (req, res) => {
    const { title, details } = req.body;

    if ( !details || !title || !Array.isArray(details) || details.length === 0){
            return res.status(400).json({ error: "Bad Request" }); // Throws the appropriate error if user fails to enter all the required details fields
    }
    
    //this assigns all the required details in the details fields
    const newBook = {
        id: nxtBookId.toString(),
        title,
        details: details.map(detail => ({
            id: (nxtDetailId++).toString(), //need to be in string format because lucky
            author: detail.author,
            genre: detail.genre,
            publicationYear: detail.publicationYear
        })) 
    };
    books.push(newBook); //puts the new book into the book list
    nxtBookId++; //increments the next bookID BY 1 SO THAT THE the next  book added has a new incremented id 
    res.status(201).json(newBook); // fetches if validation passed
});

//PUT request to update a currwent book in the list
app.put('/books/:id', (req, res) => {
    const book = books.find(book => book.id === req.params.id);

    if (!book) {
        return res.status(404).json({error: "Book Not Found"});
    }

    const {title} = req.body;

    if (title)book.title = title; //gives the new book the title

    res.json(book); // fetches if validation passed
});

//DELETE request to delete a book from list
app.delete('/books/:id', (req, res) => {
    const index = books.findIndex(book => book.id === req.params.id);
    if(index === -1) { //checks if an invalid index was chosen
        return res.status(404).json({error: "Book Not Found"}); // throws this error if they try to submit an invalid index 
    }

    const deletedBook = books.splice(index, 1); // deletes the selected boo from the list
    res.json(deletedBook[0]); // fetches if validation passed
});

/*app.post('/books/:id/details', (req, res) => {
    const book = books.find(book => book.id === req.params.id);

    if (!book) {
        return res.status(404).json({error: "Book Not Found"});//i think its the right error messGE
    }

    const {author, genre, publicationYear} = req.body;

    if (!author || !genre || !publicationYear) { //checks if there is a value from a field missing
        return res.status(400).json({error: "Bad Request"}) //throws the appropriate error message iuf so
    }*/

//POST request to add detaILS TO book
app.post('/books/:id/details', (req, res) => {
    const book = books.find(book => book.id === req.params.id);

    if (!book) {
        return res.status(404).json({error: "Book Not Found"});//i think its the right error messGE
    }

    const {author, genre, publicationYear} = req.body;

    if (!author || !genre || !publicationYear) { //checks if there is a value from a field missing
        return res.status(400).json({error: "Bad Request"}) //throws the appropriate error message iuf so
    }

    const newDetail = {
        id: (nxtDetailId++).toString(), //converts the ID we are going to give the book into a string as Lucky wanted us to
        author,
        genre,
        publicationYear
    };

    book.details.push(newDetail); //pushes the new book details into the desired book 
    res.status(201).json(newDetail); // fetches if validation passed
});

app.delete('/books/:id/details/:detailId', (req, res) => {
    const book = books.find(book => book.id === req.params.id);

    if(!book) { //if no bvalid bopok selected
        return res.status(404).json({error: "Book not found"}); // throws appropriate error
    }

    const detIndex = book.details.findIndex(det => det.id === req.params.detailId);

    if (detIndex === -1) { //checks to see if invalid index was chosen 
        return res.status(404).json({error: "Detail Not Found"}); //throws error
    }

    const removedDet = book.details.splice(detailIndex, 1);
    res.json(removedDet[0]); // fetches if validation passed
});

/*
pp.delete('/books/:id', (req, res) => {
    const index = books.findIndex(book => book.id === req.params.id);
    if(index === -1) { //checks if an invalid index was chosen
        return res.status(404).json({error: "Book Not Found"}); // throws this error if they try to submit an invalid index 
    }

    c
*/


app.listen(PORT, () => {
    console.log(`Server working on PORT: ${PORT}`)
});



