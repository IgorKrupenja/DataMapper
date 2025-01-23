import * as puppeteer from 'puppeteer';

let browser;

async function getBrowser() {
  if (browser) return browser;

  browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--enable-logging',
      '--v=1'
    ],
    dumpio: true,
  });
  console.debug("convertHtmlToPdf: created browser");

  return browser;
}

export async function convertHtmlToPdf(html) {
  const browser = await getBrowser();

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load", timeout: 0 });
    
    console.debug("convertHtmlToPdf: created page")

    const uintArray = await page.pdf({
      format: "A4",
      printBackground: true,
      timeout: 0,
    });
    const base64 = Buffer.from(uintArray).toString("base64");
    console.debug("convertHtmlToPdf: created pdf")

    // Closing the page explicitly should not be needed normally
    // But this may be bugged in Puppeteer: https://github.com/puppeteer/puppeteer/issues/7922
    await page.close();
    console.debug("convertHtmlToPdf: closed page")

    return base64;
  } catch (error) {
    console.error("convertHtmlToPdf: error", error);
    await browser.close();
    console.debug("convertHtmlToPdf: closed browser on error")
    throw error;
  }
}
