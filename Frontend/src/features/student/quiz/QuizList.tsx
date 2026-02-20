import { Check, Clock, Star } from "lucide-react";
import { Quiz } from "./QuizTab";

interface QuizListProps {
  quizzes: Quiz[];
  onStartQuiz: (quiz: Quiz) => void;
}

export function QuizList({ quizzes, onStartQuiz }: QuizListProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold mb-2 text-gray-900">Knowledge Quizzes</h1>
        <p className="text-gray-600">Test your environmental knowledge and earn points!</p>
      </div>

      <div className="space-y-4">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 ${quiz.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <span className="text-xl">{quiz.icon}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{quiz.title}</h3>
                  {quiz.completed && (
                    <div className="w-6 h-6 bg-[#2ECC71] rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{quiz.description}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{quiz.questions} questions</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Star className="w-4 h-4" />
                    <span>{quiz.points} points</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                </div>
                
                {quiz.completed ? (
                  <div className="text-center py-3">
                    <span className="text-gray-500 font-medium">Completed ✓</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onStartQuiz(quiz)}
                    className="w-full bg-[#2ECC71] text-white py-3 rounded-xl font-medium hover:bg-[#27AE60] transition-colors text-center"
                  >
                    Start Quiz
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}