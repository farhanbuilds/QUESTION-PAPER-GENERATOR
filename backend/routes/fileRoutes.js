const express = require('express');
const { handleFileUpload } = reuire('./controllers/extractData');
const multer = require('multer');

const upload = multer({dest:'../uploads/' });

const router = express.Router();

router.post('/upload', upload.single('file'), handleFilUpload);

module.exports = router;