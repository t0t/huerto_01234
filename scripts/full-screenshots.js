const { chromium } = require('playwright');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

const HTML_FILE = path.join(__dirname, '..', 'index.html');
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots', 'full');

async function ensureDirectoryExists(dir) {
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
}

async function takeFullScreenshot(url, filename) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    try {
        console.log(`Capturing ${url}...`);
        await page.setViewportSize({ width: 1280, height: 720 });
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        
        // Esperar a que la página cargue completamente
        await page.waitForLoadState('networkidle');
        
        // Capturar la página completa
        await page.screenshot({
            path: filename,
            type: 'jpeg',
            quality: 80,
            fullPage: true // Esto capturará toda la página
        });
        
        console.log(`✓ Captured ${url}`);
    } catch (error) {
        console.error(`✗ Error capturing ${url}:`, error.message);
    } finally {
        await browser.close();
    }
}

async function main() {
    try {
        await ensureDirectoryExists(SCREENSHOTS_DIR);
        
        const html = await fs.readFile(HTML_FILE, 'utf-8');
        const $ = cheerio.load(html);
        
        const links = [];
        $('.link-item').each((i, elem) => {
            const url = $(elem).attr('href');
            if (url && url.startsWith('http')) {
                links.push({
                    url,
                    filename: path.join(SCREENSHOTS_DIR, `screenshot-${i}.jpg`)
                });
            }
        });
        
        // Capturar screenshots secuencialmente para no sobrecargar el sistema
        for (const link of links) {
            await takeFullScreenshot(link.url, link.filename);
        }
        
        console.log('All full page screenshots captured successfully!');
        
    } catch (error) {
        console.error('Error in main process:', error);
        process.exit(1);
    }
}

main();
