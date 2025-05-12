'use server'
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export async function scrapeTikTokVideos(username) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Speed optimization: block styles/images/fonts
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const resourceType = req.resourceType();
    if (['image', 'stylesheet', 'font'].includes(resourceType)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  // STEP 1: Visit TikTok homepage to initialize cookies/session
  await page.goto('https://www.tiktok.com', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // Wait a bit to simulate human behavior
  await sleep(3000);

  // STEP 2: Now visit the actual profile
  const userUrl = `https://www.tiktok.com/@${username}`;
  await page.goto(userUrl, {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  // STEP 3: Wait for post container
  await page.waitForSelector('div[data-e2e="user-post-item"]', { timeout: 15000 });

  // STEP 4: Scrape posts
  const videos = await page.evaluate(() => {
    const items = document.querySelectorAll('div[data-e2e="user-post-item"]');
    return Array.from(items).map((el) => {
      const thumbnail = el.querySelector('img')?.src || null;
      const caption = el.querySelector('a')?.getAttribute('title') || null;
      const link = el.querySelector('a')?.href || null;
      return { thumbnail, caption, link };
    });
  });

  await browser.close();
  console.log(videos);
  return videos;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
