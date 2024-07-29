// JavaScript para el banner deslizante
let currentIndex = 0;

const slides = document.querySelector('.slides');
const totalSlides = document.querySelectorAll('.slide img').length / 3; // Hay 3 imágenes en cada slide
const intervalTime = 3000; // Tiempo en milisegundos

document.getElementById('next').addEventListener('click', () => {
    nextSlide();
});

document.getElementById('prev').addEventListener('click', () => {
    prevSlide();
});

function updateSlidePosition() {
    const slideWidth = document.querySelector('.slide').clientWidth;
    slides.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlidePosition();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlidePosition();
}

// Cambiar automáticamente al siguiente slide
setInterval(() => {
    nextSlide();
}, intervalTime);

// Actualizar la posición del slide al cargar la página
window.addEventListener('load', () => {
    updateSlidePosition();
});
