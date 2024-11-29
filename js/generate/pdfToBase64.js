import * as puppeteer from 'puppeteer';


export async function generatePdfToBase64(template, res) {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });

    const page = await browser.newPage();
    await page.setContent(template, { waitUntil: "load", timeout: 0 });
    const buffer = await page.pdf({
      format: "A4",
      printBackground: true,
      timeout: 0,
    });

    await browser.close();
    // todo move res logic to controller
    res.json({ response: Buffer.from(buffer).toString("base64") });
  } catch (err) {
    res.sendStatus(500);
  }
}
