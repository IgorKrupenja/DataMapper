import * as puppeteer from 'puppeteer';


export async function generatePdfToBase64(template, res) {
  // let file = { content: template };
  // let options = { format: "A4" };

  // try {
  //   const pdfBuffer = await html_to_pdf.generatePdf(file, options);
  //   res.json({ response: pdfBuffer.toString("base64") });
  // } catch (err) {
  //   res.sendStatus(500);
  // }

  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-dev-shm-usage'] });

    const page = await browser.newPage();
    await page.setContent(template, { waitUntil: "load", timeout: 0 });
    const buffer = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
      timeout: 0,
    });

    await browser.close();
    // todo move res logic to controller
    res.json({ response: buffer.toString("base64") });
  } catch (err) {
    res.sendStatus(500);
  }
}
