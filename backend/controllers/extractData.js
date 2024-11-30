const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');

exports.handleFileUpload = async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send('No file uploaded.');

  try {
    let extractedData;
    const filePath = file.path;

    if (file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedData = extractDataFromText(pdfData.text);
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const docxBuffer = fs.readFileSync(filePath);
      const { value } = await mammoth.extractRawText({ buffer: docxBuffer });
      extractedData = extractDataFromText(value);
    }  else {
      return res.status(400).send('Unsupported file type.');
    }

    fs.unlinkSync(filePath); 
    res.status(200).json(extractedData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing file.');
  }
};

// Extract meaningful data from plain text
const extractDataFromText = (text) => {
  // Split the text into lines and remove empty ones
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);

  // Extract data based on a specific pattern 
  const extractedData = lines.map(line => {
    return {
      content: line,
    };
  });

  return extractedData;
};

 