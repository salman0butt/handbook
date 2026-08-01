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

    await page.goto(`${url}?release=ed879c6d`, {
      waitUntil: 'domcontentloaded',
      timeout: 30_000,
    });

    await page.waitForFunction(() => {
      const bodyText = document.body?.innerText || '';
      const diagramReady = [...document.querySelectorAll('article svg')].some(svg => {
        const text = svg.textContent || '';
        return text.includes('Scalar') && text.includes('Vector') && text.includes('Matrix') && text.includes('Tensor');
      });
      return diagramReady || /Parse error|Try again/i.test(bodyText);
    }, {timeout: 30_000});

    await sleep(1000);

    const result = await page.evaluate((requiredLabels) => {
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

    console.log('Live UI result:', JSON.stringify(result));

    const passed =
      result.titleText === 'Developer Handbook' &&
      !result.titleTruncated &&
      result.hasRequiredPrimaryLabels &&
      result.sameLine &&
      !result.documentOverflows &&
      !result.parseErrorVisible &&
      result.diagramRendered;

    if (!passed) {
      throw new Error(`Live UI verification failed: ${JSON.stringify(result)}`);
    }

    await page.screenshot({
      path: '/tmp/navbar-mermaid-live.png',
      fullPage: false,
    });
    console.log('PASS live desktop navbar and Mermaid rendering');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});
