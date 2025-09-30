// PWA Installation Manager
class PWAInstallManager {
    constructor() {
        this.deferredPrompt = null;
        this.installPopup = document.getElementById('pwa-install-popup');
        this.installBtn = document.getElementById('pwa-install-btn');
        this.laterBtn = document.getElementById('pwa-later-btn');
        this.floatingBtn = document.getElementById('pwa-floating-btn');
        
        this.init();
    }

    init() {
        if (this.isInstalled()) {
            console.log('PWA ya está instalado');
            return;
        }

        this.bindEvents();
        this.showPromptWithDelay();
    }

    bindEvents() {
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('beforeinstallprompt event fired');
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        window.addEventListener('appinstalled', () => {
            console.log('PWA instalado exitosamente');
            this.hideAllPrompts();
            this.setInstalledFlag();
        });

        if (this.installBtn) {
            this.installBtn.addEventListener('click', () => this.installPWA());
        }

        if (this.laterBtn) {
            this.laterBtn.addEventListener('click', () => {
                this.hidePopup();
                this.showFloatingButton();
                this.setPostponedFlag();
            });
        }

        if (this.floatingBtn) {
            this.floatingBtn.addEventListener('click', () => this.showPopup());
        }

        if (this.installPopup) {
            this.installPopup.addEventListener('click', (e) => {
                if (e.target === this.installPopup) {
                    this.hidePopup();
                    this.showFloatingButton();
                    this.setPostponedFlag();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.installPopup && !this.installPopup.classList.contains('hidden')) {
                this.hidePopup();
                this.showFloatingButton();
                this.setPostponedFlag();
            }
        });
    }

    showPromptWithDelay() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.delayedShow());
        } else {
            this.delayedShow();
        }
    }

    delayedShow() {
        if (!this.isPostponed() && this.deferredPrompt) {
            setTimeout(() => this.showPopup(), 8000);
        } else if (this.isPostponed() && this.deferredPrompt) {
            setTimeout(() => this.showFloatingButton(), 3000);
        }
    }

    showPopup() {
        if (this.installPopup && this.deferredPrompt && !this.isInstalled()) {
            this.installPopup.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    hidePopup() {
        if (this.installPopup) {
            this.installPopup.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    showFloatingButton() {
        if (this.floatingBtn && this.deferredPrompt && !this.isInstalled()) {
            this.floatingBtn.classList.remove('hidden');
        }
    }

    hideFloatingButton() {
        if (this.floatingBtn) this.floatingBtn.classList.add('hidden');
    }

    hideAllPrompts() {
        this.hidePopup();
        this.hideFloatingButton();
    }

    async installPWA() {
        if (!this.deferredPrompt) return;

        try {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            this.deferredPrompt = null;
            
            if (outcome === 'accepted') {
                console.log('Usuario aceptó la instalación');
            } else {
                this.showFloatingButton();
            }
        } catch (error) {
            console.error('Error durante la instalación:', error);
        }
    }

    isInstalled() {
        return localStorage.getItem('pwa_installed') === 'true' || 
               window.matchMedia('(display-mode: standalone)').matches;
    }

    setInstalledFlag() {
        localStorage.setItem('pwa_installed', 'true');
        localStorage.removeItem('pwa_postponed');
    }

    isPostponed() {
        return localStorage.getItem('pwa_postponed') === 'true';
    }

    setPostponedFlag() {
        localStorage.setItem('pwa_postponed', 'true');
        setTimeout(() => localStorage.removeItem('pwa_postponed'), 7 * 24 * 60 * 60 * 1000);
    }
}

// Inicializar
let pwaManager;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        pwaManager = new PWAInstallManager();
    });
} else {
    pwaManager = new PWAInstallManager();
}