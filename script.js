// Player ORIGINAL - Solo optimizado
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

    // Radio Player Functionality - ORIGINAL
    let isRadioPlaying = false;
    const radioStream = document.getElementById('radio-stream');
    const volumeControl = document.getElementById('radio-volume');
    const playBtn = document.getElementById('radio-play-btn');
    const radioStatus = document.getElementById('radio-status');
    const radioInfo = document.getElementById('radio-info');

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
    });

    function startRadio() {
        radioStatus.textContent = 'Conectando...';
        radioInfo.textContent = 'Cargando streaming';

        radioStream.src = 'https://stream.zeno.fm/dlvtl3hthyxvv';
        radioStream.load();

        const onCanPlay = () => {
            isRadioPlaying = true;
            document.getElementById('radio-play-icon').classList.add('hidden');
            document.getElementById('radio-pause-icon').classList.remove('hidden');
            radioStatus.textContent = 'Online';
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

    // Smooth scrolling for navigation links - OPTIMIZADO
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

    // Modal functionality - OPTIMIZADO
    window.openModal = function (element, title, description, imageUrl) {
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        const modalImage = document.getElementById('modalImage');

        if (!modal || !modalTitle || !modalDescription || !modalImage) {
            console.error('Faltan elementos del modal');
            return;
        }

        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalImage.src = imageUrl;
        modalImage.alt = title;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = function () {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.classList.add('hidden');
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

    // Cerrar modal con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});


<!-- INTEGRACIÓN DINÁMICA CON GOOGLE SHEETS -->


(function() {
    'use strict';
    
    const SHEET_ID = '1Z-Td-TDZ_cY5aORNo3kB7ah4XVTxg4WPRnklB2nBuAY';
    const URL_SLIDER = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=SLIDER`;
    const URL_DJS = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=DJS`;
    const URL_GALERIA = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=GALERIA`;
    
    // Cache para datos
    const cache = {
        slider: null,
        djs: null,
        galeria: null
    };
    
    // Función fetch con timeout
    function fetchWithTimeout(url, timeout = 8000) {
        return Promise.race([
            fetch(url),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), timeout)
            )
        ]);
    }
    
    // Procesar respuesta de Google Sheets
    function processSheetResponse(text) {
        try {
            const json = JSON.parse(text.match(/(?<=\().*(?=\);)/s)[0]);
            return json.table.rows;
        } catch (error) {
            console.error('Error procesando datos:', error);
            return [];
        }
    }
    
   /* -------- SLIDER OPTIMIZADO CON TRANSICIÓN SUAVE -------- */
let slides = [];
let currentSlide = 0;
let sliderInterval;

function initSlider() {
    if (cache.slider) {
        slides = cache.slider;
        renderSlides();
        renderDots();
        startAutoSlide();
        return;
    }
    
    fetchWithTimeout(URL_SLIDER)
        .then(res => res.text())
        .then(text => {
            const rows = processSheetResponse(text);
            slides = rows.map(row => ({
                img: row.c[1]?.v,
                alt: row.c[2]?.v || 'Imagen del slider',
                title: row.c[3]?.v || '',
                subtitle: row.c[4]?.v || ''
            })).filter(slide => slide.img);
            
            cache.slider = slides;
            renderSlides();
            renderDots();
            startAutoSlide();
        })
        .catch(error => {
            console.error('Error al cargar slider:', error);
            showSliderFallback();
        });
}

function renderSlides() {
    const slider = document.getElementById('slider');
    if (!slider || slides.length === 0) return;
    
    // Agrega la clase slider-container si no existe
    slider.parentElement.classList.add('slider-container');
    
    slider.innerHTML = slides.map((slide, i) => `
        <div class="slider-slide ${i === currentSlide ? 'active' : ''}">
            <img src="${slide.img}" alt="${slide.alt}" 
                 class="w-full h-64 sm:h-80 md:h-96 object-cover"
                 loading="lazy"
                 width="800" height="400"
                 onerror="this.src=''; this.alt='Imagen no disponible'; this.style.display='none'; this.nextElementSibling.style.display='block';">
            <div class="hidden absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <p class="text-white font-bold text-xl">${slide.title}</p>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div class="p-6 text-white">
                    <h3 class="text-2xl md:text-4xl font-bold neon-text">${slide.title}</h3>
                    <p class="text-lg">${slide.subtitle}</p>
                </div>
            </div>
        </div>
    `).join('');
    updateDots();
}

function nextSlide() {
    if (slides.length === 0) return;
    
    const currentIndex = currentSlide;
    currentSlide = (currentSlide + 1) % slides.length;
    
    // Transición suave
    const slidesElements = document.querySelectorAll('.slider-slide');
    if (slidesElements.length > 0) {
        slidesElements[currentIndex].classList.remove('active');
        slidesElements[currentSlide].classList.add('active');
    }
    
    updateDots();
}

function prevSlide() {
    if (slides.length === 0) return;
    
    const currentIndex = currentSlide;
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    
    // Transición suave
    const slidesElements = document.querySelectorAll('.slider-slide');
    if (slidesElements.length > 0) {
        slidesElements[currentIndex].classList.remove('active');
        slidesElements[currentSlide].classList.add('active');
    }
    
    updateDots();
}

function renderDots() {
    const dots = document.getElementById('slider-dots');
    if (!dots || slides.length === 0) return;
    
    dots.innerHTML = slides.map((_, i) => `
        <button class="slider-dot w-3 h-3 rounded-full ${i === currentSlide ? 'bg-cyan-400' : 'bg-gray-400'}" 
                data-slide="${i}" aria-label="Ir a diapositiva ${i+1}"></button>
    `).join('');
    
    dots.querySelectorAll('.slider-dot').forEach((el, idx) => {
        el.onclick = () => {
            // Transición suave al hacer clic en los dots
            const currentIndex = currentSlide;
            currentSlide = idx;
            
            const slidesElements = document.querySelectorAll('.slider-slide');
            if (slidesElements.length > 0) {
                slidesElements[currentIndex].classList.remove('active');
                slidesElements[currentSlide].classList.add('active');
            }
            
            updateDots();
            resetAutoSlide();
        };
    });
}

function updateDots() {
    const dots = document.querySelectorAll('#slider-dots .slider-dot');
    dots.forEach((dot, i) => {
        dot.classList.toggle('bg-cyan-400', i === currentSlide);
        dot.classList.toggle('bg-gray-400', i !== currentSlide);
    });
}

function startAutoSlide() {
    if (slides.length <= 1) return;
    clearInterval(sliderInterval);
    sliderInterval = setInterval(nextSlide, 5000);
}

function resetAutoSlide() {
    if (slides.length <= 1) return;
    clearInterval(sliderInterval);
    startAutoSlide();
}

function showSliderFallback() {
    const slider = document.getElementById('slider');
    if (slider) {
        slider.innerHTML = `
            <div class="slider-slide active">
                <div class="w-full h-64 sm:h-80 md:h-96 bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                    <p class="text-white text-xl font-bold">Radio Power - Tu emisora favorita</p>
                </div>
            </div>
        `;
    }
}
    
    /* -------- DJS OPTIMIZADO -------- */
    function loadDJs() {
        if (cache.djs) {
            renderDJs(cache.djs);
            return;
        }
        
        fetchWithTimeout(URL_DJS)
            .then(res => res.text())
            .then(text => {
                const rows = processSheetResponse(text);
                const djs = rows.map(row => ({
                    img: row.c[2]?.v,
                    alt: row.c[3]?.v || 'Foto del DJ',
                    nombre: row.c[1]?.v || 'DJ',
                    especialidad: row.c[4]?.v || '',
                    horario: row.c[5]?.v || '',
                    youtube: row.c[6]?.v || '#'
                })).filter(dj => dj.img && dj.nombre);
                
                cache.djs = djs;
                renderDJs(djs);
            })
            .catch(error => {
                console.error('Error al cargar DJs:', error);
                showDJsFallback();
            });
    }
    
    function renderDJs(djs) {
        const container = document.getElementById('djs-container');
        if (!container) return;
        
        container.innerHTML = djs.map(dj => `
            <div class="track-card rounded-lg p-6 backdrop-blur-sm">
                <div class="mb-4">
                    <img src="${dj.img}" alt="${dj.alt}" 
                         class="w-full h-48 rounded-lg object-cover"
                         loading="lazy"
                         width="300" height="192"
                         onerror="this.src=''; this.alt='Imagen no disponible'; this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div class="w-full h-48 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold" style="display: none;">
                        ${dj.nombre}
                    </div>
                </div>
                <h3 class="text-xl font-bold mb-2 text-cyan-400">${dj.nombre}</h3>
                <p class="text-gray-300 mb-4">${dj.especialidad}</p>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-400">${dj.horario}</span>
                    <a href="${dj.youtube}" target="_blank" rel="noopener"
                       style="background-color: #080899; color: white;"
                       class="hover:bg-[#1A1AB8] text-white px-4 py-2 rounded-full transition-all flex items-center">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/0/0a/YouTube_social_red_circle_%282024%29.svg"
                             alt="YouTube Logo" class="w-5 h-5 mr-2" loading="lazy" width="20" height="20">
                        YouTube
                    </a>
                </div>
            </div>
        `).join('');
    }
    
    function showDJsFallback() {
        const container = document.getElementById('djs-container');
        if (container) {
            container.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <p class="text-gray-400">No se pudieron cargar los datos de los DJs en este momento.</p>
                </div>
            `;
        }
    }
    
    /* -------- GALERIA OPTIMIZADA -------- */
    function loadGallery() {
        if (cache.galeria) {
            renderGallery(cache.galeria);
            return;
        }
        
        fetchWithTimeout(URL_GALERIA)
            .then(res => res.text())
            .then(text => {
                const rows = processSheetResponse(text);
                const items = rows.map(row => ({
                    img: row.c[1]?.v,
                    alt: row.c[2]?.v || 'Imagen de galería',
                    titulo: row.c[3]?.v || 'Evento',
                    descripcion: row.c[5]?.v || ''
                })).filter(item => item.img && item.titulo);
                
                cache.galeria = items;
                renderGallery(items);
            })
            .catch(error => {
                console.error('Error al cargar datos de galería:', error);
                showGalleryFallback();
            });
    }
    
    function renderGallery(items) {
        const container = document.getElementById('gallery-container');
        if (!container) return;
        
        container.innerHTML = items.map(item => `
            <div class="gallery-item aspect-square rounded-2xl overflow-hidden cursor-pointer relative group"
                 onclick="openModal(this, '${item.titulo.replace(/'/g, "\\'")}', '${item.descripcion.replace(/'/g, "\\'")}', '${item.img}')">
                <img src="${item.img}" alt="${item.alt}" 
                     class="w-full h-full object-cover transition-transform group-hover:scale-110"
                     loading="lazy"
                     width="250" height="250"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-center" style="display: none;">
                    <p class="text-white font-semibold p-4">${item.titulo}</p>
                </div>
                <div class="absolute inset-0 bg-black/40 opacity-100 group-hover:opacity-100 transition-opacity flex items-end">
                    <p class="text-white font-semibold p-4">${item.titulo}</p>
                </div>
            </div>
        `).join('');
    }
    
    function showGalleryFallback() {
        const container = document.getElementById('gallery-container');
        if (container) {
            container.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <p class="text-gray-400">No se pudieron cargar las imágenes de la galería en este momento.</p>
                </div>
            `;
        }
    }
    
    // Asignar eventos globales
    document.getElementById('nextBtn').onclick = () => {
        nextSlide();
        resetAutoSlide();
    };
    
    document.getElementById('prevBtn').onclick = () => {
        prevSlide();
        resetAutoSlide();
    };
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initSlider();
            loadDJs();
            loadGallery();
        });
    } else {
        initSlider();
        loadDJs();
        loadGallery();
    }
})();


<!-- Funciones del Modal -->

function openModal(elem, titulo, descripcion, url) {
    const modal = document.getElementById('modal');
    document.getElementById('modalImage').src = url;
    document.getElementById('modalTitle').innerText = titulo;
    document.getElementById('modalDescription').innerText = descripcion;
    modal.classList.remove('hidden');
    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    // Restaurar scroll del body
    document.body.style.overflow = '';
}

// Cerrar modal con ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Cerrar modal haciendo clic fuera
document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});


<!-- Scripts de funcionalidad -->

// Año actual en el footer
document.getElementById("year").textContent = new Date().getFullYear();

// Scroll suave para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Prevenir clic derecho en imágenes
document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG') e.preventDefault();
});
