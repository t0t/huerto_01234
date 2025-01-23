class ScrollManager {
    constructor() {
        this.scrollToTopButton = document.querySelector('.scroll-to-top');
        this.scrollThreshold = 300;
        this.initializeScrollLinks();
        this.initializeScrollToTop();
    }

    initializeScrollLinks() {
        document.addEventListener('DOMContentLoaded', () => {
            const scrollLinks = document.querySelectorAll('a[href^="#"]');
            scrollLinks.forEach(link => {
                link.addEventListener('click', (e) => this.handleScrollClick(e));
            });
        });
    }

    initializeScrollToTop() {
        if (!this.scrollToTopButton) return;

        // Mostrar/ocultar botón según la posición del scroll
        window.addEventListener('scroll', () => this.toggleScrollButton());

        // Scroll suave al top al hacer click
        this.scrollToTopButton.addEventListener('click', () => this.scrollToTop());
    }

    handleScrollClick(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        if (!targetId || targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        this.scrollToElement(targetElement);
    }

    scrollToElement(element) {
        const offset = 60;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    toggleScrollButton() {
        if (!this.scrollToTopButton) return;
        
        if (window.scrollY > this.scrollThreshold) {
            this.scrollToTopButton.classList.add('visible');
        } else {
            this.scrollToTopButton.classList.remove('visible');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Initialize scroll manager
new ScrollManager();
