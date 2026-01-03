import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IslamicIcon } from "@/components/islamic-icon";
import { Link } from "wouter";
import { Brain, HelpCircle, Clock, Trophy, Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { GameScore } from "@shared/schema";

export function QuickPlay() {
  const { data: memoryBest } = useQuery<GameScore | null>({
    queryKey: ["/api/scores/best/memory"],
  });

  const { data: quizBest } = useQuery<GameScore | null>({
    queryKey: ["/api/scores/best/quiz"],
  });

  return (
    <section className="mb-12">
      <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Quick Play</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Islamic Memory Game */}
        <Card className="bg-white rounded-3xl shadow-lg p-6 border-l-4 border-pink-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center">
                <Brain className="text-white" size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Memory Match</h4>
                <p className="text-sm text-gray-600">Match Islamic symbols</p>
              </div>
            </div>
            <Link href="/game/memory">
              <Button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full font-semibold transition-colors">
                Play <Play className="ml-1" size={16} />
              </Button>
            </Link>
          </div>
          <div className="text-xs text-gray-500">
            <Clock className="inline mr-1" size={12} />
            Best time: {memoryBest ? `${memoryBest.timeSpent}s` : "Not played yet"}
          </div>
        </Card>
        
        {/* Islamic Quiz */}
        <Card className="bg-white rounded-3xl shadow-lg p-6 border-l-4 border-teal-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                <HelpCircle className="text-white" size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-800">Quick Quiz</h4>
                <p className="text-sm text-gray-600">Test your Islamic knowledge</p>
              </div>
            </div>
            <Link href="/game/quiz">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-full font-semibold transition-colors">
                Play <Play className="ml-1" size={16} />
              </Button>
            </Link>
          </div>
          <div className="text-xs text-gray-500">
            <Trophy className="inline mr-1" size={12} />
            Best score: {quizBest ? `${quizBest.score}/${quizBest.maxScore}` : "Not played yet"}
          </div>
        </Card>
      </div>
    </section>
  );
}
