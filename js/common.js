
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
