import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, RotateCcw, Star } from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What should we say when we meet another Muslim?",
    options: ["Hello", "السلام عليكم (As-salamu alaikum)", "Good morning", "Hi there"],
    correctAnswer: 1,
    explanation: "As-salamu alaikum means 'Peace be upon you' and is the Islamic greeting."
  },
  {
    id: 2,
    question: "What should we say before eating?",
    options: ["Let's eat!", "بسم الله (Bismillah)", "I'm hungry", "Thank you"],
    correctAnswer: 1,
    explanation: "Bismillah means 'In the name of Allah' and we say it before eating."
  },
  {
    id: 3,
    question: "How should we treat our parents?",
    options: ["With disrespect", "Only when they're nice", "With love and respect always", "It doesn't matter"],
    correctAnswer: 2,
    explanation: "Islam teaches us to always respect and love our parents."
  },
  {
    id: 4,
    question: "What should we do when someone helps us?",
    options: ["Ignore them", "Say جزاك الله خيراً (Jazakallahu khairan)", "Just walk away", "Demand more help"],
    correctAnswer: 1,
    explanation: "Jazakallahu khairan means 'May Allah reward you with good' - it's how we thank someone."
  },
  {
    id: 5,
    question: "How should we enter the mosque?",
    options: ["Running and shouting", "Quietly and respectfully", "With our shoes on", "Making lots of noise"],
    correctAnswer: 1,
    explanation: "We should enter the mosque quietly and respectfully, it's Allah's house."
  },
  {
    id: 6,
    question: "What should we say when we sneeze?",
    options: ["Excuse me", "الحمد لله (Alhamdulillah)", "Nothing", "Sorry"],
    correctAnswer: 1,
    explanation: "Alhamdulillah means 'Praise be to Allah' and we say it when we sneeze."
  },
  {
    id: 7,
    question: "How should we treat animals?",
    options: ["With kindness and care", "We can hurt them", "They don't matter", "Only if they're pets"],
    correctAnswer: 0,
    explanation: "Islam teaches us to be kind to all of Allah's creatures, including animals."
  },
  {
    id: 8,
    question: "What should we say before sleeping?",
    options: ["Nothing", "Good night", "أعوذ بالله (A'udhu billah)", "See you tomorrow"],
    correctAnswer: 2,
    explanation: "We say prayers and seek Allah's protection before sleeping."
  },
  {
    id: 9,
    question: "How should we share with others?",
    options: ["Never share anything", "Only share what we don't want", "Share willingly and kindly", "Share only with family"],
    correctAnswer: 2,
    explanation: "Islam teaches us to be generous and share with others willingly."
  },
  {
    id: 10,
    question: "What should we do when we make a mistake?",
    options: ["Hide it and lie", "Blame someone else", "Say أستغفر الله (Astaghfirullah) and apologize", "Pretend it didn't happen"],
    correctAnswer: 2,
    explanation: "We should seek Allah's forgiveness and apologize when we make mistakes."
  }
];

export function QuizGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [questions] = useState(() => [...quizQuestions].sort(() => Math.random() - 0.5).slice(0, 5));
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveScoreMutation = useMutation({
    mutationFn: async (scoreData: any) => {
      return apiRequest("POST", "/api/scores", scoreData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scores"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      setShowExplanation(true);
    }, 1000);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowExplanation(false);
    } else {
      setGameCompleted(true);
      
      // Save score
      saveScoreMutation.mutate({
        userId: 1,
        gameType: "quiz",
        score: score,
        maxScore: questions.length,
        timeSpent: (currentQuestion + 1) * 30, // Estimated time per question
      });

      const percentage = (score / questions.length) * 100;
      toast({
        title: "Quiz Complete! 🎉",
        description: `You scored ${score}/${questions.length} (${percentage.toFixed(0)}%)`,
      });
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setShowExplanation(false);
    setGameCompleted(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return "Excellent! You're a true Islamic manner expert! 🌟";
    if (percentage >= 70) return "Great job! You know your Islamic manners well! 😊";
    if (percentage >= 50) return "Good effort! Keep learning about Islamic manners! 👍";
    return "Keep practicing! Every step in learning is blessed! 💝";
  };

  if (gameCompleted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white rounded-3xl shadow-xl p-8 border-t-4 border-teal-500 text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="text-white text-4xl" size={48} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
            <p className="text-xl text-teal-600 mb-4">Final Score: {score}/{questions.length}</p>
            <p className="text-gray-600 mb-6">{getScoreMessage()}</p>
          </div>
          
          <div className="bg-teal-50 rounded-2xl p-4 mb-6">
            <h3 className="font-semibold text-teal-800 mb-2">Remember:</h3>
            <p className="text-teal-700 text-sm">
              Every act of good manners is a form of charity (sadaqah) in Islam. 
              Keep practicing these beautiful teachings!
            </p>
          </div>
          
          <Button onClick={resetQuiz} className="bg-teal-500 hover:bg-teal-600 text-white">
            <RotateCcw className="mr-2" size={16} />
            Play Again
          </Button>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white rounded-3xl shadow-xl p-8 border-t-4 border-teal-500">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Islamic Manners Quiz</h2>
            <div className="text-sm text-gray-500">
              {currentQuestion + 1} of {questions.length}
            </div>
          </div>
          <Progress value={progress} className="mb-4" />
          <div className="text-right text-sm text-gray-600">
            Score: {score}/{questions.length}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">{question.question}</h3>
          
          <div className="space-y-3">
            {question.options.map((option, index) => {
              let buttonClass = "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ";
              
              if (showResult) {
                if (index === question.correctAnswer) {
                  buttonClass += "bg-green-100 border-green-500 text-green-800";
                } else if (index === selectedAnswer && index !== question.correctAnswer) {
                  buttonClass += "bg-red-100 border-red-500 text-red-800";
                } else {
                  buttonClass += "bg-gray-100 border-gray-300 text-gray-600";
                }
              } else {
                buttonClass += selectedAnswer === index 
                  ? "bg-blue-100 border-blue-500 text-blue-800"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-800";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  className={buttonClass}
                >
                  <div className="flex items-center">
                    {showResult && index === question.correctAnswer && (
                      <CheckCircle className="mr-3 text-green-600" size={20} />
                    )}
                    {showResult && index === selectedAnswer && index !== question.correctAnswer && (
                      <XCircle className="mr-3 text-red-600" size={20} />
                    )}
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {showExplanation && (
          <div className="mb-6 bg-blue-50 rounded-2xl p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Did you know?</h4>
            <p className="text-blue-700 text-sm">{question.explanation}</p>
          </div>
        )}

        {showExplanation && (
          <div className="text-center">
            <Button onClick={handleNextQuestion} className="bg-teal-500 hover:bg-teal-600 text-white">
              {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
