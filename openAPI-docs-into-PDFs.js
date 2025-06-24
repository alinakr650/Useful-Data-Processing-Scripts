const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'choose_a_url';
const START_PATH = '/openapi/.../your/path';
const OUTPUT_DIR = path.resolve(__dirname, 'api-docs');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let nextPath = START_PATH;
  const visited = new Set();
  let count = 1;

  while (nextPath && !visited.has(nextPath)) {
    visited.add(nextPath);

    const fullUrl = `${BASE_URL}${nextPath}`;
    console.log(`Visiting: ${fullUrl}`);
    await page.goto(fullUrl, { waitUntil: 'networkidle0', timeout: 60000 });

    // Create a safe filename from the path
    const fileSafeName = nextPath
      .replace(/^\/|\/$/g, '')
      .replace(/[\/:?&=#]+/g, '_')
      .slice(0, 100);

    const outputPath = path.join(
      OUTPUT_DIR,
      `${count.toString().padStart(2, '0')}_${fileSafeName}.pdf`
    );

    // Save the page as PDF
    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true
    });

    console.log(`Saved PDF: ${outputPath}`);
    count++;

    // Find the "Next" link
    nextPath = await page.evaluate(() => {
      const nextLink = document.querySelector('a[data-cy="next-to"]');
      return nextLink ? nextLink.getAttribute('href') : null;
    });
  }

  await browser.close();
  console.log(`Finished crawling. ${count - 1} pages saved.`);
})();

