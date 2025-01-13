const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

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

// Endpoint to handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const pdfText = await handlePDF(filePath);

    // Save the extracted data to a file or database
    const dataId = Date.now().toString();
    const dataFilePath = path.join(dataDir, `${dataId}.json`);
    fs.writeFileSync(dataFilePath, JSON.stringify({ structuredData: pdfText }));

    res.json({ dataId });
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ error: 'Failed to process PDF' });
  }
});

// Endpoint to fetch processed data
app.get('/view/:dataId', (req, res) => {
  const dataId = req.params.dataId;
  const dataFilePath = path.join(dataDir, `${dataId}.json`);

  if (fs.existsSync(dataFilePath)) {
    const data = fs.readFileSync(dataFilePath);
    res.json(JSON.parse(data));
  } else {
    res.status(404).json({ error: 'Data not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});