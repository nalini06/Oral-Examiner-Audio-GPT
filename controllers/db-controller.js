const Transcript = require('../models/transcriptModel');

exports.saveTranscript = async (req, res)=>{
    const {transcript} = req.body;
    let transcriptEntry = new Transcript({transcript});
    try{
        await transcriptEntry.save();
    }catch{
        res.send({message: error.message})
    }
}