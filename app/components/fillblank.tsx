"use client";

import { useState, useEffect } from "react";
import { Check, X, RotateCcw, Trophy } from "lucide-react";

interface Blank {
  id: string;
  label: string;
  answer: string;
}

interface FillBlankQuestion {
  id: string;
  text: string;
  blanks: Blank[];
  explanation?: string;
}

interface FillBlankData {
  type: "fill_blank";
  questions: FillBlankQuestion[];
  passingScore?: number;
  showExplanations?: boolean;
}

interface FillBlankProps {
  data: FillBlankData;
  onComplete?: (score: number, passed: boolean) => void;
}

type Answers = Record<string, Record<string, string>>;

function renderText(text: string, blanks: Blank[], questionId: string, answers: Answers, submitted: boolean, onChange: (blankId: string, value: string) => void) {
  const parts = text.split("___");
  return (
    <span>
      {parts.map((part, i) => {
        const blank = blanks[i];
        const value = answers[questionId]?.[blank?.id] ?? "";
        const correct = blank && submitted ? value.trim() === blank.answer.trim() : null;
        return (
          <span key={i}>
            {part}
            {blank && (
              <span className="inline-flex items-center gap-1 mx-1">
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(blank.id, e.target.value)}
                  disabled={submitted}
                  placeholder={blank.label}
                  className={`w-16 text-center border-b-2 bg-transparent outline-none px-1 py-0.5 text-sm font-mono transition-colors ${
                    submitted
                      ? correct
                        ? "border-green-500 text-green-700 dark:text-green-300"
                        : "border-red-500 text-red-700 dark:text-red-300"
                      : "border-gray-400 focus:border-[#0995BC]"
                  }`}
                />
                {submitted && (
                  correct
                    ? <Check size={14} className="text-green-500 shrink-0" />
                    : <X size={14} className="text-red-500 shrink-0" />
                )}
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

export function FillBlank({ data, onComplete }: FillBlankProps) {
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const passingScore = data.passingScore ?? 70;

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
  }, [data]);

  const handleChange = (questionId: string, blankId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], [blankId]: value },
    }));
  };

  const allFilled = data.questions.every((q) =>
    q.blanks.every((b) => (answers[q.id]?.[b.id] ?? "").trim() !== "")
  );

  const calculateScore = () => {
    let correct = 0;
    let total = 0;
    data.questions.forEach((q) => {
      q.blanks.forEach((b) => {
        total++;
        if ((answers[q.id]?.[b.id] ?? "").trim() === b.answer.trim()) correct++;
      });
    });
    return total === 0 ? 0 : Math.round((correct / total) * 100);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = calculateScore();
    onComplete?.(score, score >= passingScore);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const score = submitted ? calculateScore() : null;
  const passed = score !== null && score >= passingScore;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 py-6">
      {submitted && (
        <div className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${passed ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800" : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"}`}>
          <div className={`p-3 rounded-full ${passed ? "bg-green-100 dark:bg-green-900/40" : "bg-red-100 dark:bg-red-900/40"}`}>
            {passed ? <Trophy className="h-8 w-8 text-green-600" /> : <X className="h-8 w-8 text-red-600" />}
          </div>
          <p className="font-semibold text-lg">{passed ? "Well done!" : "Keep practicing!"}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Score: <strong>{score}%</strong> ({passingScore}% to pass)</p>
        </div>
      )}

      {data.questions.map((q, qi) => (
        <div key={q.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Question {qi + 1}</p>
          <p className="text-base leading-loose">
            {renderText(q.text, q.blanks, q.id, answers, submitted, (blankId, value) => handleChange(q.id, blankId, value))}
          </p>
          {submitted && data.showExplanations && q.explanation && (
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 italic border-t border-gray-100 dark:border-gray-700 pt-3">
              {q.explanation}
            </p>
          )}
          {submitted && (
            <div className="mt-3 flex flex-wrap gap-2">
              {q.blanks.map((b) => {
                const val = (answers[q.id]?.[b.id] ?? "").trim();
                const correct = val === b.answer.trim();
                return !correct ? (
                  <span key={b.id} className="text-xs px-2 py-1 rounded bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 font-mono">
                    {b.label}: expected <strong>{b.answer}</strong>, got <strong>{val || "(empty)"}</strong>
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-end gap-3">
        {submitted ? (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2 bg-[#0995BC] text-white rounded-lg hover:bg-[#0880A8] text-sm font-medium"
          >
            <RotateCcw size={16} />
            Try Again
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allFilled}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
