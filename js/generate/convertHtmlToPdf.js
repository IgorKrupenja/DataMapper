import * as puppeteer from 'puppeteer';

export async function convertHtmlToPdf(html, res) {
  try {
    const t0 = performance.now();
    console.log("convertHtmlToPdf: generating from HTML:\n\n", html);
  
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load", timeout: 0 });
    const uintArray = await page.pdf({
      format: "A4",
      printBackground: true,
      timeout: 0,
    });
  
    await browser.close();
  
    const t1 = performance.now();
    console.log(`convertHtmlToPdf: generated in ${t1 - t0} milliseconds`);
    // todo move res logic to controller
    res.json({ response: Buffer.from(uintArray).toString("base64") });
  } catch (err) {
    res.sendStatus(500);
  }
}
