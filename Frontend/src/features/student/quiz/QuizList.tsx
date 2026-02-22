import { motion, Variants } from "framer-motion";
import { Check, Clock, Star } from "lucide-react";
import { Quiz } from "./QuizTab";

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: "easeOut" } }
};

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
        return "bg-[var(--bark-100)] text-[var(--bark-800)]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
        <p className="text-gray-500 text-sm mt-1">Test your eco-knowledge and earn points</p>
      </div>

      {quizzes.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-[var(--border)] shadow-[var(--shadow-xs)] p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                  <div className="h-10 bg-gray-200 rounded-xl animate-pulse w-full mt-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {quizzes.map((quiz) => (
            <motion.div
              key={quiz.id}
              variants={item}
              whileHover={{ y: -3, boxShadow: "0 8px 30px rgba(0,0,0,0.09)" }}
              whileTap={{ scale: 0.985 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="bg-white rounded-2xl border border-[var(--border)] shadow-[var(--shadow-xs)] p-5 cursor-pointer"
              onClick={() => !quiz.completed && onStartQuiz(quiz)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${quiz.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <span className="text-xl">{quiz.icon}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{quiz.title}</h3>
                    {quiz.completed && (
                      <div className="w-6 h-6 bg-[var(--forest-500)] rounded-full flex items-center justify-center">
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
                      onClick={(e) => { e.stopPropagation(); onStartQuiz(quiz); }}
                      className="w-full bg-[var(--forest-600)] text-white py-3 rounded-xl font-medium hover:bg-[var(--forest-700)] transition-colors text-center"
                    >
                      Start Quiz
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}