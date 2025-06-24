const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'your_releasenotes.io_url';
const START_QUERY = '?page=1';
const OUTPUT_DIR = path.resolve(__dirname, 'release-notes-pdfs');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let currentQuery = START_QUERY;
  const visited = new Set();
  let count = 1;

  while (true) {
    if (visited.has(currentQuery)) break;
    visited.add(currentQuery);

    const url = `${BASE_URL}/${currentQuery}`;
    console.log(`Visiting: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

    // Filename: e.g. "01_page-1.pdf"
    const pageNum = currentQuery.match(/page=(\d+)/)?.[1] || count;
    const filename = `${count.toString().padStart(2, '0')}_page-${pageNum}.pdf`;
    const outputPath = path.join(OUTPUT_DIR, filename);

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true
    });

    console.log(`Saved PDF: ${outputPath}`);
    count++;

    // Find the “›” next button
    const nextQuery = await page.evaluate(() => {
      // select all anchors with href containing "?page="
      const candidates = Array.from(document.querySelectorAll('a[href*="?page="]'));
      // find the one whose text content is the right-arrow character
      const nextLink = candidates.find(a => a.textContent.trim() === '›');
      return nextLink ? nextLink.getAttribute('href') : null;
    });

    if (!nextQuery || nextQuery === currentQuery) break;
    currentQuery = nextQuery;
  }

  await browser.close();
  console.log(`Done: ${count - 1} pages saved to ${OUTPUT_DIR}`);
})();

