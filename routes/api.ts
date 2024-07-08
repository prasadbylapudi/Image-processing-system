const express = require('express');
const router = express.Router();
const multer = require('multer');
const { z } = require('zod');
const { handleUpload, checkStatus,getProducts,csvData } = require('../controllers/apiController');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), handleUpload);

router.get('/products', getProducts);
router.get('/csvData', csvData);


router.get('/status/:requestId', checkStatus);

module.exports = router;