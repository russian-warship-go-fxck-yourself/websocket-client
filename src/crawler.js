const { cycleGenerator } = require("./helpers");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

class Crawler {
  baseUrl = "";
  hrefMaxLength = 3;

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async run() {
    const browser = await puppeteer.launch();
    await this.runCycle(browser);
    await browser.close();
  }

  async runCycle(browser) {
    // Launch browser tab in incognito
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    await page.goto(this.baseUrl, { waitUntil: "networkidle2" });

    // In cycle navigate by site links
    for await (const cycle of cycleGenerator()) {
      // Page html to jQuery-like syntax
      const html = await page.evaluate(
        () => document.querySelector("*").outerHTML
      );
      const $ = cheerio.load(html);

      // Fetch all links from the page
      const links = [];
      $("a")
        .filter(
          (i, e) =>
            $(e).text().length > this.hrefMaxLength &&
            $(e).attr("href").startsWith("/")
        )
        .each((i, e) => links.push($(e).attr("href")));

      // Choose random link and navigate
      const randomHref = links[Math.floor(Math.random() * links.length)];
      await page.goto(`${this.baseUrl}${randomHref}`, {
        waitUntil: "networkidle2",
      });
    }

    // Close browser tab
    await page.close();
  }
}

module.exports = {
  Crawler,
};
