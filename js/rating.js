// Rating System
document.addEventListener('DOMContentLoaded', () => {
    const gridContainers = document.querySelectorAll('.grid-container');
    const ratings = document.querySelectorAll('.rating');
    
    // Initialize event listeners
    gridContainers.forEach(container => {
        const gridItems = container.querySelectorAll('.grid-item');
        gridItems.forEach(item => {
            const link = item.querySelector('a');
            if (!link) return;
            
            // Hide deleted cards
            if (isCardDeleted(link.href)) {
                item.remove();
            }
        });
    });

    ratings.forEach(rating => {
        // Cargar rating guardado
        const savedRating = getRatingFromStorage(rating.closest('a').href);
        if (savedRating) {
            rating.dataset.rating = savedRating;
            updateStars(rating, parseInt(savedRating));
        }

        // Prevenir la navegación cuando se hace click en las estrellas
        const stars = rating.querySelectorAll('i');
        stars.forEach(star => {
            star.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const value = Array.from(stars).indexOf(e.target) + 1;
                rating.dataset.rating = value;
                updateStars(rating, value);
                
                // Guardar en localStorage
                saveRating(rating.closest('a').href, value);
                
                return false;
            }, true);
            
            // Prevenir el click por defecto
            star.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }, true);
        });
    });

    // Botones de control
    const sortButton = document.getElementById('sort-by-rating');
    if (sortButton) {
        sortButton.addEventListener('click', () => {
            const containers = document.querySelectorAll('.grid-container');
            containers.forEach(container => {
                const items = Array.from(container.children);
                items.sort((a, b) => {
                    const ratingA = a.querySelector('.rating').dataset.rating || 0;
                    const ratingB = b.querySelector('.rating').dataset.rating || 0;
                    return ratingB - ratingA;
                });
                items.forEach(item => container.appendChild(item));
            });
        });
    }

    const resetButton = document.getElementById('reset-ratings');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            clearStoredRatings();
            ratings.forEach(rating => {
                rating.dataset.rating = "0";
                updateStars(rating, 0);
            });
        });
    }

    // Delete buttons
    const deleteButtons = document.querySelectorAll('.delete-card');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const gridItem = e.target.closest('.grid-item');
            if (!gridItem) return;

            const link = gridItem.querySelector('a');
            if (!link) return;

            // Marcar como eliminada en localStorage
            localStorage.setItem(`deleted-${link.href}`, 'true');
            
            // Eliminar el rating del localStorage
            localStorage.removeItem(`rating-${link.href}`);

            // Animación de fade out y eliminar
            gridItem.style.transition = 'all 0.3s ease';
            gridItem.style.opacity = '0';
            gridItem.style.transform = 'scale(0.9)';

            setTimeout(() => {
                gridItem.remove();
            }, 300);
        });
    });
});

function updateStars(rating, value) {
    const stars = rating.querySelectorAll('i');
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < value);
    });
}

function isCardDeleted(url) {
    return localStorage.getItem(`deleted-${url}`) === 'true';
}

function getRatingFromStorage(url) {
    return localStorage.getItem(`rating-${url}`);
}

function saveRating(url, rating) {
    localStorage.setItem(`rating-${url}`, rating);
}

function clearStoredRatings() {
    Object.keys(localStorage)
        .filter(key => key.startsWith('rating-'))
        .forEach(key => localStorage.removeItem(key));
}
