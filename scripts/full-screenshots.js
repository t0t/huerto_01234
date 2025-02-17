const playwright = require('playwright');
const path = require('path');
const fs = require('fs').promises;

const SCREENSHOTS_DIR = path.join(process.cwd(), 'screenshots');
const FULL_SCREENSHOTS_DIR = path.join(SCREENSHOTS_DIR, 'full');

async function ensureDirectoryExists(dir) {
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
}

function getBaseName(url) {
    const urlObj = new URL(url);
    let baseName = '';
    
    // Casos especiales primero
    if (urlObj.hostname === 'github.io') {
        const pathParts = urlObj.pathname.split('/').filter(p => p);
        if (pathParts.length >= 2) {
            baseName = pathParts[1];
        }
    } else if (urlObj.hostname.endsWith('.vercel.app')) {
        baseName = urlObj.hostname.split('.')[0];
    } else if (urlObj.hostname.endsWith('.netlify.app')) {
        baseName = urlObj.hostname.split('.')[0];
    } else if (urlObj.hostname.endsWith('.lovable.app')) {
        baseName = urlObj.hostname.split('.')[0];
    } else {
        // Dominios normales
        baseName = urlObj.hostname.replace(/^www\./, '').split('.')[0];
    }
    
    // Limpiar el nombre base
    return baseName
        .replace(/[_\.]/g, '-')  // Reemplazar _ y . por -
        .replace(/-+/g, '-')     // Reemplazar múltiples - por uno solo
        .toLowerCase();          // Todo a minúsculas
}

function getSectionName(url) {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(p => p);
    
    if (pathParts.length === 0) {
        return 'home';
    }
    
    let section = pathParts[pathParts.length - 1]
        .replace(/\.html$/, '')  // Quitar .html
        .replace(/[_\.]/g, '-')  // Reemplazar _ y . por -
        .replace(/-+/g, '-')     // Reemplazar múltiples - por uno solo
        .toLowerCase();          // Todo a minúsculas
    
    return section || 'home';
}

function getScreenshotName(url) {
    const baseName = getBaseName(url);
    const section = getSectionName(url);
    return `${baseName}-${section}`;
}

async function takeScreenshots(url, viewportFilename, fullFilename) {
    const browser = await playwright.chromium.launch();
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
    
    try {
        const page = await context.newPage();
        
        // Configurar timeouts más largos
        page.setDefaultTimeout(60000); // 60 segundos para todas las operaciones
        page.setDefaultNavigationTimeout(60000);
        
        console.log(`Navegando a ${url}...`);
        await page.goto(url, { 
            waitUntil: 'networkidle',
            timeout: 60000 
        });
        
        // Esperar a que el DOM esté completamente cargado
        await page.waitForLoadState('domcontentloaded');
        
        // Esperar a que no haya peticiones de red pendientes
        await page.waitForLoadState('networkidle');
        
        // Esperar a que los elementos visibles estén renderizados
        await page.waitForLoadState('load');
        
        console.log('Esperando carga completa de contenido dinámico...');
        // Esperar un tiempo adicional para asegurar que todo el contenido dinámico se ha cargado
        await page.waitForTimeout(10000);
        
        // Verificar si hay elementos clave en la página
        const bodyContent = await page.evaluate(() => document.body.innerText);
        if (!bodyContent || bodyContent.length < 100) {
            throw new Error('La página parece no haber cargado correctamente');
        }
        
        console.log('Capturando viewport...');
        // Capturar viewport para vista previa
        await page.screenshot({
            path: viewportFilename,
            type: 'jpeg',
            quality: 80
        });

        console.log('Capturando página completa...');
        // Capturar página completa para lightbox
        await page.screenshot({
            path: fullFilename,
            fullPage: true,
            type: 'jpeg',
            quality: 80
        });

        console.log(`✓ Capturada ${url}`);
    } catch (error) {
        console.error(`Error capturando ${url}:`, error);
        throw error;
    } finally {
        await context.close();
        await browser.close();
    }
}

async function captureWebsite(urls) {
    try {
        // Capturar screenshots secuencialmente
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            const screenshotName = getScreenshotName(url);
            
            const viewportFilename = path.join(SCREENSHOTS_DIR, `${screenshotName}.jpg`);
            const fullFilename = path.join(FULL_SCREENSHOTS_DIR, `${screenshotName}.jpg`);
            
            console.log(`Capturing ${url}...`);
            await takeScreenshots(url, viewportFilename, fullFilename);
        }
    } catch (error) {
        console.error('Error capturing website:', error);
        throw error;
    }
}

async function takeScreenshotsWithSections(url, sections) {
    const browser = await playwright.chromium.launch();
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    });
    
    try {
        const page = await context.newPage();
        
        // Configurar timeouts más largos
        page.setDefaultTimeout(60000);
        page.setDefaultNavigationTimeout(60000);
        
        console.log(`Navegando a ${url}...`);
        await page.goto(url, { 
            waitUntil: 'networkidle',
            timeout: 60000 
        });
        
        await page.waitForLoadState('domcontentloaded');
        await page.waitForLoadState('networkidle');
        await page.waitForLoadState('load');
        
        console.log('Esperando carga completa de contenido dinámico...');
        await page.waitForTimeout(10000);
        
        const bodyContent = await page.evaluate(() => document.body.innerText);
        if (!bodyContent || bodyContent.length < 100) {
            throw new Error('La página parece no haber cargado correctamente');
        }

        // Capturar secciones
        for (const [sectionName, scrollPosition] of Object.entries(sections)) {
            console.log(`Capturando sección ${sectionName}...`);
            
            // Scroll a la posición
            await page.evaluate((pos) => window.scrollTo(0, pos), scrollPosition);
            await page.waitForTimeout(2000); // Esperar a que se estabilice el scroll
            
            // Capturar viewport
            await page.screenshot({
                path: `screenshots/t0t-sergiofores-art-01234-${sectionName}.jpg`,
                type: 'jpeg',
                quality: 80
            });
            
            // Capturar página completa para esta sección
            await page.screenshot({
                path: `screenshots/full/t0t-sergiofores-art-01234-${sectionName}.jpg`,
                type: 'jpeg',
                quality: 80
            });
        }

        console.log(`✓ Capturadas todas las secciones de ${url}`);
    } catch (error) {
        console.error(`Error capturando ${url}:`, error);
        throw error;
    } finally {
        await context.close();
        await browser.close();
    }
}

async function main() {
    try {
        await ensureDirectoryExists(SCREENSHOTS_DIR);
        await ensureDirectoryExists(FULL_SCREENSHOTS_DIR);
        
        const urls = process.argv.slice(2);
        if (urls.length === 0) {
            console.error('Please provide at least one URL as argument');
            process.exit(1);
        }

        await captureWebsite(urls);
        console.log('All screenshots captured successfully!');
        
    } catch (error) {
        console.error('Error in main process:', error);
        process.exit(1);
    }
}

if (process.argv[2] === '--sections') {
    const url = process.argv[3];
    const sections = {
        'home': 0,
        'about': 720,
        'gallery': 1440,
        'contact': 2160
    };
    takeScreenshotsWithSections(url, sections);
} else {
    main();
}
