const  OpenAI  = require('openai');
const dotenv  = require('dotenv')
dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});


exports.generateQuestions = async(req, res) =>{

 
   const {text, isFollowUp, askedQuestion}= req.body
   
   var prompt =  ""
   if(isFollowUp == "no"){
    prompt = "You are a oral examiner generate 3 questions about this topic: " + text
   }else{
    prompt = `You are a oral examiner, previously you asked a question "${isFollowUp}" for that question. Student responded with "${text}" can you ask one more follow up question for his response. `
   } 
   
   console.log(prompt);

  const completion = await openai.completions.create({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 2048,
  });
  const questions = completion.choices[0].text
  var trimmedQuestions = ""
  const arr = questions.split('\n')
  for(let i =0; i< arr.length; i++){
    arr[i].trim();
    if(arr[i].length > 0 && arr[i] != ''){
      trimmedQuestions += arr[i] + "\n";
    }
  }
  console.log(trimmedQuestions.split('\n'));
  res.send(questions.substring(0, questions.length-1));

}





