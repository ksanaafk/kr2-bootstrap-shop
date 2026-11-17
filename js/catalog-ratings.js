
/* ========================================
   РЕЙТИНГИ КНИГ В КАТАЛОГЕ
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    // Находим все карточки книг
    const bookCards = document.querySelectorAll(".book-item");

    bookCards.forEach(bookItem => {

        const bookLink = bookItem.querySelector(
            'a[href*="book.html?id="]'
        );

        if (!bookLink) {
            return;
        }

        // Получаем ID книги из ссылки
        const url = new URL(bookLink.href);
        const bookId = url.searchParams.get("id");

        if (!bookId) {
            return;
        }

        // Получаем отзывы конкретной книги
        const storageKey = `bookspaceReviews_${bookId}`;

        let reviews = [];

        try {
            const savedReviews = JSON.parse(
                localStorage.getItem(storageKey) || "[]"
            );

            if (Array.isArray(savedReviews)) {
                reviews = savedReviews.filter(review =>
                    Number.isInteger(review.rating) &&
                    review.rating >= 1 &&
                    review.rating <= 5
                );
            }
        } catch (error) {
            console.error("Ошибка загрузки рейтинга:", error);
        }

        // Ищем тело карточки
        const cardBody = bookItem.querySelector(".card-body");

        if (!cardBody) {
            return;
        }

        // Используем существующий блок или создаём новый
        let ratingBlock = cardBody.querySelector(".catalog-rating");

        if (!ratingBlock) {
            ratingBlock = document.createElement("div");
            ratingBlock.className = "catalog-rating";

            // Вставляем перед кнопкой "Подробнее"
            cardBody.insertBefore(ratingBlock, bookLink);
        }

        ratingBlock.replaceChildren();

        if (reviews.length === 0) {
            ratingBlock.textContent = "☆ Нет оценок";
            ratingBlock.classList.add("catalog-rating-empty");
            return;
        }

        ratingBlock.classList.remove("catalog-rating-empty");

        // Рассчитываем среднюю оценку
        const total = reviews.reduce(
            (sum, review) => sum + review.rating,
            0
        );

        const average = total / reviews.length;
        const rounded = Math.round(average);

        // Звёзды
        const stars = document.createElement("span");
        stars.className = "catalog-rating-stars";

        stars.textContent =
            "★".repeat(rounded) +
            "☆".repeat(5 - rounded);

        // Числовая оценка
        const value = document.createElement("span");
        value.className = "catalog-rating-value";
        value.textContent = average.toFixed(1);

        // Количество отзывов
        const count = document.createElement("span");
        count.className = "catalog-rating-count";
        count.textContent = `(${reviews.length})`;

        ratingBlock.append(stars, value, count);
    });
});
