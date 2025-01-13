const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const docx = require('docx'); 
const mammoth = require('mammoth');

const app = express();

// Middleware to allow cross-origin requests
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Serve the React frontend (build folder)
app.use(express.static(path.join(__dirname, '../frontend/build')));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Configure multer for file uploads with the writable 'uploads' directory
const upload = multer({ dest: uploadsDir });

// Function to handle PDF files
async function handlePDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);
  return pdfData.text; // Return the text extracted from the PDF
}

// Function to handle DOCX files
async function handleDocx(filePath) {
  try {
    // Read the DOCX file
    const dataBuffer = fs.readFileSync(filePath);
    const { value } = await mammoth.extractRawText({ buffer: dataBuffer });
    return value;  // Return the extracted text from the DOCX file
  } catch (err) {
    throw new Error(`Error extracting DOCX content: ${err.message}`);
  }
}

// Function to parse text into structured data
function parseTextToStructuredData(text) {
  const units = [];
  const unitPattern = /Unit (\d+)(.*?)Unit (\d+|$)/gs;
  let match;
  
  while ((match = unitPattern.exec(text)) !== null) {
    const unitNumber = match[1];
    const questionsAnswersText = match[2].trim();
    const questions = [];

    // Split questions and answers by line
    const lines = questionsAnswersText.split('\n');
    lines.forEach(line => {
      const parts = line.split('?');
      if (parts.length === 2) {
        questions.push({
          question: parts[0].trim() + '?',
          answer: parts[1].trim()
        });
      }
    });

    units.push({
      unit: unitNumber,
      questions: questions
    });
  }
  console.log(units);
  return units;
}

// File upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  console.log('Uploaded file:', file);

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = path.resolve(__dirname, file.path);
  const fileType = file.mimetype;
  let extractedData;

  try {
    // Process file based on type
    if (fileType === 'application/pdf') {
      extractedData = await handlePDF(filePath);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      extractedData = await handleDocx(filePath);
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }

    // Parse the extracted text into structured data
    const structuredData = parseTextToStructuredData(extractedData);

    // Save the structured data in the 'data' folder
    const dataId = Date.now();  // a unique ID to store data
    fs.writeFileSync(path.join(dataDir, `${dataId}.json`), JSON.stringify(structuredData)); // Save data

    // Return the dataId for frontend redirection
    res.json({ dataId });
  } catch (err) {
    console.error('Error processing file:', err.message);
    res.status(500).json({ error: `Error processing file: ${err.message}` });
  } finally {
    // Clean up uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

// Route to serve the structured data page
app.get('/view/:dataId', (req, res) => {
  const dataId = req.params.dataId;
  const dataFilePath = path.join(__dirname, 'data', `${dataId}.json`);
  
  if (fs.existsSync(dataFilePath)) {
    const structuredData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    res.json({ structuredData });  // Send the structured data back to the frontend
    console.log("structured data sent to front end");
  } else {
    res.status(404).send('Data not found');
  }
});



// Fallback route to serve the React frontend (Single Page App)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
