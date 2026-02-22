import { useState, useEffect } from "react";
import * as api from "../../../lib/api";
import { QuizList } from "./QuizList";
import { QuizPlayer } from "./QuizPlayer";

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: number;
  points: number;
  difficulty: "Easy" | "Medium" | "Hard";
  completed: boolean;
  icon: string;
  color: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export function QuizTab() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [lastResult, setLastResult] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    Promise.all([api.getQuizzes(), api.getMyAttempts()])
      .then(([quizData, attemptsData]) => {
        const completedQuizIds = new Set(
          attemptsData
            .filter((a: any) => a.score >= 50) // Or whatever completion logic you need
            .map((a: any) => a.quizId)
        );

        const mapped: Quiz[] = quizData.map((q: any) => ({
          id: q.id,
          title: q.title,
          description: q.description ?? "",
          questions: Array.isArray(q.questions) ? q.questions.length : (q.questions ?? 0),
          points:
            q.difficulty === "EASY" ? 50 : q.difficulty === "MEDIUM" ? 100 : 150,
          difficulty: (q.difficulty
            ? q.difficulty.charAt(0) + q.difficulty.slice(1).toLowerCase()
            : "Easy") as "Easy" | "Medium" | "Hard",
          completed: completedQuizIds.has(q.id),
          icon: "🌿",
          color: "bg-green-100",
        }));
        setQuizzes(mapped);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStartQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setLastResult(null);
    setShowResults(false);
  };

  const handleQuizComplete = (result: any) => {
    setLastResult(result);
    setShowResults(true);
  };

  const handleBackToQuizzes = () => {
    setCurrentQuiz(null);
    setShowResults(false);
    setLastResult(null);
  };

  if (currentQuiz) {
    return (
      <QuizPlayer
        quiz={currentQuiz}
        onComplete={handleQuizComplete}
        onBackToQuizzes={handleBackToQuizzes}
        showResults={showResults}
        lastResult={lastResult}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        Loading quizzes…
      </div>
    );
  }

  return <QuizList quizzes={quizzes} onStartQuiz={handleStartQuiz} />;
}