
/* ========================================
   ОЦЕНКИ И ОТЗЫВЫ О КНИГАХ
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    // Получаем ID книги из адресной строки
    const params = new URLSearchParams(window.location.search);
    const bookId = params.get("id");

    // Элементы страницы
    const reviewForm = document.getElementById("reviewForm");
    const ratingInput = document.getElementById("ratingInput");
    const reviewsList = document.getElementById("reviewsList");

    const averageRating = document.getElementById("averageRating");
    const averageStars = document.getElementById("averageStars");
    const reviewsCount = document.getElementById("reviewsCount");

    const reviewName = document.getElementById("reviewName");
    const reviewText = document.getElementById("reviewText");
    const reviewMessage = document.getElementById("reviewMessage");

    if (!bookId || !reviewForm || !ratingInput) {
        return;
    }

    // Ключ для хранения отзывов конкретной книги
    const storageKey = `bookspaceReviews_${bookId}`;

    let selectedRating = 0;

    // Получение отзывов из localStorage
    function getReviews() {
        try {
            const data = JSON.parse(
                localStorage.getItem(storageKey) || "[]"
            );

            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Ошибка чтения отзывов:", error);
            return [];
        }
    }

    // Сохранение отзывов
    function saveReviews(reviews) {
        localStorage.setItem(
            storageKey,
            JSON.stringify(reviews)
        );
    }

    // Отображение выбранных звёзд
    function updateRatingStars(rating) {
        const buttons = ratingInput.querySelectorAll("button");

        buttons.forEach(button => {
            const value = Number(button.dataset.rating);

            button.textContent = value <= rating ? "★" : "☆";

            button.setAttribute(
                "aria-pressed",
                String(value === selectedRating)
            );
        });
    }

    // Выбор оценки
    ratingInput.querySelectorAll("button").forEach(button => {

        button.addEventListener("click", () => {
            selectedRating = Number(button.dataset.rating);
            updateRatingStars(selectedRating);
        });

        button.addEventListener("mouseenter", () => {
            updateRatingStars(Number(button.dataset.rating));
        });

        button.addEventListener("mouseleave", () => {
            updateRatingStars(selectedRating);
        });

    });

    // Создание карточки отзыва
    function createReviewCard(review) {

        const card = document.createElement("div");
        card.className = "review-card";

        const header = document.createElement("div");
        header.className = "review-card-header";

        const author = document.createElement("span");
        author.className = "review-author";
        author.textContent = review.name;

        const date = document.createElement("span");
        date.className = "review-date";
        date.textContent = review.date;

        header.append(author, date);

        const stars = document.createElement("div");
        stars.className = "review-card-stars";
        stars.textContent =
            "★".repeat(review.rating) +
            "☆".repeat(5 - review.rating);

        const text = document.createElement("p");
        text.className = "review-card-text";
        text.textContent = review.text;

        const deleteButton = document.createElement("button");
        deleteButton.className = "review-delete";
        deleteButton.type = "button";
        deleteButton.textContent = "Удалить отзыв";

        deleteButton.addEventListener("click", () => {
            if (!confirm("Удалить этот отзыв?")) {
                return;
            }

            const reviews = getReviews().filter(
                item => item.id !== review.id
            );

            saveReviews(reviews);
            renderReviews();
        });

        card.append(
            header,
            stars,
            text,
            deleteButton
        );

        return card;
    }

    // Отображение отзывов и средней оценки
    function renderReviews() {

        const reviews = getReviews();

        reviewsList.innerHTML = "";

        if (reviews.length === 0) {

            averageRating.textContent = "0.0";
            averageStars.textContent = "☆☆☆☆☆";
            reviewsCount.textContent = "Пока нет отзывов";

            const emptyMessage = document.createElement("p");
            emptyMessage.textContent =
                "Пока нет отзывов. Станьте первым!";

            reviewsList.appendChild(emptyMessage);
            return;
        }

        // Средняя оценка
        const total = reviews.reduce(
            (sum, review) => sum + review.rating,
            0
        );

        const average = total / reviews.length;

        averageRating.textContent = average.toFixed(1);

        const rounded = Math.round(average);

        averageStars.textContent =
            "★".repeat(rounded) +
            "☆".repeat(5 - rounded);

        reviewsCount.textContent =
            `Количество отзывов: ${reviews.length}`;

        // Новые отзывы показываем первыми
        reviews.slice().reverse().forEach(review => {
            reviewsList.appendChild(createReviewCard(review));
        });
    }

    // Публикация отзыва
    reviewForm.addEventListener("submit", event => {

        event.preventDefault();

        const name = reviewName.value.trim();
        const text = reviewText.value.trim();

        if (selectedRating === 0) {
            reviewMessage.textContent =
                "Пожалуйста, выберите оценку от 1 до 5.";
            return;
        }

        if (!name || !text) {
            reviewMessage.textContent =
                "Заполните имя и текст отзыва.";
            return;
        }

        const newReview = {
            id: crypto.randomUUID(),
            name: name,
            text: text,
            rating: selectedRating,
            date: new Date().toLocaleDateString("ru-RU")
        };

        const reviews = getReviews();

        reviews.push(newReview);

        try {
            saveReviews(reviews);
        } catch (error) {
            reviewMessage.textContent =
                "Не удалось сохранить отзыв.";
            return;
        }

        // Очищаем форму
        reviewForm.reset();

        selectedRating = 0;
        updateRatingStars(0);

        reviewMessage.textContent =
            "Отзыв успешно опубликован!";

        renderReviews();
    });

    // Первоначальная загрузка отзывов
    updateRatingStars(0);
    renderReviews();

});
