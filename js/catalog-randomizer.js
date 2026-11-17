
document.addEventListener("DOMContentLoaded", () => {

    const randomBtn = document.getElementById("randomBookBtn");
    const result = document.getElementById("randomBookResult");

    if (!randomBtn || !result) return;

    const storageKey = "bookspaceLibrary";
    let lastBookId = null;

    // Получаем книги из каталога
    function getCatalogBooks() {
        const cards = document.querySelectorAll(".book-item");
        const books = [];

        cards.forEach(card => {
            const link = card.querySelector(
                'a[href*="book.html?id="]'
            );

            if (!link) return;

            const url = new URL(link.href);
            const id = url.searchParams.get("id");

            if (!id || books.some(book => book.id === id)) return;

            const title = card.querySelector(".card-title");
            const image = card.querySelector("img");

            const author = card.querySelector(
                ".book-author, .card-text"
            );

            books.push({
                id,
                title: title?.textContent.trim() || "Без названия",
                author: author?.textContent.trim() || "",
                image: image?.getAttribute("src") || ""
            });
        });

        return books;
    }

    // Получаем ID книг из личной библиотеки
    function getLibraryIds() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(storageKey) || "[]"
            );

            if (!Array.isArray(saved)) return new Set();

            return new Set(saved.map(book => book.id));
        } catch {
            return new Set();
        }
    }

    // Случайный выбор
    function chooseRandom(books) {
        return books[Math.floor(Math.random() * books.length)];
    }

    // Показываем выбранную книгу
    function showBook(book) {
        result.replaceChildren();

        const card = document.createElement("div");
        card.className = "random-book-card";

        const image = document.createElement("img");
        image.src = book.image;
        image.alt = book.title;
        image.className = "random-book-image";

        const info = document.createElement("div");
        info.className = "random-book-info";

        const title = document.createElement("h3");
        title.className = "h5 mb-2";
        title.textContent = book.title;

        const author = document.createElement("p");
        author.className = "mb-3";
        author.textContent = book.author;

        const actions = document.createElement("div");
        actions.className = "random-book-actions";

        const details = document.createElement("a");
        details.href = "book.html?id=" + encodeURIComponent(book.id);
        details.className = "btn btn-outline-secondary";
        details.textContent = "Подробнее";

        const addBtn = document.createElement("button");
        addBtn.type = "button";
        addBtn.className = "btn btn-book";
        addBtn.textContent = "В мою библиотеку";

        addBtn.addEventListener("click", () => {
            let library;

            try {
                library = JSON.parse(
                    localStorage.getItem(storageKey) || "[]"
                );
            } catch {
                library = [];
            }

            if (!Array.isArray(library)) library = [];

            if (library.some(item => item.id === book.id)) {
                addBtn.textContent = "Уже в библиотеке";
                addBtn.disabled = true;
                return;
            }

            library.push({
                id: book.id,
                status: "planned",
                totalPages: 0,
                currentPage: 0
            });

            try {
                localStorage.setItem(
                    storageKey,
                    JSON.stringify(library)
                );
            } catch {
                addBtn.textContent = "Ошибка сохранения";
                return;
            }

            addBtn.textContent = "Добавлено!";
            addBtn.disabled = true;
        });

        actions.append(details, addBtn);
        info.append(title, author, actions);
        card.append(image, info);
        result.appendChild(card);
    }

    // Анимация выбора
    randomBtn.addEventListener("click", () => {

        const libraryIds = getLibraryIds();

        const availableBooks = getCatalogBooks().filter(
            book => !libraryIds.has(book.id)
        );

        if (availableBooks.length === 0) {
            result.textContent =
                "Все книги из каталога уже добавлены в твою библиотеку!";
            return;
        }

        // Не повторяем предыдущую книгу, если есть другие
        let candidates = availableBooks.filter(
            book => book.id !== lastBookId
        );

        if (candidates.length === 0) {
            candidates = availableBooks;
        }

        const selectedBook = chooseRandom(candidates);
        lastBookId = selectedBook.id;

        randomBtn.disabled = true;

        let steps = 0;
        const maxSteps = 12;

        const animation = setInterval(() => {
            const previewBook = chooseRandom(availableBooks);
            showBook(previewBook);

            steps++;

            if (steps >= maxSteps) {
                clearInterval(animation);
                showBook(selectedBook);
                randomBtn.disabled = false;
            }
        }, 90);
    });

});
