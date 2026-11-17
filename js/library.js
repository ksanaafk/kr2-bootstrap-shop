
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
    },

    traveling: {
        title: "Путешествие в Элевсин",
        author: "Виктор Олегович Пелевин",
        image: "images/traveling.jpg"
    },

    sinistra: {
        title: "A Sinistra | А Синистра | Левый Путь",
        author: "Виктор Олегович Пелевин",
        image: "images/sinistra.jpg"
    },

    "48": {
        title: "48 законов власти",
        author: "Роберт Грин",
        image: "images/48.jpg"
    },

    derzki: {
        title: "Дерзкий Уайлдер",
        author: "Ребекка Яррос",
        image: "images/derzki.jpg"
    },

    vnutre_opora: {
        title: "Внутренняя опора. В любой ситуации возвращайтесь к себе",
        author: "Анна Бабич",
        image: "images/vnutre_opora.jpg"
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

    library.push({
        id,
        status,
        totalPages: 0,
        currentPage: 0
    });

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


function updateReadingProgress(id, totalPages, currentPage) {

    const book = library.find(item => item.id === id);

    if (!book) {
        return;
    }

    totalPages = Number(totalPages);
    currentPage = Number(currentPage);

    // Проверяем корректность введённых значений
    if (
        !Number.isInteger(totalPages) ||
        !Number.isInteger(currentPage) ||
        totalPages <= 0 ||
        currentPage < 0 ||
        currentPage > totalPages
    ) {
        showMessage(
            "Проверь количество страниц. Прочитанных страниц не может быть больше общего количества."
        );
        return;
    }

    // Сохраняем прогресс
    book.totalPages = totalPages;
    book.currentPage = currentPage;

    saveLibrary();
    renderLibrary();

    showMessage("Прогресс чтения сохранён!");
}


function removeBook(id) {
    library = library.filter(book => book.id !== id);

    saveLibrary();
    renderLibrary();
    showMessage("Книга удалена из библиотеки.");
}


function animateCounter(element, target) {
    const start = Number(element.textContent) || 0;
    const duration = 500;
    const startTime = performance.now();

    function update(currentTime) {
        const progress = Math.min(
            (currentTime - startTime) / duration,
            1
        );

        const value = Math.round(
            start + (target - start) * progress
        );

        element.textContent = value;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}


function updateCounters() {

    // Количество книг по статусам
    const total = library.length;

    const planned = library.filter(
        book => book.status === "planned"
    ).length;

    const reading = library.filter(
        book => book.status === "reading"
    ).length;

    const finished = library.filter(
        book => book.status === "finished"
    ).length;

    // Статистика прочитанных страниц
    let readPages = 0;
    let totalPages = 0;

    library.forEach(book => {

        const total = Number(book.totalPages) || 0;
        const current = Number(book.currentPage) || 0;

        if (total > 0) {
            totalPages += total;
            readPages += Math.min(
                Math.max(current, 0),
                total
            );
        }

    });

    // Общий процент чтения
    const overallProgress = totalPages > 0
        ? Math.round(readPages / totalPages * 100)
        : 0;

    // Анимация всех шести показателей
    animateCounter(
        document.getElementById("totalBooksStat"),
        total
    );

    animateCounter(
        document.getElementById("plannedCount"),
        planned
    );

    animateCounter(
        document.getElementById("readingCount"),
        reading
    );

    animateCounter(
        document.getElementById("finishedCount"),
        finished
    );

    animateCounter(
        document.getElementById("readPagesStat"),
        readPages
    );

    animateCounter(
        document.getElementById("overallProgressStat"),
        overallProgress
    );

    // Обновляем диаграмму
    updateReadingChart(planned, reading, finished);
}


function updateReadingChart(planned, reading, finished) {

    const chart = document.getElementById("readingStatsChart");
    const legend = document.getElementById("readingStatsLegend");

    if (!chart || !legend) {
        return;
    }

    chart.innerHTML = "";
    legend.innerHTML = "";

    const total = planned + reading + finished;

    const statuses = [
        {
            name: "Хочу прочитать",
            count: planned,
            color: "#c4a18a"
        },
        {
            name: "Читаю",
            count: reading,
            color: "#a77b63"
        },
        {
            name: "Прочитано",
            count: finished,
            color: "#75453f"
        }
    ];

    statuses.forEach(status => {

        // Часть диаграммы
        const segment = document.createElement("div");

        const percent = total > 0
            ? status.count / total * 100
            : 0;

        segment.style.width = `${percent}%`;
        segment.style.backgroundColor = status.color;

        segment.title =
            `${status.name}: ${status.count} (${percent.toFixed(1)}%)`;

        chart.appendChild(segment);

        // Элемент легенды
        const legendItem = document.createElement("div");
        legendItem.className = "reading-stats-legend-item";

        const color = document.createElement("span");
        color.className = "reading-stats-legend-color";
        color.style.backgroundColor = status.color;

        const text = document.createElement("span");
        text.textContent =
            `${status.name}: ${status.count}`;

        legendItem.append(color, text);
        legend.appendChild(legendItem);

    });
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

        /* ========================================
        ДНЕВНИК ЧТЕНИЯ
        ======================================== */

        const progressSection = document.createElement("div");
        progressSection.className = "reading-progress-section mb-3";

        const progressTitle = document.createElement("h4");
        progressTitle.className = "h6 mb-3";
        progressTitle.textContent = "Прогресс чтения";

        // Общее количество страниц
        const totalLabel = document.createElement("label");
        totalLabel.className = "form-label";
        totalLabel.textContent = "Всего страниц";

        const totalInput = document.createElement("input");
        totalInput.type = "number";
        totalInput.className = "form-control mb-3";
        totalInput.min = "1";
        totalInput.step = "1";
        totalInput.placeholder = "Например, 300";
        totalInput.value = book.totalPages || "";

        // Количество прочитанных страниц
        const currentLabel = document.createElement("label");
        currentLabel.className = "form-label";
        currentLabel.textContent = "Прочитано страниц";

        const currentInput = document.createElement("input");
        currentInput.type = "number";
        currentInput.className = "form-control mb-3";
        currentInput.min = "0";
        currentInput.step = "1";
        currentInput.placeholder = "Например, 120";
        currentInput.value = book.currentPage ?? 0;

        // Вычисляем процент прочитанного
        const totalPages = Number(book.totalPages) || 0;
        const currentPage = Number(book.currentPage) || 0;

        const percent = totalPages > 0
            ? Math.min(100, Math.round(currentPage / totalPages * 100))
            : 0;

        // Текст с процентом
        const progressText = document.createElement("p");
        progressText.className = "reading-progress-text mb-2";
        progressText.textContent = `Прочитано: ${percent}%`;

        // Полоска прогресса
        const progressBar = document.createElement("div");
        progressBar.className = "reading-progress-bar";

        const progressFill = document.createElement("div");
        progressFill.className = "reading-progress-fill";
        progressFill.style.width = `${percent}%`;

        progressBar.appendChild(progressFill);

        // Кнопка сохранения
        const saveProgressBtn = document.createElement("button");
        saveProgressBtn.type = "button";
        saveProgressBtn.className = "btn btn-book w-100 mt-3";
        saveProgressBtn.textContent = "Сохранить прогресс";

        saveProgressBtn.addEventListener("click", () => {
            updateReadingProgress(
                book.id,
                totalInput.value,
                currentInput.value
            );
        });

        // Собираем блок
        progressSection.append(
            progressTitle,
            totalLabel,
            totalInput,
            currentLabel,
            currentInput,
            progressText,
            progressBar,
            saveProgressBtn
        );


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

        body.append(
            title,
            author,
            label,
            select,
            progressSection,
            details,
            removeButton
        );

        card.append(image, body);
        column.appendChild(card);
        libraryContainer.appendChild(column);
    });

    updateCounters();
}

addBookBtn.addEventListener("click", addBook);
libraryFilter.addEventListener("change", renderLibrary);

renderLibrary();
