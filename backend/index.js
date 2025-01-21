const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const docx = require('docx'); 
const mammoth = require('mammoth');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

const app = express();

// Middleware to allow cross-origin requests
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/build')));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const upload = multer({ dest: uploadsDir });

const handlePDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

const handleDocx = async (filePath) => {
  const { value } = await mammoth.extractRawText({ path: filePath });
  return value;
};

// Bloom's Level Keyword Mapping
function handleBloomsLevel(question) {
  const bloomsKeywords = {
    remember: [
      "list", "define", "recall", "identify", "name", "label", "state", "match", "repeat",
      "what", "who", "where", "when", "which", "how much", "how many"
    ],
    understand: [
      "describe", "explain", "summarize", "paraphrase", "classify", "compare", "contrast",
      "interpret", "discuss", "rephrase", "report", "translate", "why", "how", "justify"
    ],
    apply: [
      "apply", "use", "solve", "demonstrate", "construct", "implement", "illustrate", "operate",
      "show", "execute", "calculate", "complete", "examine", "modify", "predict"
    ],
    analyze: [
      "analyze", "compare", "contrast", "differentiate", "distinguish", "examine", "experiment",
      "question", "test", "criticize", "debate", "diagram", "inspect", "investigate"
    ],
    evaluate: [
      "evaluate", "assess", "judge", "argue", "defend", "critique", "select", "support",
      "value", "appraise", "conclude", "justify", "prioritize", "recommend"
    ],
    create: [
      "create", "design", "develop", "formulate", "invent", "compose", "construct", "plan",
      "produce", "propose", "arrange", "assemble", "collect", "compile", "organize"
    ]
  };

  const tokens = tokenizer.tokenize(question.toLowerCase()).slice(0, 4);

  for (const [level, keywords] of Object.entries(bloomsKeywords)) {
    for (const keyword of keywords) {
      if (tokens.includes(keyword)) {
        console.log(`Question: "${question}" matched Bloom's level: ${level}`); // Add logging
        return level;
      }
    }
  }
  console.log(`Question: "${question}" did not match any Bloom's level`); // Add logging
  return 'unknown';
}

const parseTextToStructuredData = (extractedData) => {
  const units = [];
  const unitRegex = /UNIT (\d+)/i;
  const questionRegex = /^(What|How|Why|Describe|Explain|Compare|Name|List|Define|State|Identify|Summarize|Discuss|Evaluate|Analyze|Create|Design|Formulate|Develop|Construct|Propose|Arrange|Assemble|Collect|Compile|Organize|Apply|Use|Solve|Demonstrate|Implement|Illustrate|Operate|Show|Execute|Calculate|Complete|Examine|Modify|Predict|Differentiate|Distinguish|Experiment|Question|Test|Criticize|Debate|Diagram|Inspect|Investigate|Assess|Judge|Argue|Defend|Critique|Select|Support|Value|Appraise|Conclude|Justify|Prioritize|Recommend)\b.*$/i;
  const answerRegex = /^Answer:(.*)$/i;

  let currentUnit = null;
  let currentQuestion = null;

  extractedData.split('\n').forEach((line) => {
    line = line.trim(); // Trim whitespace from the line
    console.log('Processing line:', line); // Add logging

    const unitMatch = line.match(unitRegex);
    const questionMatch = line.match(questionRegex);
    const answerMatch = line.match(answerRegex);

    if (unitMatch) {
      console.log('Found unit:', unitMatch[1]); // Add logging
      currentUnit = {
        unit: unitMatch[1],
        questions: []
      };
      units.push(currentUnit);
    } else if (questionMatch && currentUnit && !answerMatch) {
      console.log('Found question:', questionMatch[0].trim()); // Add logging
      currentQuestion = {
        question: questionMatch[0].trim(),
        answer: '',
        bloomsLevel: handleBloomsLevel(questionMatch[0].trim())
      };
      currentUnit.questions.push(currentQuestion);
    } else if (answerMatch && currentQuestion) {
      console.log('Found answer:', answerMatch[1].trim()); // Add logging
      currentQuestion.answer = answerMatch[1].trim();
    }
  });

  console.log('Parsed units:', JSON.stringify(units, null, 2)); // Add logging
  return units;
};

app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  console.log('Uploaded file:', file);
  const { 
    selectedPartALevel,
    selectedPartBLevel,
    logoBase64,
    logoFormat,
    collegeName,
    affilatedUniversity,
    program,
   } = req.body;

   console.log("Recieved Data :");
   console.log({
    selectedPartALevel,
    selectedPartBLevel,
    logoBase64,
    logoFormat,
    collegeName,
    affilatedUniversity,
    program,
   });

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = path.resolve(__dirname, file.path);
  const fileType = file.mimetype;
  let extractedData;

  try {
    if (fileType === 'application/pdf') {
      extractedData = await handlePDF(filePath);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      extractedData = await handleDocx(filePath);
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }

    console.log('Extracted data:', extractedData); // Add logging
    const structuredData = parseTextToStructuredData(extractedData);

    const dataId = Date.now();
    
    const metadata = {
      selectedPartALevel,
      selectedPartBLevel,
      logoBase64,
      logoFormat,
      collegeName,
      affilatedUniversity,
      program,
      structuredData,
    };

    fs.writeFileSync(path.join(dataDir, `${dataId}.json`), JSON.stringify(metadata));

    res.json({ dataId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to serve structured data
app.get('/api/view/:dataId', (req, res) => {
  const dataId = req.params.dataId;
  const dataFilePath = path.join(dataDir, `${dataId}.json`);

  if (fs.existsSync(dataFilePath)) {
    const structuredData = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    res.json({ structuredData });
  } else {
    res.status(404).send('Data not found');
  }
});

// Serve React frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});