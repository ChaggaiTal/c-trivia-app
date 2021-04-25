import {NUM_OF_QUESTIONS} from "./constants.js";
const $loader = document.querySelector(".loader");
const $startBtn = document.querySelector(".start");
const $questionWrap = document.querySelector(".questionWrap");
const $question = document.querySelector("#question");
const $answerWrap = document.querySelector(".answersWrap");
const $answers = document.querySelectorAll(".answer");
const $title = document.querySelector(".title");
let questions = [];
let questionIndex;
let score = 0;
const initGame = () => {
  questionIndex = 1;
  showHideQuestion("show");
  getQuestionsFromApi().then((response) => {
    $loader.style.display = "none";
    questions = response;
    setQuestion();
  });
};
const getQuestionsFromApi = async () => {
  const response = await fetch(`https://opentdb.com/api.php?amount=${NUM_OF_QUESTIONS}`);
  const data = await response.json().then((data2) => data2.results);
  return data;
};
const showHideQuestion = (action) => {
  $loader.style.display = action === "show" ? "flex" : "none";
  $startBtn.style.display = action === "show" ? "none" : "block";
  $questionWrap.style.display = action === "show" ? "block" : "none";
  $answerWrap.style.display = action === "show" ? "flex" : "none";
};
const setQuestion = () => {
  const {question, correct_answer, incorrect_answers} = questions[questionIndex - 1];
  const answers = [...incorrect_answers, correct_answer];
  $title.innerHTML = `Question ${questionIndex} of 10`;
  $question.innerHTML = question;
  answers.sort(() => 0.5 - Math.random());
  answers.forEach((answer, index) => {
    $answers[index].style.display = "block";
    $answers[index].innerHTML = answer;
    $answers[index].addEventListener("click", checkAnswer);
  });
};
const checkAnswer = ({target}) => {
  $answers.forEach(($answer) => {
    $answer.removeEventListener("click", checkAnswer);
  });
  const {correct_answer} = questions[questionIndex - 1];
  target.classList.add("correct");
  if (correct_answer === target.innerHTML) {
    score++;
  } else {
    $answers.forEach(($answer) => {
      if ($answer.innerHTML === correct_answer) {
        $answer.classList.add("correct");
      }
    });
    target.classList.add("incorrect");
  }
  questionIndex++;
  setTimeout(() => {
    target.classList.remove("incorrect");
    $answers.forEach(($answer) => $answer.classList.remove("correct"));
    if (questionIndex <= NUM_OF_QUESTIONS) {
      $answers.forEach(($answer) => $answer.style.display = "none");
      setQuestion();
    } else {
      endGame();
    }
  }, 1e3);
};
const endGame = () => {
  showHideQuestion();
  $title.innerHTML = `You got ${score} answers right!`;
  $startBtn.innerHTML = "Play again";
};
$startBtn.addEventListener("click", initGame);
