const pdfParse = require("pdf-parse");
const axios = require("axios");
const cheerio = require("cheerio");

async function extractFromPdf(buffer) {
  const data = await pdfParse(buffer);
  return data.text;
}

async function extractFromUrl(url) {
  const response = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
    },
  });
  const $ = cheerio.load(response.data);
  $("script, style, nav, footer").remove();
  return $("body").text().replace(/\s+/g, " ").trim();
}

module.exports = { extractFromPdf, extractFromUrl };