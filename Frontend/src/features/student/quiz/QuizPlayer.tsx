import { useState, useEffect } from "react";
import { ArrowLeft, Check, X } from "lucide-react";
import { Quiz, Question } from "./QuizTab";
import { QuizResults } from "./QuizResults";

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: () => void;
  onBackToQuizzes: () => void;
  showResults: boolean;
}

export function QuizPlayer({
  quiz,
  onComplete,
  onBackToQuizzes,
  showResults,
}: QuizPlayerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    number[]
  >([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);

  // Sample questions - in a real app, these would come from an API
  const questions: Question[] = [
    {
      id: "1",
      question:
        "What percentage of Earth's water is freshwater?",
      options: ["97%", "71%", "3%", "50%"],
      correctAnswer: 2,
      explanation:
        "Only about 3% of Earth's water is freshwater, and most of that is frozen in ice caps and glaciers. Of the 3% that is freshwater, only about 1% is accessible for human use. The rest is in ice caps, glaciers, and underground aquifers. This makes freshwater conservation extremely important for our planet's future.",
    },
    {
      id: "2",
      question: "Which household activity uses the most water?",
      options: [
        "Showering",
        "Washing dishes",
        "Laundry",
        "Toilet flushing",
      ],
      correctAnswer: 0,
      explanation:
        "Showering typically uses the most water in households, accounting for about 17% of indoor water use. An average shower uses 2.5 gallons per minute, so a 10-minute shower uses 25 gallons! You can save water by taking shorter showers, installing low-flow showerheads, and turning off water while soaping up.",
    },
    {
      id: "3",
      question:
        "How much water can a leaky faucet waste per day?",
      options: [
        "1 gallon",
        "5 gallons",
        "20 gallons",
        "50 gallons",
      ],
      correctAnswer: 2,
      explanation:
        "A single leaky faucet can waste over 20 gallons of water per day, which adds up to over 7,000 gallons per year! That's enough water for 180 showers. Even a slow drip (1 drip per second) wastes over 5 gallons per day. Fixing leaks quickly is one of the easiest ways to conserve water and save money.",
    },
    {
      id: "4",
      question: "What is greywater?",
      options: [
        "Polluted river water",
        "Rainwater",
        "Used water from sinks and showers",
        "Industrial wastewater",
      ],
      correctAnswer: 2,
      explanation:
        "Greywater is gently used water from bathroom sinks, showers, tubs, and washing machines that can be recycled for irrigation and other non-potable uses. Unlike blackwater (from toilets), greywater contains minimal contamination and can be treated and reused. Using greywater systems can reduce household water consumption by 50-70%!",
    },
    {
      id: "5",
      question:
        "Which irrigation method is most water-efficient?",
      options: [
        "Sprinkler irrigation",
        "Flood irrigation",
        "Drip irrigation",
        "Manual watering",
      ],
      correctAnswer: 2,
      explanation:
        "Drip irrigation is the most water-efficient method, delivering water directly to plant roots with minimal waste. It can be 90% efficient compared to 60-70% for sprinklers and only 40-50% for flood irrigation. Drip systems reduce evaporation, prevent weed growth, and can reduce water usage by 30-50% while often improving crop yields.",
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (!isAnswered && timeLeft > 0) {
      const timer = setTimeout(
        () => setTimeLeft(timeLeft - 1),
        1000,
      );
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleTimeUp();
    }
  }, [timeLeft, isAnswered]);

  const handleTimeUp = () => {
    setIsAnswered(true);
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = -1; // -1 indicates no answer/timeout
    setSelectedAnswers(newAnswers);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;

    setIsAnswered(true);
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(30);
      setIsAnswered(false);
    } else {
      onComplete();
    }
  };

  const getScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return (
        score +
        (answer === questions[index].correctAnswer ? 1 : 0)
      );
    }, 0);
  };

  if (showResults) {
    return (
      <QuizResults
        quiz={quiz}
        questions={questions}
        selectedAnswers={selectedAnswers}
        score={getScore()}
        onBackToQuizzes={onBackToQuizzes}
      />
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
            Question {currentQuestionIndex + 1} of{" "}
            {questions.length}
          </p>
        </div>
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
            timeLeft <= 10 ? "bg-red-500" : "bg-[#2ECC71]"
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
          <h3 className="text-lg font-medium mb-4">
            {currentQuestion.question}
          </h3>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected =
                selectedAnswers[currentQuestionIndex] === index;
              const isCorrect =
                index === currentQuestion.correctAnswer;
              const showAnswer = isAnswered;

              let buttonClass =
                "w-full p-4 text-left rounded-xl border-2 transition-all ";

              if (!showAnswer) {
                buttonClass +=
                  "border-gray-200 hover:border-[#2ECC71] hover:bg-[#2ECC71]/5";
              } else if (isCorrect) {
                buttonClass +=
                  "border-green-500 bg-green-50 text-green-800";
              } else if (isSelected && !isCorrect) {
                buttonClass +=
                  "border-red-500 bg-red-50 text-red-800";
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
                    {showAnswer && isCorrect && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                    {showAnswer && isSelected && !isCorrect && (
                      <X className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation */}
        {isAnswered && (
          <div className="bg-blue-50 rounded-xl p-5 mb-4 border border-blue-200">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-blue-600 text-sm">
                  💡
                </span>
              </div>
              <h4 className="font-medium text-blue-900">
                Explanation
              </h4>
            </div>
            <p className="text-blue-800 text-sm leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Next Button */}
        {isAnswered && (
          <div className="flex flex-col items-center space-y-3 mt-6">
            <button
              onClick={handleNextQuestion}
              className="w-full max-w-xs bg-[#2ECC71] text-white py-4 px-6 rounded-xl font-medium hover:bg-[#27AE60] transition-colors flex items-center justify-center"
            >
              {currentQuestionIndex < questions.length - 1
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