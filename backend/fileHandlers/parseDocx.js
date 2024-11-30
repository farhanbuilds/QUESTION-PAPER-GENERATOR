const fs = require('fs');
const { Document } = require('docx');

async function parseDocx(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const doc = await Document.load(buffer);

    const paragraphs = doc.paragraphs.map((p) => p.text).join('\n');
    return { text: paragraphs }; // Extract raw text from DOCX
  } catch (error) {
    throw new Error('Error parsing DOCX');
  }
}

module.exports = parseDocx;
