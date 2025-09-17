// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Image slider functionality
let currentSlide = 0;
const slides = document.querySelectorAll('#slider > div');
const totalSlides = slides.length;
const slider = document.getElementById('slider');
const dots = document.querySelectorAll('.slider-dot');

function updateSlider() {
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    dots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.remove('bg-gray-400');
            dot.classList.add('bg-cyan-400');
        } else {
            dot.classList.remove('bg-cyan-400');
            dot.classList.add('bg-gray-400');
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
}

document.getElementById('nextBtn').addEventListener('click', nextSlide);
document.getElementById('prevBtn').addEventListener('click', prevSlide);

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlider();
    });
});

// Auto-slide every 5 seconds
setInterval(nextSlide, 5000);

// Radio Player Functionality
let isRadioPlaying = false;
const radioStream = document.getElementById('radio-stream');

function playRadio() {
    showRadioPlayer();
    if (!isRadioPlaying) {
        startRadio();
    }
}

function showRadioPlayer() {
    document.getElementById('floating-player').classList.remove('hidden');
}

function hideRadioPlayer() {
    document.getElementById('floating-player').classList.add('hidden');
    stopRadio();
}

function startRadio() {
    document.getElementById('radio-status').textContent = 'Conectando...';
    document.getElementById('radio-info').textContent = 'Cargando streaming';

    // Forzar reconexión al flujo en vivo
    radioStream.src = 'https://stream.zeno.fm/dlvtl3hthyxvv';
    radioStream.load();

    const onCanPlay = () => {
        isRadioPlaying = true;
        document.getElementById('radio-play-icon').classList.add('hidden');
        document.getElementById('radio-pause-icon').classList.remove('hidden');
        document.getElementById('radio-status').textContent = 'Reproduciendo en vivo';
        document.getElementById('radio-info').textContent = 'Radio Power - Música en vivo 24/7';
        radioStream.removeEventListener('canplay', onCanPlay);
    };

    radioStream.addEventListener('canplay', onCanPlay);

    radioStream.play().catch((error) => {
        console.log('Error al reproducir:', error);
        document.getElementById('radio-status').textContent = 'Error de conexión';
        document.getElementById('radio-info').textContent = 'Intenta de nuevo en unos momentos';
        radioStream.removeEventListener('canplay', onCanPlay);
    });
}

function stopRadio() {
    radioStream.pause();
    isRadioPlaying = false;
    document.getElementById('radio-play-icon').classList.remove('hidden');
    document.getElementById('radio-pause-icon').classList.add('hidden');
    document.getElementById('radio-status').textContent = 'Radio Power';
    document.getElementById('radio-info').textContent = 'Música en vivo 24/7';
}

function toggleRadio() {
    if (isRadioPlaying) {
        stopRadio();
    } else {
        startRadio();
    }
}

// Radio controls
document.getElementById('radio-play-btn').addEventListener('click', toggleRadio);
document.getElementById('close-player').addEventListener('click', hideRadioPlayer);

// Volume control
document.getElementById('radio-volume').addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    radioStream.volume = volume;
});

// Set initial volume
radioStream.volume = 0.7;

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            mobileMenu.classList.add('hidden');
        }
    });
});

// Indicador de buffering
radioStream.addEventListener('waiting', () => {
    document.getElementById('radio-status').textContent = 'Buffering...';
    document.getElementById('radio-info').textContent = 'Esperando datos del streaming';
});