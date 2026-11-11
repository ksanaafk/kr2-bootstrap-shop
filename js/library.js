
const booksData = {
    blizkie_ludi: {
        title: "Близкие люди. Как сохранить друзей в современном мире",
        author: "Анна Гольдфарб",
        image: "images/blizkie_ludi.jpg"
    },
    chelovek_v_poiskah_identichnosti: {
        title: "Человек в поисках идентичности. Как найти свое место в жизни",
        author: "Ким Даббс",
        image: "images/chelovek_v_poiskah_identichnosti.jpg"
    },
    trevoga: {
        title: "Тревога. Расстанься с ней и живи спокойно",
        author: "Евгения Петровна Иванова, Кирилл Заровный",
        image: "images/trevoga.jpg"
    },
    volya_k_smslu: {
        title: "Воля к смыслу",
        author: "Виктор Франкл",
        image: "images/volya_k_smslu.jpg"
    },
    granatovi_braslet: {
        title: "Гранатовый браслет. Сборник",
        author: "Александр Куприн",
        image: "images/granatovi_braslet.jpg"
    },
    skazka_o_saltane: {
        title: "Сказка о царе Салтане",
        author: "Александр Пушкин",
        image: "images/skazka_o_saltane.jpg"
    },
    fiesta: {
        title: "Фиеста (И восходит солнце)",
        author: "Эрнест Хемингуэй",
        image: "images/fiesta.jpg"
    },
    potomok: {
        title: "Потомокъ. Князь мертвецов",
        author: "Илона Волынская, Кирилл Кащеев",
        image: "images/potomok.jpg"
    },
    grek: {
        title: "Цирцея",
        author: "Мадлен Миллер",
        image: "images/grek.jpg"
    }
};

const statusNames = {
    planned: "Хочу прочитать",
    reading: "Читаю",
    finished: "Прочитано"
};

const storageKey = "bookspaceLibrary";

const bookSelect = document.getElementById("bookSelect");
const statusSelect = document.getElementById("statusSelect");
const addBookBtn = document.getElementById("addBookBtn");
const libraryFilter = document.getElementById("libraryFilter");
const libraryContainer = document.getElementById("libraryContainer");
const emptyLibrary = document.getElementById("emptyLibrary");
const libraryMessage = document.getElementById("libraryMessage");

function loadLibrary() {
    try {
        const saved = JSON.parse(localStorage.getItem(storageKey));

        if (!Array.isArray(saved)) {
            return [];
        }

        return saved.filter(item =>
            booksData[item.id] &&
            statusNames[item.status]
        );
    } catch {
        return [];
    }
}

let library = loadLibrary();

function saveLibrary() {
    localStorage.setItem(storageKey, JSON.stringify(library));
}

function showMessage(message) {
    libraryMessage.textContent = message;
}

function addBook() {
    const id = bookSelect.value;
    const status = statusSelect.value;

    if (!id) {
        showMessage("Сначала выбери книгу.");
        return;
    }

    if (library.some(book => book.id === id)) {
        showMessage("Эта книга уже есть в твоей библиотеке.");
        return;
    }

    library.push({ id, status });

    saveLibrary();
    renderLibrary();

    bookSelect.value = "";
    showMessage("Книга добавлена в библиотеку!");
}

function changeStatus(id, newStatus) {
    if (!statusNames[newStatus]) {
        return;
    }

    const book = library.find(item => item.id === id);

    if (book) {
        book.status = newStatus;
        saveLibrary();
        renderLibrary();
    }
}

function removeBook(id) {
    library = library.filter(book => book.id !== id);

    saveLibrary();
    renderLibrary();
    showMessage("Книга удалена из библиотеки.");
}

function updateCounters() {
    document.getElementById("plannedCount").textContent =
        library.filter(book => book.status === "planned").length;

    document.getElementById("readingCount").textContent =
        library.filter(book => book.status === "reading").length;

    document.getElementById("finishedCount").textContent =
        library.filter(book => book.status === "finished").length;
}

function renderLibrary() {
    libraryContainer.innerHTML = "";

    const selectedFilter = libraryFilter.value;

    const visibleBooks = library.filter(book =>
        selectedFilter === "all" ||
        book.status === selectedFilter
    );

    emptyLibrary.classList.toggle(
        "d-none",
        visibleBooks.length > 0
    );

    visibleBooks.forEach(book => {
        const info = booksData[book.id];

        const column = document.createElement("div");
        column.className = "col-12 col-sm-6 col-lg-4";

        const card = document.createElement("div");
        card.className = "card book-card h-100";

        const image = document.createElement("img");
        image.src = info.image;
        image.alt = info.title;
        image.className = "card-img-top";

        const body = document.createElement("div");
        body.className = "card-body";

        const title = document.createElement("h3");
        title.className = "card-title h5";
        title.textContent = info.title;

        const author = document.createElement("p");
        author.className = "card-text";
        author.textContent = info.author;

        const label = document.createElement("label");
        label.className = "form-label";
        label.textContent = "Статус чтения";

        const select = document.createElement("select");
        select.className = "form-select mb-3";
        select.setAttribute("aria-label", "Статус: " + info.title);

        Object.entries(statusNames).forEach(([value, name]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = name;
            select.appendChild(option);
        });

        select.value = book.status;
        select.addEventListener("change", () => {
            changeStatus(book.id, select.value);
        });

        const details = document.createElement("a");
        details.href = "book.html?id=" + encodeURIComponent(book.id);
        details.className = "btn btn-outline-secondary mb-2";
        details.textContent = "Подробнее";

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "btn btn-outline-danger";
        removeButton.textContent = "Удалить";
        removeButton.addEventListener("click", () => {
            removeBook(book.id);
        });

        body.append(title, author, label, select, details, removeButton);
        card.append(image, body);
        column.appendChild(card);
        libraryContainer.appendChild(column);
    });

    updateCounters();
}

addBookBtn.addEventListener("click", addBook);
libraryFilter.addEventListener("change", renderLibrary);

renderLibrary();
