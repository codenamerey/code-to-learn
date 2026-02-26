"use client";

import { useState, useEffect } from "react";
import { Check, X, RotateCcw, Trophy } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple_choice" | "true_false" | "fill_blank" | "matching";
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points?: number;
}

interface QuizData {
  questions: QuizQuestion[];
  passingScore?: number;
  timeLimit?: number;
  shuffleQuestions?: boolean;
  showExplanations?: boolean;
}

interface QuizProps {
  quizData: QuizData;
  onComplete?: (score: number, passed: boolean) => void;
}

export function Quiz({ quizData, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const questions = quizData.questions;
  const passingScore = quizData.passingScore ?? 70;

  useEffect(() => {
    setCurrentQuestion(0);
    setAnswers({});
    setSubmitted(false);
    setShowExplanation(null);
    setTimeRemaining(quizData.timeLimit ? quizData.timeLimit * 60 : null);
  }, [quizData]);

  useEffect(() => {
    if (quizData.timeLimit && !submitted) {
      setTimeRemaining(quizData.timeLimit * 60);
    }
  }, [quizData.timeLimit, submitted]);

  useEffect(() => {
    if (timeRemaining === null || submitted) return;
    if (timeRemaining <= 0) {
      handleSubmit();
      return;
    }
    const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeRemaining, submitted]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleMultiAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => {
      const current = (prev[questionId] as string[]) || [];
      const updated = current.includes(answer)
        ? current.filter((a) => a !== answer)
        : [...current, answer];
      return { ...prev, [questionId]: updated };
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = calculateScore();
    const passed = score >= passingScore;
    onComplete?.(score, passed);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      const userAnswer = answers[q.id];
      if (Array.isArray(q.correctAnswer)) {
        const userAnswers = Array.isArray(userAnswer)
          ? userAnswer
          : [userAnswer];
        if (
          JSON.stringify(userAnswers.sort()) ===
          JSON.stringify(q.correctAnswer.sort())
        ) {
          correct++;
        }
      } else {
        if (userAnswer === q.correctAnswer) {
          correct++;
        }
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const isCorrect = (question: QuizQuestion) => {
    const userAnswer = answers[question.id];
    if (Array.isArray(question.correctAnswer)) {
      const userAnswers = Array.isArray(userAnswer) ? userAnswer : [];
      return (
        JSON.stringify(userAnswers.sort()) ===
        JSON.stringify(question.correctAnswer.sort())
      );
    }
    return userAnswer === question.correctAnswer;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (submitted) {
    const score = calculateScore();
    const passed = score >= passingScore;

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-8">
        <div
          className={`p-4 rounded-full mb-4 ${
            passed ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {passed ? (
            <Trophy className="h-12 w-12 text-green-600" />
          ) : (
            <X className="h-12 w-12 text-red-600" />
          )}
        </div>
        <h2 className="text-2xl font-bold mb-2">
          {passed ? "Congratulations!" : "Keep Practicing!"}
        </h2>
        <p className="text-lg mb-4">
          You scored <strong>{score}%</strong> ({passingScore}% needed to pass)
        </p>
        <div className="w-full max-w-2xl space-y-4">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className={`p-4 rounded-lg border ${
                isCorrect(q)
                  ? "border-green-300 bg-green-50"
                  : "border-red-300 bg-red-50"
              }`}
            >
              <div className="flex items-start gap-2">
                {isCorrect(q) ? (
                  <Check className="text-green-600 shrink-0 mt-1" size={20} />
                ) : (
                  <X className="text-red-600 shrink-0 mt-1" size={20} />
                )}
                <div>
                  <p className="font-medium">
                    Q{idx + 1}: {q.question}
                  </p>
                  <p className="text-sm mt-1">
                    <span className="text-gray-600">Your answer: </span>
                    <span
                      className={
                        isCorrect(q) ? "text-green-600" : "text-red-600"
                      }
                    >
                      {Array.isArray(answers[q.id])
                        ? (answers[q.id] as string[]).join(", ")
                        : answers[q.id] || "No answer"}
                    </span>
                  </p>
                  {!isCorrect(q) && (
                    <p className="text-sm">
                      <span className="text-gray-600">Correct answer: </span>
                      <span className="text-green-600">
                        {Array.isArray(q.correctAnswer)
                          ? q.correctAnswer.join(", ")
                          : q.correctAnswer}
                      </span>
                    </p>
                  )}
                  {q.explanation && quizData.showExplanations && (
                    <p className="text-sm text-gray-600 mt-2 italic">
                      {q.explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            setSubmitted(false);
            setAnswers({});
            setCurrentQuestion(0);
            setTimeRemaining(
              quizData.timeLimit ? quizData.timeLimit * 60 : null,
            );
          }}
          className="mt-6 px-6 py-2 bg-[#0995BC] text-white rounded-md hover:bg-[#0880A8] flex items-center gap-2"
        >
          <RotateCcw size={18} />
          Try Again
        </button>
      </div>
    );
  }
  console.log("questions", questions);
  const question = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto flex flex-col justify-center min-h-[60vh]">
      {timeRemaining !== null && (
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span
            className={`font-mono text-lg ${
              timeRemaining < 60 ? "text-red-600" : "text-gray-600"
            }`}
          >
            {formatTime(timeRemaining)}
          </span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">{question.question}</h3>

        {question.type === "multiple_choice" && question.options && (
          <div className="space-y-2">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(question.id, option)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  answers[question.id] === option
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                    : "border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <span className="font-medium mr-2">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {option}
              </button>
            ))}
          </div>
        )}

        {question.type === "true_false" && (
          <div className="flex gap-4">
            {["True", "False"].map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(question.id, option)}
                className={`flex-1 p-3 rounded-lg border transition-colors ${
                  answers[question.id] === option
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                    : "border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {question.type === "fill_blank" && (
          <input
            type="text"
            value={(answers[question.id] as string) || ""}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder="Type your answer..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        {question.type === "matching" && question.options && (
          <div className="space-y-2">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleMultiAnswer(question.id, option)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  Array.isArray(answers[question.id]) &&
                  (answers[question.id] as string[]).includes(option)
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                    : "border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentQuestion < questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              disabled={!answers[question.id]}
              className="px-4 py-2 bg-[#0995BC] text-white rounded-md hover:bg-[#0880A8] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < questions.length}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentQuestion(idx)}
            className={`w-8 h-8 rounded-full text-sm font-medium ${
              currentQuestion === idx
                ? "bg-blue-600 text-white"
                : answers[questions[idx].id]
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
