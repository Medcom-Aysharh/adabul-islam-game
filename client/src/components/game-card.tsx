import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { IslamicIcon } from "@/components/islamic-icon";
import { Star } from "lucide-react";
import type { GameProgress } from "@shared/schema";

interface GameCardProps {
  game: {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
    difficulty: string;
  };
  progress?: GameProgress;
}

export function GameCard({ game, progress }: GameCardProps) {
  const progressPercentage = progress ? (progress.levelsCompleted / progress.totalLevels) * 100 : 0;
  const stars = progress?.stars || 0;
  const maxStars = progress?.maxStars || 5;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case "royal-blue": return "from-blue-500 to-blue-600 border-blue-500";
      case "coral": return "from-red-400 to-red-500 border-red-400";
      case "islamic-green": return "from-green-600 to-green-700 border-green-600";
      case "purple-500": return "from-purple-500 to-purple-600 border-purple-500";
      case "golden": return "from-yellow-400 to-yellow-500 border-yellow-400";
      case "indigo-500": return "from-indigo-500 to-indigo-600 border-indigo-500";
      default: return "from-gray-500 to-gray-600 border-gray-500";
    }
  };

  const colorClasses = getColorClasses(game.color);

  return (
    <Link href={`/game/${game.id}`}>
      <Card className="game-card bg-white rounded-3xl shadow-lg p-6 cursor-pointer border-l-4 hover:shadow-xl transition-all duration-300">
        <div className="text-center mb-4">
          <div className={`w-20 h-20 bg-gradient-to-br ${colorClasses} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
            <IslamicIcon name={game.icon} className="text-white text-2xl" />
          </div>
          <h4 className="text-xl font-bold text-gray-800 mb-2">{game.title}</h4>
          <p className="text-gray-600 text-sm mb-4">{game.description}</p>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-1 star-rating">
            {Array.from({ length: maxStars }, (_, i) => (
              <Star
                key={i}
                className={`text-lg ${
                  i < stars 
                    ? "text-golden fill-golden" 
                    : "text-gray-300"
                }`}
                size={16}
              />
            ))}
          </div>
          <Badge className={getDifficultyColor(game.difficulty)}>
            {game.difficulty}
          </Badge>
        </div>
        
        <Progress value={progressPercentage} className="mb-2" />
        <p className="text-xs text-gray-500">
          {progress?.levelsCompleted || 0} out of {progress?.totalLevels || 10} levels completed
        </p>
      </Card>
    </Link>
  );
}
