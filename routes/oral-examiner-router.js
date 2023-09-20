const express = require('express')
const router = express.Router()
const {extractTextFromPdf} = require('../controllers/oral-examiner-controller')
const {generateQuestions} = require('../controllers/open-ai-controller')
const {saveTranscript} = require('../controllers/db-controller');

router.route('/pdfContent').get(extractTextFromPdf)
router.route('/generateQuestions').post(generateQuestions)
router.route('/save').post(saveTranscript)

module.exports = router;