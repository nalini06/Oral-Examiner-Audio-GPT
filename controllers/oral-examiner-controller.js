const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

exports.extractTextFromPdf = async (req,res) =>{
    try {
        const pdfFilePath = path.join(__dirname, 'test-file.pdf'); // Adjust the file path accordingly
        
        // Check if the file exists
        if (fs.existsSync(pdfFilePath)) {
          const dataBuffer = fs.readFileSync(pdfFilePath);
          const data = await pdf(dataBuffer);
    
          // Send the extracted text content as a string to the client
          console.log(data.text);
          res.send({ data: data.text });
        } else {
          res.status(404).send('File not found');
        }
      } catch (error) {
        console.error('Error while reading and sending PDF content:', error);
        res.status(500).send('Internal Server Error');
      }
}


