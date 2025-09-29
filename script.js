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

    // Slider functionality (manejado en index.html)

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
        console.log('Volumen ajustado a:', volume);
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

    // Modal functionality
    window.openModal = function (element, title, description) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        const modalImage = document.getElementById('modalImage');

        if (!modal || !modalTitle || !modalDescription || !modalImage || !element) {
            console.error('Faltan elementos del modal o del elemento clickeado');
            return;
        }

        const imageUrl = element.querySelector('img').src;
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalImage.src = imageUrl;
        modalImage.alt = title;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function () {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            document.body.style.overflow = '';
        }
    };

    const modal = document.getElementById('modal');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeModal();
            }
        });
    }
});
