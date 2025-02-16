const { chromium } = require('playwright');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, '..', 'screenshots');
const HTML_FILE = path.join(__dirname, '..', 'index.html');

async function ensureDirectoryExists(dir) {
    try {
        await fs.access(dir);
    } catch {
        await fs.mkdir(dir, { recursive: true });
    }
}

async function takeScreenshot(url, filename) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    try {
        await page.setViewportSize({ width: 1280, height: 720 });
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.screenshot({
            path: filename,
            type: 'jpeg',
            quality: 80
        });
    } catch (error) {
        console.error(`Error capturing screenshot for ${url}:`, error);
        throw error;
    } finally {
        await browser.close();
    }
}

async function updateHTML(links) {
    const html = await fs.readFile(HTML_FILE, 'utf-8');
    const $ = cheerio.load(html);
    
    $('.link-item').each((i, elem) => {
        const link = $(elem).attr('href');
        if (link && links[link]) {
            const screenshotPath = path.relative(path.dirname(HTML_FILE), links[link]);
            const title = $(elem).find('.link-title').text();
            $(elem).prepend(`<img class="screenshot-thumbnail" src="${screenshotPath}" alt="Screenshot of ${title}" loading="lazy">`);
        }
    });
    
    await fs.writeFile(HTML_FILE, $.html());
}

async function main() {
    try {
        await ensureDirectoryExists(SCREENSHOT_DIR);
        
        const html = await fs.readFile(HTML_FILE, 'utf-8');
        const $ = cheerio.load(html);
        const links = {};
        
        const promises = [];
        $('.link-item').each((i, elem) => {
            const url = $(elem).attr('href');
            if (url && url.startsWith('http')) {
                const filename = path.join(SCREENSHOT_DIR, `screenshot-${i}.jpg`);
                links[url] = filename;
                promises.push(takeScreenshot(url, filename));
            }
        });
        
        await Promise.all(promises);
        await updateHTML(links);
        console.log('Screenshots captured and HTML updated successfully!');
        
    } catch (error) {
        console.error('Error in main process:', error);
        process.exit(1);
    }
}

main();
