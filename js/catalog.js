
const searchInput = document.getElementById("searchInput");
const genreFilter = document.getElementById("genreFilter");
const books = document.querySelectorAll(".book-item");
const noResults = document.getElementById("noResults");

// Функция поиска и фильтрации книг
function filterBooks() {
    const searchText = searchInput.value.toLowerCase().trim();
    const selectedGenre = genreFilter.value;

    let visibleCount = 0;

    books.forEach(book => {
        const title = book.dataset.title.toLowerCase();
        const author = book.dataset.author.toLowerCase();
        const genre = book.dataset.genre;

        // Проверка названия и автора
        const matchesSearch =
            title.includes(searchText) ||
            author.includes(searchText);

        // Проверка жанра
        const matchesGenre =
            selectedGenre === "all" ||
            genre === selectedGenre;

        // Показываем или скрываем карточку
        if (matchesSearch && matchesGenre) {
            book.classList.remove("d-none");
            visibleCount++;
        } else {
            book.classList.add("d-none");
        }
    });

    // Сообщение, если ничего не найдено
    if (visibleCount === 0) {
        noResults.classList.remove("d-none");
    } else {
        noResults.classList.add("d-none");
    }
}

// Поиск при вводе текста
searchInput.addEventListener("input", filterBooks);

// Фильтрация при выборе жанра
genreFilter.addEventListener("change", filterBooks);

// Первоначальное отображение
filterBooks();
