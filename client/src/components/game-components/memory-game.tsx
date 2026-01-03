import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IslamicIcon } from "@/components/islamic-icon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Timer, RotateCcw, Star } from "lucide-react";

interface MemoryCard {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const islamicSymbols = ["mosque", "heart", "star", "book-open", "hands-praying", "home"];

export function MemoryGame() {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  
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

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGameActive && !gameCompleted) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameActive, gameCompleted]);

  useEffect(() => {
    if (matches === islamicSymbols.length && !gameCompleted) {
      setGameCompleted(true);
      setIsGameActive(false);
      
      // Calculate score based on time and moves
      const baseScore = 1000;
      const timeBonus = Math.max(0, 300 - time) * 2;
      const moveBonus = Math.max(0, 20 - moves) * 10;
      const finalScore = baseScore + timeBonus + moveBonus;

      saveScoreMutation.mutate({
        userId: 1,
        gameType: "memory",
        score: finalScore,
        maxScore: 1000 + 600 + 200, // Max possible score
        timeSpent: time,
      });

      toast({
        title: "Congratulations! 🎉",
        description: `You completed the memory game in ${time} seconds with ${moves} moves!`,
      });
    }
  }, [matches, time, moves, gameCompleted]);

  const initializeGame = () => {
    const shuffledSymbols = [...islamicSymbols, ...islamicSymbols]
      .sort(() => Math.random() - 0.5);
    
    const newCards = shuffledSymbols.map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(newCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setTime(0);
    setIsGameActive(false);
    setGameCompleted(false);
  };

  const handleCardClick = (cardId: number) => {
    if (!isGameActive) setIsGameActive(true);
    
    if (flippedCards.length === 2 || cards[cardId].isFlipped || cards[cardId].isMatched) {
      return;
    }

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prevCards =>
      prevCards.map(card =>
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [firstCard, secondCard] = newFlippedCards.map(id => cards[id]);
      
      if (firstCard.symbol === secondCard.symbol) {
        // Match found
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              newFlippedCards.includes(card.id)
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatches(matches + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              newFlippedCards.includes(card.id)
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white rounded-3xl shadow-xl p-8 border-t-4 border-pink-500">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Islamic Memory Match</h2>
          <p className="text-gray-600">Match the Islamic symbols to complete the game!</p>
        </div>

        {/* Game Stats */}
        <div className="flex justify-center space-x-6 mb-6">
          <div className="text-center">
            <Timer className="mx-auto mb-1 text-blue-500" size={24} />
            <div className="font-bold text-lg">{formatTime(time)}</div>
            <div className="text-sm text-gray-500">Time</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">{moves}</div>
            <div className="text-sm text-gray-500">Moves</div>
          </div>
          <div className="text-center">
            <Star className="mx-auto mb-1 text-golden" size={24} />
            <div className="font-bold text-lg">{matches}/{islamicSymbols.length}</div>
            <div className="text-sm text-gray-500">Matches</div>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`
                aspect-square rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center text-2xl
                ${card.isFlipped || card.isMatched
                  ? card.isMatched
                    ? "bg-gradient-to-br from-green-400 to-green-500 text-white scale-95"
                    : "bg-gradient-to-br from-pink-400 to-pink-500 text-white"
                  : "bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400"
                }
              `}
            >
              {(card.isFlipped || card.isMatched) && (
                <IslamicIcon name={card.symbol} className="text-3xl" />
              )}
            </div>
          ))}
        </div>

        {/* Game Controls */}
        <div className="text-center">
          <Button
            onClick={initializeGame}
            className="bg-pink-500 hover:bg-pink-600 text-white"
          >
            <RotateCcw className="mr-2" size={16} />
            New Game
          </Button>
        </div>

        {/* Completion Message */}
        {gameCompleted && (
          <div className="mt-6 text-center bg-green-50 rounded-2xl p-4">
            <h3 className="text-xl font-bold text-green-800 mb-2">Excellent Work!</h3>
            <p className="text-green-700">
              You completed the memory game in {formatTime(time)} with {moves} moves!
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
