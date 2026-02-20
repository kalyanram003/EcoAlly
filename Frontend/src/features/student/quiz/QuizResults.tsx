import { Trophy, Star, RotateCcw, Home } from "lucide-react";
import { Quiz, Question } from "./QuizTab";

interface QuizResultsProps {
  quiz: Quiz;
  questions: Question[];
  selectedAnswers: number[];
  score: number;
  onBackToQuizzes: () => void;
}

export function QuizResults({ quiz, questions, selectedAnswers, score, onBackToQuizzes }: QuizResultsProps) {
  const percentage = Math.round((score / questions.length) * 100);
  const pointsEarned = Math.round((score / questions.length) * quiz.points);
  
  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: "Excellent! You're an eco expert!", emoji: "🏆", color: "text-yellow-600" };
    if (percentage >= 70) return { message: "Great job! Keep learning!", emoji: "🌟", color: "text-blue-600" };
    if (percentage >= 50) return { message: "Good effort! Room for improvement!", emoji: "👍", color: "text-green-600" };
    return { message: "Keep practicing! You'll get better!", emoji: "💪", color: "text-purple-600" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-[#2ECC71]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">{performance.emoji}</span>
        </div>
        <h1 className="text-2xl font-semibold mb-2">Quiz Complete!</h1>
        <h2 className="text-lg font-medium text-gray-700 mb-2">{quiz.title}</h2>
        <p className={`${performance.color} font-medium`}>{performance.message}</p>
      </div>

      {/* Score Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-[#2ECC71] mb-2">
            {score}/{questions.length}
          </div>
          <div className="text-2xl font-semibold text-gray-700 mb-1">
            {percentage}%
          </div>
          <p className="text-gray-500">Correct Answers</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-semibold">{pointsEarned}</span>
            </div>
            <p className="text-sm text-gray-500">Points Earned</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="w-4 h-4 text-[#2ECC71]" />
              <span className="font-semibold">{Math.round(percentage/10)}/10</span>
            </div>
            <p className="text-sm text-gray-500">Performance</p>
          </div>
        </div>
      </div>

      {/* Question Review */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 flex-1 overflow-y-auto">
        <h3 className="font-semibold mb-4">Question Review</h3>
        <div className="space-y-3">
          {questions.map((question, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            const wasAnswered = userAnswer !== -1;
            
            return (
              <div key={question.id} className="border-l-4 pl-3 py-2 border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium flex-1 pr-2">
                    {index + 1}. {question.question}
                  </p>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCorrect ? 'bg-green-100' : wasAnswered ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    {isCorrect ? (
                      <span className="text-green-600 text-sm">✓</span>
                    ) : wasAnswered ? (
                      <span className="text-red-600 text-sm">✗</span>
                    ) : (
                      <span className="text-gray-500 text-sm">−</span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  <p>Correct: {question.options[question.correctAnswer]}</p>
                  {wasAnswered && userAnswer !== question.correctAnswer && (
                    <p className="text-red-600">Your answer: {question.options[userAnswer]}</p>
                  )}
                  {!wasAnswered && (
                    <p className="text-gray-500">Not answered (time up)</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onBackToQuizzes}
          className="w-full bg-[#2ECC71] text-white py-4 rounded-xl font-medium hover:bg-[#27AE60] transition-colors flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          Back to Quizzes
        </button>
        
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Retake Quiz
        </button>
      </div>
    </div>
  );
}