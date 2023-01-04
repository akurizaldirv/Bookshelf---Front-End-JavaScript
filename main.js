 const books = [];
 const STORAGE_KEY = 'BOOKSHELF-APPS'
 const RENDER_EVENT = "render-book";
 const SAVED_EVENT = "saved-book";

 function isStorageExist(){
    return (typeof(Storage) !== 'undefined');
 }
 
 function generateId() {
     return +new Date();
 }
 
 function generateBookObject(id, title, author, year, isCompleted) {
     return {
        id, title, author, year, isCompleted
     }
 }
 
 function findBook(bookId){
     for(bookItem of books){
         if(bookItem.id === bookId){
             return bookItem
         }
     }
     return null
 }
 
 function findBookIndex(bookId) {
     for(index in books){
         if(books[index].id === bookId){
             return index
         }
     }
     return -1
 }

 function makeBook(bookObject) {

    const {id, title, author, year, isCompleted} = bookObject;

    const textTitle = document.createElement("h5");
    textTitle.innerText = title;

    const textAuthorYear = document.createElement("p");
    textAuthorYear.innerHTML = 'Penulis ' + author + '<br>Tahun: ' + year;

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');

    const articleContainer = document.createElement('article');
    articleContainer.classList.add('book_item');
    articleContainer.append(textTitle, textAuthorYear, actionContainer);
    articleContainer.setAttribute('id', id);

    if(isCompleted){
        const greenBtn = document.createElement('button');
        greenBtn.classList.add('green');
        greenBtn.innerText = 'Belum Selesai Dibaca';

        const yellowBtn = document.createElement('button');
        yellowBtn.classList.add('yellow');
        yellowBtn.innerText = 'Edit Buku';
        
        const redBtn = document.createElement('button');
        redBtn.classList.add('red');
        redBtn.innerText = 'Hapus Buku';
        
        greenBtn.addEventListener("click", function () {
            undoBookFromCompleted(id);
        });
        yellowBtn.addEventListener("click", function () {
            const editCol = document.getElementById('editCol');
            editCol.removeAttribute('hidden', true);

            window.location = "#editCol";

            bookIndex = findBookIndex(id);
            if(bookIndex === -1) return;

            editBookTitle = document.getElementById('editBookTitle');
            editBookTitle.value = books[bookIndex].title;

            editBookAuthor = document.getElementById('editBookAuthor');
            editBookAuthor.value = books[bookIndex].author;

            editBookYear = document.getElementById('editBookYear');
            editBookYear.value = books[bookIndex].year;

            editBook = document.getElementById('editBook');
            editBook.addEventListener('submit', function(){
                event.preventDefault();

                books[bookIndex].title = editBookTitle.value;
                books[bookIndex].author = editBookAuthor.value;
                books[bookIndex].year = editBookYear.valueAsNumber;

                document.dispatchEvent(new Event(RENDER_EVENT));
                saveData();
            })
        });
        redBtn.addEventListener("click", function () {
            removeBook(id);
        });
    
        actionContainer.append(greenBtn, yellowBtn, redBtn);

    } else {
        const greenBtn = document.createElement('button');
        greenBtn.classList.add('green');
        greenBtn.innerText = 'Selesai Dibaca';

        const yellowBtn = document.createElement('button');
        yellowBtn.classList.add('yellow');
        yellowBtn.innerText = 'Edit Buku';
        
        const redBtn = document.createElement('button');
        redBtn.classList.add('red');
        redBtn.innerText = 'Hapus Buku';
        
        greenBtn.addEventListener("click", function () {
            addBookToCompleted(id);
        });
        yellowBtn.addEventListener("click", function () {
            const editCol = document.getElementById('editCol');
            editCol.removeAttribute('hidden', true);

            window.location = "#editCol";

            bookIndex = findBookIndex(id);
            if(bookIndex === -1) return;

            editBookTitle = document.getElementById('editBookTitle');
            editBookTitle.value = books[bookIndex].title;

            editBookAuthor = document.getElementById('editBookAuthor');
            editBookAuthor.value = books[bookIndex].author;

            editBookYear = document.getElementById('editBookYear');
            editBookYear.value = books[bookIndex].year;

            editBook = document.getElementById('editBook');
            editBook.addEventListener('submit', function(){
                event.preventDefault();

                books[bookIndex].title = editBookTitle.value;
                books[bookIndex].author = editBookAuthor.value;
                books[bookIndex].year = editBookYear.valueAsNumber;

                document.dispatchEvent(new Event(RENDER_EVENT));
                saveData();
            })
        });
        redBtn.addEventListener("click", function () {
            removeBook(id);
        });
    
        actionContainer.append(greenBtn, yellowBtn, redBtn);


    }

    return articleContainer;
}

