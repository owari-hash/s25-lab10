import React, { useState } from "react";
import "./Quiz.css";
import QuizQuestion from "../core/QuizQuestion";
import quizData from "../data/quizData";

interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  score: number;
}

const Quiz: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    questions: quizData,
    currentQuestionIndex: 0,
    selectedAnswer: null,
    score: 0,
  });

  const handleOptionSelect = (option: string): void => {
    setState((prevState) => ({ ...prevState, selectedAnswer: option }));
  };

  const hasNextQuestion = (): boolean => {
    return state.currentQuestionIndex < state.questions.length - 1;
  };

  const handleButtonClick = (): void => {
    const { selectedAnswer, questions, currentQuestionIndex, score } = state;
    const currentQuestion = questions[currentQuestionIndex];

    if (!selectedAnswer) {
      alert("Please select an answer before proceeding");
      return;
    }

    const isCorrect = currentQuestion.correctAnswer === selectedAnswer;
    const newScore = isCorrect ? score + 1 : score;

    setState((prevState) => ({
      ...prevState,
      currentQuestionIndex: prevState.currentQuestionIndex + 1,
      selectedAnswer: null,
      score: newScore,
    }));
  };

  const resetQuiz = (): void => {
    setState({
      questions: quizData,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      score: 0,
    });
  };

  const { questions, currentQuestionIndex, selectedAnswer, score } = state;
  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div>
        <h2>Quiz Completed</h2>
        <p>
          Final Score: {score} out of {questions.length}
        </p>
        <button onClick={resetQuiz}>Try Again</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Quiz Question:</h2>
      <p>{currentQuestion.question}</p>

      <h3>Answer Options:</h3>
      <ul>
        {currentQuestion.options.map((option) => (
          <li
            key={option}
            onClick={() => handleOptionSelect(option)}
            className={selectedAnswer === option ? "selected" : ""}
          >
            {option}
          </li>
        ))}
      </ul>

      <h3>Selected Answer:</h3>
      <p>{selectedAnswer ?? "No answer selected"}</p>

      <button onClick={handleButtonClick}>
        {hasNextQuestion() ? "Next Question" : "Submit"}
      </button>
    </div>
  );
};

export default Quiz;
