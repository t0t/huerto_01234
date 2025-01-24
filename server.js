const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware para establecer headers de caché
app.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
    });
    next();
});

// Servir archivos estáticos
app.use(express.static(__dirname, {
    etag: false,
    lastModified: false,
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.set({
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'Surrogate-Control': 'no-store'
            });
        }
    }
}));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
