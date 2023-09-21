
import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

const mic = new SpeechRecognition();
mic.continuous = true
mic.lang ='en-US'



var generatedQuestions = [];
var transcriptBetweenStudentAndExaminer = ""


function OralExam() {
  let [isListening, setIsListening ] = useState(false)
  const [questions, setQuestions] = useState('');
  const [answers, setAnswers] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [questionsReady, setQuestionsReady] = useState(false);



  const handleFetchFile = async () => {
    try {
      setQuestions("Please wait, questions are generating")
      // Make an HTTP request to the server to fetch the PDF file
      const response = await axios.get('https://oral-examiner-server.onrender.com/api/pdfContent')
      const pdfContent = response.data.data.trim()
      console.log(pdfContent);
      // Assuming the server returns the PDF file as binary data
      
       
      // Set the PDF URL as questions in the text box
      

      // Set questionsReady to true
      setQuestionsReady(true);
      generateQuestions(pdfContent, "no")
    } catch (error) {
      console.error('Error while fetching and processing the file:', error);
    }
  };



  
  const generateQuestions = async (content, isFollowUp) => {
    // some times content can be pdf content of prevAskedQuestion by oral examiner
    try {
      // Make an HTTP request to your Node.js server to generate questions
      const response = await axios.post('https://oral-examiner-server.onrender.com/api/generateQuestions', {
        text: content,
        isFollowUp : isFollowUp,
        askedQuestion: content,
        role: "You're oral examiner", // Specify the role
      });
      console.log(typeof(response.data));
      // Handle the generated questions in the response
      console.log(response.data);
      if(isFollowUp == "no"){
        setQuestions("Questions are ready you can start you're exam");
        generatedQuestions = response.data.split('\n');
      }
       
      return response.data.split('\n');
      
    } catch (error) {
      console.error('Error while generating questions:', error);
    }
  };
  


  
  


  const handleStartExam = async () => {
    const pdf = new jsPDF();

    if (generatedQuestions.length > 0) {


      for (let i = 0; i < generatedQuestions.length; i++) {
        const question = generatedQuestions[i];
        console.log("Asked question: " + question);
        setQuestions(question)
        const speech = new SpeechSynthesisUtterance(question);
        speechSynthesis.speak(speech);
        transcriptBetweenStudentAndExaminer += "Mercor Oral Examiner: " + question + "\n"
        const userResponse = await handleListen()
        transcriptBetweenStudentAndExaminer += "Student: " + userResponse + "\n"
        setAnswers("")
        setAnswers(userResponse)
        //Asking follow up question

        const followUpQuestions = await generateQuestions(question, userResponse);
        
        for(let j =0; j<followUpQuestions.length; j++){
            const followUpQuestion = followUpQuestions[j].trim();
            if(followUpQuestion != '' && followUpQuestion.length > 0){
                 setQuestions(followUpQuestion);
                 const speech2 = new SpeechSynthesisUtterance(followUpQuestion);
                 speechSynthesis.speak(speech2);
                 transcriptBetweenStudentAndExaminer += "Mercor oral Examiner: "+ followUpQuestion + "\n";
                 const userResponse2 = await handleListen();
                 transcriptBetweenStudentAndExaminer += "Student: " + userResponse2 + "\n";
                 setAnswers(userResponse2);
                 break;
            }
        }
      }
       console.log("exam is completed");
       setQuestions("Thanks for taking this exam, transcript uploaded to our database and also a copy is downloaded into your's local storage.")
       console.log("The Generated Transcript \n" + transcriptBetweenStudentAndExaminer)
      mic.stop()
      mic.onend = () =>{
        console.log("Mic is stopped");
      }
      pdf.text(transcriptBetweenStudentAndExaminer, 10, 10); // Adjust the position as needed

      // Save the PDF
      pdf.save("transcript.pdf");

      try{
        const response = await axios.post('https://oral-examiner-server.onrender.com/api/save', {
          transcript : transcriptBetweenStudentAndExaminer
        })
      }catch(error){
              console.log(error);
      }
     
    }
  };



const handleListen = () => {
  return new Promise((resolve, reject) => {
    console.log("state of isL " + isListening);

    if (!isListening) {
      mic.start();
      mic.onend = () => {
        console.log("continue");
        if (!isListening) {
          mic.start(); // Start the microphone only if it's still not listening
        }
      };
      setIsListening(true); // Update the state to indicate that the mic is on
    } else {
      console.log("Mic is already on.");
    }

    mic.onresult = function(event){
      var current = event.resultIndex;
      var transcript = event.results[current][0].transcript
      transcript.trim();
      if(transcript.length > 0){
        console.log("User trans: " + transcript);
       isListening = true // Update the state to indicate that the mic is off
       resolve(transcript);
     }
  }
    /*
    mic.onresult = (event) => {
      var transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      if(transcript.length > 0){
         console.log("User trans: " + transcript);
        isListening = true // Update the state to indicate that the mic is off
        resolve(transcript);
      }
       // Resolve the promise with the transcript
    };
    */
  });
};

  
  

  return (
    
    <div>
      <h1>Oral Exam</h1>
      <div>
        <h2>Oral Examiner Questions</h2>
        <textarea
          rows="4"
          cols="50"
          value={questions}
          onChange={(e) => setQuestions(e.target.value)}
        />
      </div>
      <div>
      <button onClick={handleFetchFile} >
        Generate Questions
      </button>
      </div>
      
      <div>
        <h2>Student Answers</h2>
        <textarea
          rows="4"
          cols="50"
          value={answers}
          onChange={(e) => setAnswers(e.target.value)}
        />
      </div>
      <button onClick={handleStartExam} >
        Start Exam
      </button>
    </div>
  );
}

export default OralExam;
