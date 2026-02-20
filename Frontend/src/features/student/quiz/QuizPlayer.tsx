import { useState, useEffect } from "react";
import { ArrowLeft, Check, X } from "lucide-react";
import * as api from "../../../lib/api";
import { Quiz, Question } from "./QuizTab";
import { QuizResults } from "./QuizResults";

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: (result: any) => void;
  onBackToQuizzes: () => void;
  showResults: boolean;
  lastResult: any;
}

export function QuizPlayer({
  quiz,
  onComplete,
  onBackToQuizzes,
  showResults,
  lastResult,
}: QuizPlayerProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // keyed by string index so we can pass directly to submitQuiz
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [startTime] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false);

  // Fetch questions for this quiz from the backend on mount
  useEffect(() => {
    setLoadingQuestions(true);
    api
      .getQuiz(quiz.id)
      .then((data) => {
        // backend field: "text"; frontend expects: "question"
        const mapped: Question[] = (data.questions ?? []).map((q: any) => ({
          id: q._id ?? q.id ?? String(Math.random()),
          question: q.text ?? q.question ?? "",
          options: q.options ?? [],
          // correctAnswer is stripped to -1 for students until after submit
          correctAnswer: q.correctAnswer ?? -1,
          explanation: q.explanation ?? "",
        }));
        setQuestions(mapped);
      })
      .finally(() => setLoadingQuestions(false));
  }, [quiz.id]);

  const currentQuestion = questions[currentQuestionIndex];

  // Countdown timer
  useEffect(() => {
    if (loadingQuestions || showResults) return;
    if (!isAnswered && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleTimeUp();
    }
  }, [timeLeft, isAnswered, loadingQuestions, showResults]);

  const handleTimeUp = () => {
    setIsAnswered(true);
    setAnswers((prev) => ({ ...prev, [String(currentQuestionIndex)]: -1 }));
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setAnswers((prev) => ({ ...prev, [String(currentQuestionIndex)]: answerIndex }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      setTimeLeft(30);
      setIsAnswered(false);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    setSubmitting(true);
    try {
      const result = await api.submitQuiz(quiz.id, answers, timeTaken);
      onComplete(result);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Derive correct answers from submit result for results screen ──────────
  // lastResult.questions contains correctAnswer filled in by the backend
  const resultQuestions: Question[] = lastResult?.questions
    ? lastResult.questions.map((q: any) => ({
      id: q._id ?? q.id,
      question: q.text ?? q.question ?? "",
      options: q.options ?? [],
      correctAnswer: q.correctAnswer ?? -1,
      explanation: q.explanation ?? "",
    }))
    : questions;

  const selectedAnswers: number[] = questions.map(
    (_q, i) => answers[String(i)] ?? -1
  );

  const score =
    lastResult?.attempt?.correctAnswers ??
    selectedAnswers.reduce(
      (acc, answer, idx) =>
        acc + (answer === resultQuestions[idx]?.correctAnswer ? 1 : 0),
      0
    );

  if (showResults) {
    return (
      <QuizResults
        quiz={quiz}
        questions={resultQuestions}
        selectedAnswers={selectedAnswers}
        score={score}
        onBackToQuizzes={onBackToQuizzes}
      />
    );
  }

  if (loadingQuestions) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        Loading questions…
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        No questions found for this quiz.
      </div>
    );
  }

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToQuizzes}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="font-semibold">{quiz.title}</h2>
          <p className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${timeLeft <= 10 ? "bg-red-500" : "bg-[#2ECC71]"
            }`}
        >
          {timeLeft}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-[#2ECC71] h-2 rounded-full transition-all duration-300"
          style={{
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const selected = answers[String(currentQuestionIndex)] === index;
              // correctAnswer is -1 before submit; after time-up we just show selection
              const isCorrect =
                isAnswered &&
                currentQuestion.correctAnswer >= 0 &&
                index === currentQuestion.correctAnswer;

              let buttonClass =
                "w-full p-4 text-left rounded-xl border-2 transition-all ";
              if (!isAnswered) {
                buttonClass +=
                  "border-gray-200 hover:border-[#2ECC71] hover:bg-[#2ECC71]/5";
              } else if (isCorrect) {
                buttonClass += "border-green-500 bg-green-50 text-green-800";
              } else if (selected && !isCorrect) {
                buttonClass += "border-red-500 bg-red-50 text-red-800";
              } else {
                buttonClass += "border-gray-200 bg-gray-50";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {isAnswered && isCorrect && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                    {isAnswered && selected && !isCorrect && (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation (only if correctAnswer is known) */}
        {isAnswered && currentQuestion.explanation && (
          <div className="bg-blue-50 rounded-xl p-5 mb-4 border border-blue-200">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-blue-600 text-sm">💡</span>
              </div>
              <h4 className="font-medium text-blue-900">Explanation</h4>
            </div>
            <p className="text-blue-800 text-sm leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Next / Submit */}
        {isAnswered && (
          <div className="flex flex-col items-center space-y-3 mt-6">
            <button
              onClick={handleNextQuestion}
              disabled={submitting}
              className="w-full max-w-xs bg-[#2ECC71] text-white py-4 px-6 rounded-xl font-medium hover:bg-[#27AE60] transition-colors flex items-center justify-center"
            >
              {submitting
                ? "Submitting…"
                : currentQuestionIndex < questions.length - 1
                  ? "Next Question →"
                  : "See Results 🏆"}
            </button>
            <p className="text-sm text-gray-500 text-center">
              {currentQuestionIndex < questions.length - 1
                ? `${questions.length - currentQuestionIndex - 1} questions remaining`
                : "You've completed all questions!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}