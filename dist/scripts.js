const $loader = document.querySelector(".loader");
const $startBtn = document.querySelector(".start");
const $questionWrap = document.querySelector(".questionWrap");
const $question = document.querySelector("#question");
const $answerWrap = document.querySelector(".answersWrap");
const $answers = document.querySelectorAll(".answer");
const $correctAnswer = document.querySelector("#correctAnswer");
const $title = document.querySelector(".title");
const $startForm = document.querySelector(".start-form");
const $numOfQuestions = document.querySelector("#trivia_amount");
const $category = document.querySelector('[name="trivia_category"]');
const $difficulty = document.querySelector('[name="trivia_difficulty"]');
let questions = [];
let questionIndex;
let score = 0;
let numOfQuestions;
const initGame = (e) => {
  e.preventDefault();
  numOfQuestions = +$numOfQuestions.value;
  const categoryOption = +$category.value > 0 ? `&category=${$category.value}` : "";
  const difficultyOption = $difficulty.value !== "any" ? `&difficulty=${$difficulty.value}` : "";
  const url = `https://opentdb.com/api.php?amount=${numOfQuestions}${categoryOption}${difficultyOption}`;
  if (+$numOfQuestions.value > 0 && +$numOfQuestions.value <= 50) {
    questionIndex = 1;
    score = 0;
    showHideQuestion("show");
    getQuestionsFromApi(url).then((response) => {
      $loader.style.display = "none";
      questions = response;
      setQuestion();
    });
  }
};
const getQuestionsFromApi = async (url) => {
  const response = await fetch(url);
  const data = await response.json().then((data2) => data2.results);
  return data;
};
const showHideQuestion = (action) => {
  $startForm.style.display = action === "show" ? "none" : "block";
  $loader.style.display = action === "show" ? "flex" : "none";
  $startBtn.style.display = action === "show" ? "none" : "block";
  $questionWrap.style.display = action === "show" ? "block" : "none";
  $answerWrap.style.display = action === "show" ? "flex" : "none";
};
const setQuestion = () => {
  const {question, correct_answer, incorrect_answers} = questions[questionIndex - 1];
  const answers = [...incorrect_answers, correct_answer];
  $title.innerHTML = `Question ${questionIndex} of ${numOfQuestions}`;
  $question.innerHTML = question;
  $correctAnswer.innerHTML = correct_answer;
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
      if ($answer.innerHTML === $correctAnswer.innerHTML) {
        $answer.classList.add("correct");
      }
    });
    target.classList.add("incorrect");
  }
  questionIndex++;
  setTimeout(() => {
    target.classList.remove("incorrect");
    $answers.forEach(($answer) => $answer.classList.remove("correct"));
    if (questionIndex <= numOfQuestions) {
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
