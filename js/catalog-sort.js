
/* ========================================
   СОРТИРОВКА КНИГ В КАТАЛОГЕ
======================================== */

document.addEventListener("DOMContentLoaded", () => {

    const sortSelect = document.getElementById("sortBooks");
    const booksContainer = document.getElementById("booksContainer");

    if (!sortSelect || !booksContainer) {
        return;
    }

    // Сохраняем исходный порядок книг
    const originalBooks = Array.from(
        booksContainer.querySelectorAll(".book-item")
    );

    const collator = new Intl.Collator("ru", {
        sensitivity: "base",
        numeric: true
    });

    // Получаем рейтинг книги
    function getBookRating(bookItem) {

        const link = bookItem.querySelector(
            'a[href*="book.html?id="]'
        );

        if (!link) {
            return null;
        }

        const url = new URL(link.href);
        const bookId = url.searchParams.get("id");

        if (!bookId) {
            return null;
        }

        try {
            const reviews = JSON.parse(
                localStorage.getItem(
                    `bookspaceReviews_${bookId}`
                ) || "[]"
            );

            if (!Array.isArray(reviews)) {
                return null;
            }

            const validReviews = reviews.filter(review =>
                Number.isInteger(review.rating) &&
                review.rating >= 1 &&
                review.rating <= 5
            );

            if (validReviews.length === 0) {
                return null;
            }

            const total = validReviews.reduce(
                (sum, review) => sum + review.rating,
                0
            );

            return total / validReviews.length;

        } catch (error) {
            console.error("Ошибка получения рейтинга:", error);
            return null;
        }
    }

    // Сортировка карточек
    function sortBooks() {

        const sortType = sortSelect.value;

        const books = [...originalBooks];

        books.sort((a, b) => {

            if (sortType === "default") {
                return originalBooks.indexOf(a) -
                       originalBooks.indexOf(b);
            }

            if (sortType === "title-asc") {
                return collator.compare(
                    a.dataset.title || "",
                    b.dataset.title || ""
                );
            }

            if (sortType === "title-desc") {
                return collator.compare(
                    b.dataset.title || "",
                    a.dataset.title || ""
                );
            }

            if (
                sortType === "rating-desc" ||
                sortType === "rating-asc"
            ) {

                const ratingA = getBookRating(a);
                const ratingB = getBookRating(b);

                // Книги без оценок всегда в конце
                if (ratingA === null && ratingB === null) {
                    return originalBooks.indexOf(a) -
                           originalBooks.indexOf(b);
                }

                if (ratingA === null) return 1;
                if (ratingB === null) return -1;

                const difference = sortType === "rating-desc"
                    ? ratingB - ratingA
                    : ratingA - ratingB;

                return difference ||
                    originalBooks.indexOf(a) -
                    originalBooks.indexOf(b);
            }

            return 0;
        });

        // Переставляем карточки в контейнере
        books.forEach(book => {
            booksContainer.appendChild(book);
        });
    }

    sortSelect.addEventListener("change", sortBooks);

    // Применяем выбранную сортировку при загрузке
    sortBooks();

});
