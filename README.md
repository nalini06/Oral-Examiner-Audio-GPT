# Oral-Examiner-Audio-GPT

Using React.ks and NodeJS, this web application can take an oral exam of the topic mentioned in the pdf. It can ask questions using text to speech, user can response to question using speech to text.
A transcript also be downloaded into user's local storage in pdf form and a same copy will be stored in server's database.


## Tech Stack
- React Js
- NodeJS
- OpenAI
- MongoDB

## Working
- When user taps generate questions button in application, then application reads the data present in pdf which is located in controller folder and sends that data to node js server. In there questions are generated
   using openai and sent back to client 
- By Using Speech Synthesis we can convert text to speech. And By using webkitSpeechRecognination this application takes input from user via speech to text.
- This response is again sent to Backend server for further follow-up questions.
- Both questions asked by oral-examiner and answers given by student will be downloaded as transcript into user's local storage as well as into backend server database (Mongo DB).


##Setup
This project is deployed at render 
```
https://oral-examiner-client.onrender.com/
```

To set this up and run in localhost, clone this repo, download all dependencies.

Installing nodejs dependencies.

```
in root folder
npm install (to install node js dependencies)

```

Installing React js Dependencies, get into client folder
```
cd client
npm install
```

PDF folder has to be placed at controller folder.

