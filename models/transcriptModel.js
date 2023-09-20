const mongoose  = require('mongoose');

const transcriptSchema = mongoose.Schema({
    transcript: String
});


module.exports = mongoose.model('TranscriptSchema', transcriptSchema)
