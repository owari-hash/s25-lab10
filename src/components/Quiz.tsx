import React, { useState } from "react";
import "./Quiz.css";
import QuizQuestion from "../core/QuizQuestion";
import quizData from "../data/quizData";

interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  score: number;
  answerHistory: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}

const Quiz: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    questions: quizData,
    currentQuestionIndex: 0,
    selectedAnswer: null,
    score: 0,
    answerHistory: [],
  });

  const handleOptionSelect = (option: string): void => {
    setState((prevState) => {
      // Update existing answer if already answered
      if (prevState.answerHistory[prevState.currentQuestionIndex]) {
        const newAnswerHistory = [...prevState.answerHistory];
        const currentAnswer = newAnswerHistory[prevState.currentQuestionIndex];
        const isCorrect =
          prevState.questions[prevState.currentQuestionIndex].correctAnswer ===
          option;

        // Update score based on answer change
        const oldScore = currentAnswer.isCorrect
          ? prevState.score - 1
          : prevState.score;
        const newScore = isCorrect ? oldScore + 1 : oldScore;

        newAnswerHistory[prevState.currentQuestionIndex] = {
          ...currentAnswer,
          userAnswer: option,
          isCorrect,
        };

        return {
          ...prevState,
          selectedAnswer: option,
          score: newScore,
          answerHistory: newAnswerHistory,
        };
      }

      // Just update selected answer if question hasn't been answered yet
      return {
        ...prevState,
        selectedAnswer: option,
      };
    });
  };

  const hasNextQuestion = (): boolean => {
    return state.currentQuestionIndex < state.questions.length - 1;
  };

  const handleButtonClick = (): void => {
    const {
      selectedAnswer,
      questions,
      currentQuestionIndex,
      score,
      answerHistory,
    } = state;
    const currentQuestion = questions[currentQuestionIndex];

    if (!selectedAnswer) {
      alert("Please select an answer before proceeding");
      return;
    }

    // Only record answer if we haven't answered this question before
    let newAnswerHistory = [...answerHistory];
    if (currentQuestionIndex >= answerHistory.length) {
      const isCorrect = currentQuestion.correctAnswer === selectedAnswer;
      const newScore = isCorrect ? score + 1 : score;

      newAnswerHistory.push({
        question: currentQuestion.question,
        userAnswer: selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect,
      });

      setState((prevState) => ({
        ...prevState,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        selectedAnswer: null,
        score: newScore,
        answerHistory: newAnswerHistory,
      }));
    } else {
      // Just move to next question if already answered
      setState((prevState) => ({
        ...prevState,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        selectedAnswer: null,
      }));
    }
  };

  const handlePrevButton = (): void => {
    setState((prevState) => ({
      ...prevState,
      currentQuestionIndex: Math.max(0, prevState.currentQuestionIndex - 1),
      selectedAnswer:
        prevState.answerHistory[prevState.currentQuestionIndex - 1]
          ?.userAnswer || null,
    }));
  };

  const resetQuiz = (): void => {
    setState({
      questions: quizData,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      score: 0,
      answerHistory: [],
    });
  };

  const { questions, currentQuestionIndex, selectedAnswer, score } = state;
  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className="quiz-completed">
        <h2>Quiz Completed</h2>
        <p className="final-score">
          Final Score: {score} out of {questions.length}
        </p>

        <div className="results-container">
          <h3>Detailed Results:</h3>
          {state.answerHistory.map((result, index) => (
            <div
              key={index}
              className={`result-item ${result.isCorrect ? "correct" : "incorrect"}`}
            >
              <p className="question">
                Q{index + 1}: {result.question}
              </p>
              <p className="user-answer">Your answer: {result.userAnswer}</p>
              <p className="correct-answer">
                Correct answer: {result.correctAnswer}
              </p>
            </div>
          ))}
        </div>

        <button onClick={resetQuiz}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2>
        Quiz Question {currentQuestionIndex + 1} of {questions.length}
      </h2>
      <p>{currentQuestion.question}</p>

      <h3>Answer Options:</h3>
      <ul className="options-list">
        {currentQuestion.options.map((option) => (
          <li
            key={option}
            onClick={() => handleOptionSelect(option)}
            className={`option-item ${
              selectedAnswer === option ||
              state.answerHistory[currentQuestionIndex]?.userAnswer === option
                ? "selected"
                : ""
            }`}
          >
            {option}
          </li>
        ))}
      </ul>

      <div className="button-container">
        {currentQuestionIndex > 0 && (
          <button onClick={handlePrevButton}>Previous</button>
        )}
        <button onClick={handleButtonClick}>
          {hasNextQuestion() ? "Next Question" : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
