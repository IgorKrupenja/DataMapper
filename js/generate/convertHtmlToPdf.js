import * as puppeteer from 'puppeteer';

export async function convertHtmlToPdf(template) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });

  const page = await browser.newPage();
  await page.setContent(template, { waitUntil: "load", timeout: 0 });
  const uintArray = await page.pdf({
    format: "A4",
    printBackground: true,
    timeout: 0,
  });

  await browser.close();

  return Buffer.from(uintArray).toString("base64");
}
