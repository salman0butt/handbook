const puppeteer = require('puppeteer-core');

const url = 'https://salman0butt.github.io/handbook/docs/ai-engineering/foundations/vectors-matrices-tensors';
const executablePath = process.env.CHROME_BIN || '/usr/bin/google-chrome';
const requiredPrimaryLabels = ['Frontend', 'Backend & Data', 'Mobile', 'AI', 'More'];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({width: 1728, height: 900, deviceScaleFactor: 1});

    let lastResult = null;

    for (let attempt = 1; attempt <= 36; attempt += 1) {
      try {
        await page.goto(`${url}?release=ed879c6d-${attempt}`, {
          waitUntil: 'networkidle2',
          timeout: 60_000,
        });
        await sleep(2500);

        lastResult = await page.evaluate((requiredLabels) => {
          const normalize = (value) => (value || '').replace(/\s+/g, ' ').trim();
          const title = document.querySelector('.navbar__title');
          const leftItems = [...document.querySelectorAll('.navbar__items--left > .navbar__item')]
            .filter(element => {
              const style = window.getComputedStyle(element);
              const rect = element.getBoundingClientRect();
              return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0;
            });

          const primaryTexts = leftItems.map(element => {
            const trigger = element.matches('.navbar__link')
              ? element
              : element.querySelector(':scope > .navbar__link');
            return normalize(trigger?.textContent || element.getAttribute('aria-label'));
          });

          const rects = leftItems.map(element => element.getBoundingClientRect());
          const topValues = rects.map(rect => Math.round(rect.top));
          const sameLine = topValues.length > 0 && Math.max(...topValues) - Math.min(...topValues) <= 2;
          const articleSvgTexts = [...document.querySelectorAll('article svg')]
            .map(svg => svg.textContent || '');
          const diagramRendered = articleSvgTexts.some(text =>
            text.includes('Scalar') && text.includes('Vector') && text.includes('Matrix') && text.includes('Tensor'),
          );
          const bodyText = document.body.innerText || '';

          return {
            titleText: normalize(title?.textContent),
            titleTruncated: Boolean(title && title.scrollWidth > title.clientWidth + 1),
            primaryTexts,
            hasRequiredPrimaryLabels: requiredLabels.every(label => primaryTexts.includes(label)),
            sameLine,
            documentOverflows: document.documentElement.scrollWidth > window.innerWidth + 1,
            parseErrorVisible: /Parse error|Try again/i.test(bodyText),
            diagramRendered,
            viewportWidth: window.innerWidth,
            documentWidth: document.documentElement.scrollWidth,
            currentUrl: window.location.href,
          };
        }, requiredPrimaryLabels);

        const passed =
          lastResult.titleText === 'Developer Handbook' &&
          !lastResult.titleTruncated &&
          lastResult.hasRequiredPrimaryLabels &&
          lastResult.sameLine &&
          !lastResult.documentOverflows &&
          !lastResult.parseErrorVisible &&
          lastResult.diagramRendered;

        console.log(`Attempt ${attempt}:`, JSON.stringify(lastResult));

        if (passed) {
          await page.screenshot({
            path: '/tmp/navbar-mermaid-live.png',
            fullPage: false,
          });
          console.log('PASS live desktop navbar and Mermaid rendering');
          return;
        }
      } catch (error) {
        console.log(`Attempt ${attempt} failed: ${error.message}`);
      }

      await sleep(5000);
    }

    throw new Error(`Live UI did not pass within the deployment window. Last result: ${JSON.stringify(lastResult)}`);
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});
