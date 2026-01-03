import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Star, CheckCircle, ArrowRight, RotateCcw } from "lucide-react";

interface GreetingScenario {
  id: number;
  situation: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  arabicText: string;
  level: number;
}

const greetingScenarios: GreetingScenario[] = [
  {
    id: 1,
    situation: "Meeting a friend at school",
    question: "What should you say when you see your Muslim friend in the morning?",
    options: [
      "Hi there!",
      "السلام عليكم (As-salamu alaikum)",
      "Good morning",
      "Hey buddy!"
    ],
    correctAnswer: 1,
    explanation: "As-salamu alaikum means 'Peace be upon you' and is the beautiful Islamic greeting we use with everyone.",
    arabicText: "السلام عليكم",
    level: 1
  },
  {
    id: 2,
    situation: "Your friend greets you with Salam",
    question: "When someone says 'As-salamu alaikum' to you, what should you reply?",
    options: [
      "Thank you",
      "وعليكم السلام (Wa alaikumus salam)",
      "Same to you",
      "Hello back"
    ],
    correctAnswer: 1,
    explanation: "Wa alaikumus salam means 'And upon you peace' - it's how we respond to the Islamic greeting.",
    arabicText: "وعليكم السلام",
    level: 1
  },
  {
    id: 3,
    situation: "Meeting your teacher",
    question: "How should you greet your teacher respectfully?",
    options: [
      "Hey teacher!",
      "السلام عليكم (As-salamu alaikum)",
      "What's up?",
      "Morning!"
    ],
    correctAnswer: 1,
    explanation: "We use the same beautiful greeting for everyone - teachers, friends, and family. It shows respect to all.",
    arabicText: "السلام عليكم",
    level: 2
  },
  {
    id: 4,
    situation: "Entering your home",
    question: "What should you say when entering your house?",
    options: [
      "I'm home!",
      "السلام عليكم (As-salamu alaikum)",
      "Hello family",
      "Nothing special"
    ],
    correctAnswer: 1,
    explanation: "We greet our family with Salam when we come home, bringing peace and blessings to our house.",
    arabicText: "السلام عليكم",
    level: 2
  },
  {
    id: 5,
    situation: "Meeting an elder",
    question: "When greeting an older person, what's the most respectful way?",
    options: [
      "Hi there",
      "السلام عليكم ورحمة الله وبركاته (Full Salam)",
      "Hey",
      "Good day"
    ],
    correctAnswer: 1,
    explanation: "The complete Salam shows extra respect: 'Peace be upon you and Allah's mercy and blessings.'",
    arabicText: "السلام عليكم ورحمة الله وبركاته",
    level: 3
  }
];

export function GreetingGame() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProgressMutation = useMutation({
    mutationFn: async (progressData: any) => {
      return apiRequest("POST", "/api/progress", progressData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === greetingScenarios[currentLevel].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextLevel = () => {
    if (currentLevel < greetingScenarios.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameCompleted(true);
      
      // Calculate stars based on performance
      const percentage = (score / greetingScenarios.length) * 100;
      let stars = 1;
      if (percentage >= 80) stars = 3;
      else if (percentage >= 60) stars = 2;
      
      // Update progress
      updateProgressMutation.mutate({
        userId: 1,
        gameId: "greetings",
        levelsCompleted: greetingScenarios.length,
        totalLevels: 10,
        stars: stars,
        maxStars: 5,
      });

      toast({
        title: "Excellent work! 🎉",
        description: `You completed the greeting lessons and earned ${stars} stars!`,
      });
    }
  };

  const resetGame = () => {
    setCurrentLevel(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameCompleted(false);
  };

  if (gameCompleted) {
    const percentage = (score / greetingScenarios.length) * 100;
    let stars = 1;
    if (percentage >= 80) stars = 3;
    else if (percentage >= 60) stars = 2;

    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white rounded-3xl shadow-xl p-8 border-t-4 border-islamic-green text-center">
          <div className="mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-islamic-green to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-white text-4xl" size={48} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Mashaallah! Well Done!</h2>
            <p className="text-xl text-islamic-green mb-4">
              You've learned the beautiful art of Islamic greetings!
            </p>
            
            <div className="flex justify-center space-x-1 mb-4">
              {Array.from({ length: stars }, (_, i) => (
                <Star key={i} className="text-golden fill-golden" size={32} />
              ))}
            </div>
            
            <p className="text-gray-600 mb-6">
              Score: {score}/{greetingScenarios.length} ({percentage.toFixed(0)}%)
            </p>
          </div>
          
          <div className="bg-green-50 rounded-2xl p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">Remember:</h3>
            <p className="text-green-700 text-sm">
              The Prophet Muhammad (peace be upon him) said: "Spread the greeting of peace among you." 
              Keep using these beautiful greetings!
            </p>
          </div>
          
          <Button onClick={resetGame} className="bg-islamic-green hover:bg-green-600 text-white">
            <RotateCcw className="mr-2" size={16} />
            Practice Again
          </Button>
        </Card>
      </div>
    );
  }

  const scenario = greetingScenarios[currentLevel];
  const progress = ((currentLevel + 1) / greetingScenarios.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white rounded-3xl shadow-xl p-8 border-t-4 border-islamic-green">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Islamic Greetings</h2>
            <Badge className="bg-islamic-green text-white">
              Level {scenario.level}
            </Badge>
          </div>
          <Progress value={progress} className="mb-4" />
          <div className="text-right text-sm text-gray-600">
            Progress: {currentLevel + 1} of {greetingScenarios.length}
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-blue-50 rounded-2xl p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Situation:</h3>
            <p className="text-blue-700">{scenario.situation}</p>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-6">{scenario.question}</h3>
          
          <div className="space-y-3">
            {scenario.options.map((option, index) => {
              let buttonClass = "w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ";
              
              if (showResult) {
                if (index === scenario.correctAnswer) {
                  buttonClass += "bg-green-100 border-green-500 text-green-800";
                } else if (index === selectedAnswer && index !== scenario.correctAnswer) {
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
                    {showResult && index === scenario.correctAnswer && (
                      <CheckCircle className="mr-3 text-green-600" size={20} />
                    )}
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {showResult && (
          <div className="mb-6">
            <div className="bg-green-50 rounded-2xl p-4 mb-4">
              <h4 className="font-semibold text-green-800 mb-2">Correct Answer:</h4>
              <div className="text-center">
                <div className="text-2xl font-amiri text-islamic-green mb-2">
                  {scenario.arabicText}
                </div>
                <p className="text-green-700 text-sm">{scenario.explanation}</p>
              </div>
            </div>
            
            <div className="text-center">
              <Button onClick={handleNextLevel} className="bg-islamic-green hover:bg-green-600 text-white">
                {currentLevel < greetingScenarios.length - 1 ? (
                  <>Next Lesson <ArrowRight className="ml-2" size={16} /></>
                ) : (
                  "Complete Course"
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