function addBook() {
    const inputTitle = document.getElementById("inputBookTitle").value;
    const inputAuthor = document.getElementById("inputBookAuthor").value;
    const inputYear = document.getElementById("inputBookYear").valueAsNumber;
    const inputBookIsComplete = document.getElementById("inputBookIsComplete").checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, inputTitle, inputAuthor, inputYear, inputBookIsComplete);
    books.push(bookObject);
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    window.alert('Berhasil Menambahkan Buku '+ bookObject.title);
}

function addBookToCompleted(bookId) {

    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    window.alert('Berhasil Memindahkan ' + bookTarget.title + ' kedalam Rak Selesai Dibaca');
}

function removeBook(bookId) {
    const bookTarget = findBookIndex(bookId);
    if(bookTarget === -1) return;
    const bookTargetName = books[bookTarget].title;
    books.splice(bookTarget, 1);
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    window.alert('Berhasil Menghapus ' + bookTargetName);
}

function undoBookFromCompleted(bookId){

    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    window.alert('Berhasil Memindahkan ' + bookTarget.title + ' kedalam Rak Belum Selesai Dibaca');
}

document.addEventListener("DOMContentLoaded", function () {

    const submitForm = document.getElementById("inputBook");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist) {
        loadDataFromStorage();
    }

    const checkRead = document.getElementById('inputBookIsComplete');
    const textReadOnSubmit = document.getElementById('readOrNot')
    checkRead.addEventListener('change', function(){
        if (checkRead.checked) {
            textReadOnSubmit.innerText = 'Selesai Dibaca';
        } else {
            textReadOnSubmit.innerText = 'Belum Selesai Dibaca';}
    })

    const searchBook = document.getElementById('searchBook');
    searchBook.addEventListener('submit',function(){
        event.preventDefault();
        searchMyBook(document.getElementById('searchBookTitle').value);
    });
});

function searchMyBook(keyWord){
    const searchResult = [];
    for (let searchingBook of books){
        if (searchingBook.title == keyWord) {
            searchResult.push(searchingBook);
        }
    }

    const uncompletedList = document.getElementById("incompleteBookshelfList");
    const completedList = document.getElementById("completeBookshelfList");

    uncompletedList.innerHTML = ""
    completedList.innerHTML = ""

    for(bookItem of searchResult){
        const bookElement = makeBook(bookItem);
        if(bookItem.isCompleted){
            completedList.append(bookElement);
        } else {
            uncompletedList.append(bookElement);
        }
    }
}

document.addEventListener(RENDER_EVENT, function () {
    const editCol = document.getElementById('editCol');
    editCol.setAttribute('hidden', true);

    const uncompletedList = document.getElementById("incompleteBookshelfList");
    const completedList = document.getElementById("completeBookshelfList");

    uncompletedList.innerHTML = ""
    completedList.innerHTML = ""

    for(bookItem of books){
        const bookElement = makeBook(bookItem);
        if(bookItem.isCompleted){
            completedList.append(bookElement);
        } else {
            uncompletedList.append(bookElement);
        }
    }
})


function saveData(){
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

document.addEventListener(SAVED_EVENT, function(){
    console.log('Data Buku : \n' + localStorage.getItem(STORAGE_KEY));
})

function loadDataFromStorage(){
    const data = localStorage.getItem(STORAGE_KEY);
    let datas = JSON.parse(data);
    if (datas !== null) {
        for (let book of datas){
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}