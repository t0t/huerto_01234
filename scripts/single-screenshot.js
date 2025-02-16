const { chromium } = require('playwright');
const path = require('path');

async function takeScreenshot() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    try {
        await page.setViewportSize({ width: 1280, height: 720 });
        await page.goto('https://www.sergiofores.es/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.screenshot({
            path: path.join(__dirname, '..', 'screenshots', 'screenshot-4.jpg'),
            type: 'jpeg',
            quality: 80
        });
        console.log('Screenshot captured successfully!');
    } catch (error) {
        console.error('Error capturing screenshot:', error);
    } finally {
        await browser.close();
    }
}

takeScreenshot();
