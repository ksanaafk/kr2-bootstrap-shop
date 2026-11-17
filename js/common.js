
const backToTop = document.getElementById("backToTop");

// Показываем кнопку после прокрутки
function toggleBackToTop() {
    if (window.scrollY > 250) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
}

// Следим за прокруткой страницы
window.addEventListener("scroll", toggleBackToTop);

// Возвращаемся наверх
backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Проверяем положение при загрузке
toggleBackToTop();


// Учитываем высоту закреплённого меню
const navbar = document.querySelector(".navbar");

function updateNavbarHeight() {
    if (navbar) {
        document.documentElement.style.setProperty(
            "--navbar-height",
            navbar.offsetHeight + "px"
        );
    }
}

window.addEventListener("resize", updateNavbarHeight);
updateNavbarHeight();



/* Переключение светлой и тёмной темы */

const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle?.querySelector("i");

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    if (themeIcon) {
        themeIcon.className = theme === "dark"
            ? "bi bi-sun"
            : "bi bi-moon-stars";
    }

    if (themeToggle) {
        themeToggle.setAttribute(
            "aria-label",
            theme === "dark"
                ? "Включить светлую тему"
                : "Включить тёмную тему"
        );
    }
}

// Восстанавливаем сохранённую тему
const savedTheme = localStorage.getItem("bookspaceTheme");

applyTheme(savedTheme === "dark" ? "dark" : "light");

// Обрабатываем нажатие на кнопку
themeToggle?.addEventListener("click", () => {
    const currentTheme =
        document.documentElement.getAttribute("data-theme");

    const newTheme = currentTheme === "dark"
        ? "light"
        : "dark";

    applyTheme(newTheme);
    localStorage.setItem("bookspaceTheme", newTheme);
});
