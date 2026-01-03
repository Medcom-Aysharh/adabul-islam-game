import { useParams } from "wouter";
import { Header } from "@/components/header";
import { GreetingGame } from "@/components/game-components/greeting-game";
import { MemoryGame } from "@/components/game-components/memory-game";
import { QuizGame } from "@/components/game-components/quiz-game";
import { useGameData } from "@/hooks/use-game-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Game() {
  const { gameId } = useParams();
  const { user, isLoading } = useGameData();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-islamic-green to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <div className="text-white text-2xl">🕌</div>
          </div>
          <p className="text-lg font-semibold text-gray-800">Loading game...</p>
        </div>
      </div>
    );
  }

  const renderGame = () => {
    switch (gameId) {
      case "greetings":
        return <GreetingGame />;
      case "memory":
        return <MemoryGame />;
      case "quiz":
        return <QuizGame />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Coming Soon!</h2>
            <p className="text-gray-600 mb-6">This game is being developed with love for our little Muslims.</p>
            <Link href="/">
              <Button className="bg-islamic-green hover:bg-green-600">
                <ArrowLeft className="mr-2" size={16} />
                Back to Home
              </Button>
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-islamic-green hover:bg-green-50">
              <ArrowLeft className="mr-2" size={16} />
              Back to Home
            </Button>
          </Link>
        </div>
        
        {renderGame()}
      </main>
    </div>
  );
}
