import { useState } from "react";
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
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [showResults, setShowResults] = useState(false);

  const quizzes: Quiz[] = [
    {
      id: "water-conservation",
      title: "Water Conservation",
      description: "Learn about saving water in daily life",
      questions: 5,
      points: 50,
      difficulty: "Easy",
      completed: true,
      icon: "💧",
      color: "bg-blue-100"
    },
    {
      id: "waste-segregation", 
      title: "Waste Segregation",
      description: "Master the art of proper waste sorting",
      questions: 6,
      points: 80,
      difficulty: "Medium",
      completed: false,
      icon: "🗑️",
      color: "bg-green-100"
    },
    {
      id: "renewable-energy",
      title: "Renewable Energy",
      description: "Explore clean energy sources",
      questions: 8,
      points: 120,
      difficulty: "Hard",
      completed: false,
      icon: "⚡",
      color: "bg-yellow-100"
    },
    {
      id: "climate-change",
      title: "Climate Change",
      description: "Understanding global warming effects",
      questions: 7,
      points: 100,
      difficulty: "Medium",
      completed: false,
      icon: "🌍",
      color: "bg-purple-100"
    }
  ];

  const handleStartQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setShowResults(false);
  };

  const handleQuizComplete = () => {
    setShowResults(true);
  };

  const handleBackToQuizzes = () => {
    setCurrentQuiz(null);
    setShowResults(false);
  };

  if (currentQuiz) {
    return (
      <QuizPlayer
        quiz={currentQuiz}
        onComplete={handleQuizComplete}
        onBackToQuizzes={handleBackToQuizzes}
        showResults={showResults}
      />
    );
  }

  return (
    <QuizList
      quizzes={quizzes}
      onStartQuiz={handleStartQuiz}
    />
  );
}