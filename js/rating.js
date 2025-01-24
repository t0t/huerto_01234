import { RATING_CONFIG } from './config.js';

class RatingSystem {
    constructor() {
        this.gridContainers = document.querySelectorAll('.grid-container');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.hideDeletedCards();
            this.initializeRatings();
            this.setupStarListeners();
            this.setupControlButtons();
        });
    }

    hideDeletedCards() {
        this.gridContainers.forEach(container => {
            const gridItems = container.querySelectorAll('.grid-item');
            gridItems.forEach(item => {
                const link = item.querySelector('a');
                if (!link) return;
                
                if (this.isCardDeleted(link.href)) {
                    item.remove();
                }
            });
        });
    }

    isCardDeleted(url) {
        return localStorage.getItem(`${RATING_CONFIG.DELETED_PREFIX}${url}`) === 'true';
    }

    initializeRatings() {
        this.gridContainers.forEach(container => {
            const gridItems = container.querySelectorAll('.grid-item');
            gridItems.forEach(item => this.initializeSingleItem(item));
        });
    }

    initializeSingleItem(item) {
        const link = item.querySelector('a');
        if (!link) return;

        const url = link.href;
        const ratingContainer = document.createElement('div');
        ratingContainer.className = 'rating-container';

        const rating = this.createRatingElement(url);
        const deleteButton = this.createDeleteButton();

        ratingContainer.appendChild(rating);
        ratingContainer.appendChild(deleteButton);
        item.appendChild(ratingContainer);
        item.dataset.rating = this.getRatingFromStorage(url);
    }

    createRatingElement(url) {
        const rating = document.createElement('div');
        rating.className = 'rating';

        const savedRating = this.getRatingFromStorage(url);
        const stars = Array.from({ length: RATING_CONFIG.MAX_STARS }, (_, i) => 
            this.createStar(i + 1, url, savedRating)
        );

        rating.append(...stars);
        return rating;
    }

    createDeleteButton() {
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-card';
        deleteButton.innerHTML = '✕';
        deleteButton.title = 'Eliminar card';
        deleteButton.addEventListener('click', (e) => this.handleDeleteClick(e));
        return deleteButton;
    }

    handleDeleteClick(e) {
        e.stopPropagation();
        const gridItem = e.target.closest('.grid-item');
        if (!gridItem) return;

        const link = gridItem.querySelector('a');
        if (!link) return;

        // Marcar como eliminada en localStorage
        localStorage.setItem(`${RATING_CONFIG.DELETED_PREFIX}${link.href}`, 'true');
        
        // Eliminar el rating del localStorage
        localStorage.removeItem(`${RATING_CONFIG.STORAGE_PREFIX}${link.href}`);

        // Animación de fade out y eliminar
        gridItem.style.transition = 'all 0.3s ease';
        gridItem.style.opacity = '0';
        gridItem.style.transform = 'scale(0.9)';

        setTimeout(() => {
            gridItem.remove();
        }, 300);
    }

    createStar(value, url, savedRating) {
        const star = document.createElement('span');
        star.className = 'star';
        star.textContent = RATING_CONFIG.STAR_SYMBOL;
        star.dataset.value = value;
        star.dataset.url = url;

        if (savedRating && value <= parseInt(savedRating)) {
            star.classList.add('active');
        }

        return star;
    }

    setupStarListeners() {
        document.querySelectorAll('.star').forEach(star => {
            star.addEventListener('click', e => this.handleStarClick(e));
            star.addEventListener('mouseover', e => this.handleStarHover(e));
            star.addEventListener('mouseout', e => this.handleStarOut(e));
        });
    }

    setupControlButtons() {
        const sortButton = document.getElementById('sort-by-rating');
        const resetButton = document.getElementById('reset-ratings');

        if (sortButton) {
            sortButton.addEventListener('click', () => this.sortByRating());
        }
        if (resetButton) {
            resetButton.addEventListener('click', () => this.resetRatings());
        }
    }

    handleStarClick(e) {
        e.stopPropagation();
        const { value, url } = e.target.dataset;
        const clickedValue = parseInt(value);
        const gridItem = e.target.closest('.grid-item');
        const currentRating = parseInt(this.getRatingFromStorage(url)) || 0;

        // Si hacemos clic en la única estrella activa, desactivamos todo
        const newRating = (currentRating === clickedValue) ? 0 : clickedValue;

        this.saveRating(url, newRating);
        this.updateStarDisplay(e.target.parentElement, newRating);
        gridItem.dataset.rating = newRating.toString();
    }

    handleStarHover(e) {
        const hoverValue = parseInt(e.target.dataset.value);
        const stars = e.target.parentElement.querySelectorAll('.star');

        stars.forEach(star => {
            const starValue = parseInt(star.dataset.value);
            if (starValue <= hoverValue) {
                star.style.color = RATING_CONFIG.HOVER_COLOR;
            }
        });
    }

    handleStarOut(e) {
        const { url } = e.target.dataset;
        const stars = e.target.parentElement.querySelectorAll('.star');
        const savedRating = this.getRatingFromStorage(url);

        stars.forEach(star => {
            star.style.color = '';
            const starValue = parseInt(star.dataset.value);
            star.classList.toggle('active', savedRating && starValue <= parseInt(savedRating));
        });
    }

    sortByRating() {
        this.gridContainers.forEach(container => {
            const items = Array.from(container.querySelectorAll('.grid-item'));
            const sortedItems = this.sortItems(items);
            
            // Usar DocumentFragment para mejor rendimiento
            const fragment = document.createDocumentFragment();
            sortedItems.forEach(item => fragment.appendChild(item));
            container.innerHTML = '';
            container.appendChild(fragment);
        });
    }

    sortItems(items) {
        return [...items].sort((a, b) => {
            const ratingA = parseInt(a.dataset.rating) || 0;
            const ratingB = parseInt(b.dataset.rating) || 0;
            return ratingB - ratingA;
        });
    }

    resetRatings() {
        this.clearStoredRatings();
        this.resetStarDisplay();
        this.resetDatasetRatings();
    }

    // Storage utilities
    getRatingFromStorage(url) {
        return localStorage.getItem(`${RATING_CONFIG.STORAGE_PREFIX}${url}`);
    }

    saveRating(url, rating) {
        localStorage.setItem(`${RATING_CONFIG.STORAGE_PREFIX}${url}`, rating);
    }

    clearStoredRatings() {
        Object.keys(localStorage)
            .filter(key => key.startsWith(RATING_CONFIG.STORAGE_PREFIX))
            .forEach(key => localStorage.removeItem(key));
    }

    resetStarDisplay() {
        document.querySelectorAll('.star').forEach(star => {
            star.classList.remove('active');
            star.style.color = '';
        });
    }

    resetDatasetRatings() {
        document.querySelectorAll('.grid-item').forEach(item => {
            item.dataset.rating = '0';
        });
    }

    updateStarDisplay(starContainer, clickedValue) {
        const stars = starContainer.querySelectorAll('.star');
        stars.forEach(star => {
            const starValue = parseInt(star.dataset.value);
            star.classList.toggle('active', starValue <= clickedValue);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const ratings = document.querySelectorAll('.rating');
    
    ratings.forEach(rating => {
        // Cargar rating guardado
        const savedRating = localStorage.getItem(`rating-${rating.closest('a').href}`);
        if (savedRating) {
            rating.dataset.rating = savedRating;
            updateStars(rating, parseInt(savedRating));
        }

        // Manejar click en estrellas
        rating.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (e.target.tagName === 'I') {
                const stars = rating.querySelectorAll('i');
                const value = Array.from(stars).indexOf(e.target) + 1;
                
                rating.dataset.rating = value;
                updateStars(rating, value);
                
                // Guardar en localStorage
                localStorage.setItem(`rating-${rating.closest('a').href}`, value);
            }
        });
    });
});

function updateStars(rating, value) {
    const stars = rating.querySelectorAll('i');
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < value);
    });
}

// Initialize the rating system
new RatingSystem();
