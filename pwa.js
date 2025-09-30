// pwa.js - Compatible con Chrome y Firefox
console.log('PWA cargando...');

class PWAInstallManager {
    constructor() {
        this.deferredPrompt = null;
        this.isFirefox = navigator.userAgent.includes('Firefox');
        this.init();
    }

    init() {
        this.bindEvents();
        
        // En Firefox, mostrar banner siempre después de 10 segundos
        if (this.isFirefox) {
            setTimeout(() => this.showPopup(), 10000);
        } else {
            // En otros navegadores, esperar el evento beforeinstallprompt
            setTimeout(() => {
                if (!this.deferredPrompt) this.showPopup();
            }, 10000);
        }
    }

    bindEvents() {
        // Evento para Chrome, Edge, etc.
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showPopup();
        });

        document.addEventListener('click', (e) => {
            if (e.target.id === 'pwa-install-btn') this.installPWA();
            if (e.target.id === 'pwa-later-btn') this.hidePopup();
        });
    }

    showPopup() {
        const popup = document.getElementById('pwa-install-popup');
        if (popup) {
            // En Firefox, cambiar el mensaje
            if (this.isFirefox) {
                this.updateFirefoxMessage();
            }
            popup.classList.remove('hidden');
        }
    }

    updateFirefoxMessage() {
        const installBtn = document.getElementById('pwa-install-btn');
        const title = document.querySelector('#pwa-install-popup .text-white');
        
        if (installBtn && title) {
            title.textContent = "Radio Power PWA";
            installBtn.textContent = "Cómo instalar";
        }
    }

    hidePopup() {
        const popup = document.getElementById('pwa-install-popup');
        if (popup) popup.classList.add('hidden');
    }

    async installPWA() {
        // En Firefox, mostrar instrucciones
        if (this.isFirefox) {
            this.showFirefoxInstructions();
            this.hidePopup();
            return;
        }

        // En otros navegadores, instalación normal
        if (!this.deferredPrompt) {
            alert('Tu navegador no soporta instalación directa. Usa el menú de tu navegador.');
            return;
        }

        try {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            this.deferredPrompt = null;
            if (outcome === 'accepted') this.hidePopup();
        } catch (error) {
            console.error('Error instalación:', error);
        }
    }

    showFirefoxInstructions() {
        const message = `📱 Para instalar Radio Power en Firefox:

1. Haz clic en el menú "⋯" (esquina superior derecha)
2. Selecciona "Instalar Radio Power"
3. O busca "Instalar" en el menú

¡Listo! La app se agregará a tu pantalla de inicio.`;

        alert(message);
    }
}

// Inicializar
new PWAInstallManager();