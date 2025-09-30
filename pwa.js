// pwa.js - Versión Mini
console.log('PWA cargando...');

class PWAInstallManager {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }

    init() {
        this.bindEvents();
        setTimeout(() => this.showPopup(), 8000);
    }

    bindEvents() {
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
        if (popup) popup.classList.remove('hidden');
    }

    hidePopup() {
        const popup = document.getElementById('pwa-install-popup');
        if (popup) popup.classList.add('hidden');
    }

    async installPWA() {
        if (!this.deferredPrompt) return;
        
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        this.deferredPrompt = null;
        if (outcome === 'accepted') this.hidePopup();
    }
}

// Inicializar
new PWAInstallManager();