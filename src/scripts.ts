import { Question } from './types';

const $loader: HTMLDivElement = document.querySelector('.loader');
const $startBtn: HTMLDivElement = document.querySelector('.start');
const $questionWrap: HTMLDivElement = document.querySelector('.questionWrap');
const $question: HTMLDivElement = document.querySelector('#question');
const $answerWrap: HTMLDivElement = document.querySelector('.answersWrap');
const $answers: any = document.querySelectorAll('.answer');
const $correctAnswer: HTMLSpanElement = document.querySelector('#correctAnswer');
const $title: HTMLElement = document.querySelector('.title');
const $startForm: HTMLDivElement = document.querySelector('.start-form');

// Form controls
const $numOfQuestions: HTMLInputElement = document.querySelector('#trivia_amount');
const $category: HTMLSelectElement = document.querySelector('[name="trivia_category"]');
const $difficulty: HTMLSelectElement = document.querySelector('[name="trivia_difficulty"]');

// Globals
let questions: Question[] = [];
let questionIndex: number;
let score = 0;
let numOfQuestions: number;

const initGame = (e: MouseEvent) => {
  e.preventDefault();

  // Build URL string with questions
  numOfQuestions = +$numOfQuestions.value;
  const categoryOption = +$category.value > 0 ? `&category=${$category.value}` : '';
  const difficultyOption = $difficulty.value !== 'any' ? `&difficulty=${$difficulty.value}` : '';
  const url = `https://opentdb.com/api.php?amount=${numOfQuestions}${categoryOption}${difficultyOption}`;

  if (+$numOfQuestions.value > 0 && +$numOfQuestions.value <= 50) {
    questionIndex = 1;
    score = 0;
    showHideQuestion('show');
    getQuestionsFromApi(url).then((response) => {
      $loader.style.display = 'none';
      questions = response;
      setQuestion();
    });
  }
};

const getQuestionsFromApi = async (url: string): Promise<Question[]> => {
  const response = await fetch(url);
  // const response = await fetch(`./questions.json`);
  const data = await response.json().then((data) => data.results);
  return data;
};

const showHideQuestion = (action?: 'show') => {
  $startForm.style.display = action === 'show' ? 'none' : 'block';
  $loader.style.display = action === 'show' ? 'flex' : 'none';
  $startBtn.style.display = action === 'show' ? 'none' : 'block';
  $questionWrap.style.display = action === 'show' ? 'block' : 'none';
  $answerWrap.style.display = action === 'show' ? 'flex' : 'none';
};

const setQuestion = () => {
  const { question, correct_answer, incorrect_answers } = questions[
    questionIndex - 1
  ];
  const answers = [...incorrect_answers, correct_answer];
  $title.innerHTML = `Question ${questionIndex} of ${numOfQuestions}`;
  $question.innerHTML = question;
  $correctAnswer.innerHTML = correct_answer;

  // randomize answers order
  answers.sort(() => 0.5 - Math.random());

  answers.forEach((answer, index) => {
    $answers[index].style.display = 'block';
    $answers[index].innerHTML = answer;
    $answers[index].addEventListener('click', checkAnswer);
  });
};

const checkAnswer = ({ target }) => {
  // Remove event listeners so can't click another answer while checking
  $answers.forEach(($answer: HTMLDivElement) => {
    $answer.removeEventListener('click', checkAnswer);
  });

  const { correct_answer } = questions[questionIndex - 1];
  target.classList.add('correct');
  if (correct_answer === target.innerHTML) {
    score++;
  } else {
    $answers.forEach(($answer: HTMLDivElement) => {
      // Indicate correct answer
      if ($answer.innerHTML === $correctAnswer.innerHTML) {
        $answer.classList.add('correct');
      }
    });
    target.classList.add('incorrect');
  }
  questionIndex++;
  setTimeout(() => {
    // remove indicators
    target.classList.remove('incorrect');
    $answers.forEach(($answer: HTMLDivElement) =>
      $answer.classList.remove('correct')
    );
    // Check if there are more questions
    if (questionIndex <= numOfQuestions) {
      $answers.forEach(
        ($answer: HTMLDivElement) => ($answer.style.display = 'none')
      );
      setQuestion();
    } else {
      endGame();
    }
  }, 1000);
};

const endGame = () => {
  showHideQuestion();
  $title.innerHTML = `You got ${score} answers right!`;
  $startBtn.innerHTML = 'Play again';
};

$startBtn.addEventListener('click', initGame);
