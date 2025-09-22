document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    } else {
        console.error('Elementos de menú móvil no encontrados');
    }

    // Image slider functionality
    let currentSlide = 0;
    const slides = document.querySelectorAll('#slider > div');
    const totalSlides = slides.length;
    const slider = document.getElementById('slider');
    const dots = document.querySelectorAll('.slider-dot');

    function updateSlider() {
        if (slider) {
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
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    }

    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    } else {
        console.error('Botones de slider no encontrados');
    }

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
    const volumeControl = document.getElementById('radio-volume');
    const playBtn = document.getElementById('radio-play-btn');
    const radioStatus = document.getElementById('radio-status');
    const radioInfo = document.getElementById('radio-info');
    const closePlayer = document.getElementById('close-player');

    if (!radioStream || !volumeControl || !playBtn || !radioStatus || !radioInfo) {
        console.error('Faltan elementos del reproductor en el DOM');
        return;
    }

    // Set initial volume
    radioStream.volume = volumeControl.value / 100;

    // Volume control
    volumeControl.addEventListener('input', (e) => {
        const volume = e.target.value / 100;
        radioStream.volume = volume;
        console.log('Volumen ajustado a:', volume); // Para depuración
    });

    function showRadioPlayer() {
        document.getElementById('floating-player').classList.remove('hidden');
    }

    function hideRadioPlayer() {
        document.getElementById('floating-player').classList.add('hidden');
        stopRadio();
    }

    function startRadio() {
        radioStatus.textContent = 'Conectando...';
        radioInfo.textContent = 'Cargando streaming';

        radioStream.src = 'https://stream.zeno.fm/dlvtl3hthyxvv';
        radioStream.load();

        const onCanPlay = () => {
            isRadioPlaying = true;
            document.getElementById('radio-play-icon').classList.add('hidden');
            document.getElementById('radio-pause-icon').classList.remove('hidden');
            radioStatus.textContent = 'Reproduciendo en vivo';
            radioInfo.textContent = 'Radio Power - Música en vivo 24/7';
            radioStream.removeEventListener('canplay', onCanPlay);
        };

        radioStream.addEventListener('canplay', onCanPlay);

        radioStream.play().catch((error) => {
            console.error('Error al reproducir:', error);
            radioStatus.textContent = 'Error de conexión';
            radioInfo.textContent = 'Intenta de nuevo en unos momentos';
            radioStream.removeEventListener('canplay', onCanPlay);
        });
    }

    function stopRadio() {
        radioStream.pause();
        isRadioPlaying = false;
        document.getElementById('radio-play-icon').classList.remove('hidden');
        document.getElementById('radio-pause-icon').classList.add('hidden');
        radioStatus.textContent = 'Radio Power';
        radioInfo.textContent = 'Música en vivo 24/7';
    }

    function toggleRadio() {
        if (isRadioPlaying) {
            stopRadio();
        } else {
            startRadio();
        }
    }

    // Radio controls
    playBtn.addEventListener('click', toggleRadio);
    if (closePlayer) {
        closePlayer.addEventListener('click', hideRadioPlayer);
    } else {
        console.error('Botón de cerrar reproductor no encontrado');
    }

    // Indicador de buffering
    radioStream.addEventListener('waiting', () => {
        radioStatus.textContent = 'Buffering...';
        radioInfo.textContent = 'Esperando datos del streaming';
    });

    // Manejo de errores del stream
    radioStream.addEventListener('error', (e) => {
        console.error('Error en el stream de audio:', e);
        radioStatus.textContent = 'Error en el stream';
        radioInfo.textContent = 'No se pudo cargar el audio';
    });

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
                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // Gallery Section
    window.openModal = function (title, description, imageSrc = null) {
        const modal = document.getElementById('modal');
        const modalContent = modal.querySelector('.bg-gray-800');

        if (modal && modalContent) {
            if (imageSrc) {
                modalContent.innerHTML = `
                    <div class="text-center">
                        <img src="${imageSrc}" alt="${title}" class="w-full max-w-lg mx-auto rounded-2xl" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <div class="text-6xl mb-4" style="display: none;">📸</div>
                        <h3 class="text-2xl font-bold mt-4 mb-4">${title}</h3>
                        <p class="text-gray-400 mb-6">${description}</p>
                        <button onclick="closeModal()" class="bg-pink-500 hover:bg-pink-600 px-6 py-2 rounded-full transition-all">
                            Cerrar
                        </button>
                    </div>
                `;
            } else {
                modalContent.innerHTML = `
                    <div class="text-center">
                        <div class="text-6xl mb-4">📸</div>
                        <h3 class="text-2xl font-bold mb-4">${title}</h3>
                        <p class="text-gray-400 mb-6">${description}</p>
                        <button onclick="closeModal()" class="bg-pink-500 hover:bg-pink-600 px-6 py-2 rounded-full transition-all">
                            Cerrar
                        </button>
                    </div>
                `;
            }
            modal.classList.remove('hidden');
        }
    };

    window.closeModal = function () {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    };

    // Cerrar modal al hacer clic fuera
    const modal = document.getElementById('modal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
});
