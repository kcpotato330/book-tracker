let books = {};

function addBook() {
  const title = document.getElementById("bookInput").value.trim();
  if (!title) return;
  const id = "book_" + Date.now();
  books[id] = { title, status: 'toBeRead' };
  const el = createBookElement(id, title);
  document.getElementById("toBeReadShelf").appendChild(el);
  document.getElementById("bookInput").value = "";
}

function createBookElement(id, title) {
  const div = document.createElement("div");
  div.className = "book";
  div.textContent = title;
  div.id = id;
  div.draggable = true;
  div.ondragstart = (e) => e.dataTransfer.setData("text", id);
  div.onclick = () => {
    const book = books[id];
    if (book.status === 'read') {
      openDialog(id, title, !book.review);
    }
  };
  return div;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev, shelf) {
  ev.preventDefault();
  const id = ev.dataTransfer.getData("text");
  const book = books[id];
  book.status = shelf;
  const el = document.getElementById(id);
  document.getElementById(shelf + "Shelf").appendChild(el);

  if (shelf === "read" && !book.review) {
    openDialog(id, book.title, true);
  }
}

function openDialog(id, title, editing = false) {
  document.getElementById("dialogBookTitle").textContent = title;
  document.getElementById("reviewDialog").style.display = "block";
  document.getElementById("reviewDialog").dataset.bookId = id;

  if (editing) {
    document.getElementById("reviewSection").style.display = "block";
    document.getElementById("showReview").style.display = "none";
    document.getElementById("reviewText").value = "";
    document.getElementById("rating").value = 3;
  } else {
    const book = books[id];
    document.getElementById("reviewSection").style.display = "none";
    document.getElementById("showReview").style.display = "block";
    document.getElementById("showReview").innerHTML = `<p>${book.review}</p><p>${"⭐".repeat(book.rating)}</p>`;
  }
}

function closeDialog() {
  document.getElementById("reviewDialog").style.display = "none";
}

function saveReview() {
  const id = document.getElementById("reviewDialog").dataset.bookId;
  const review = document.getElementById("reviewText").value.trim();
  const rating = parseInt(document.getElementById("rating").value);
  if (!review || !rating) return;

  books[id].review = review;
  books[id].rating = rating;
  closeDialog();
}