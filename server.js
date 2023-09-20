const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const examRouter = require('./routes/oral-examiner-router')

const {dbConnection} = require('./config/db')
const app = express();
const port = process.env.PORT || 5000;
dbConnection();
app.use(cors());
app.use(express.json());
// Serve the PDF file content as text
app.use('/api', examRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
