const fs = require('fs');
const pdfParse = require('pdf-parse');

async function parsePdf(filePath) {
  const buffer = fs.readFileSync(filePath);

  try {
    const data = await pdfParse(buffer);
    return { text: data.text }; // Extract raw text
  } catch (error) {
    throw new Error('Error parsing PDF');
  }
}

module.exports = parsePdf;
