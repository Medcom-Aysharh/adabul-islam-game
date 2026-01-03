import { Header } from "@/components/header";
import { WelcomeHero } from "@/components/welcome-hero";
import { GameCard } from "@/components/game-card";
import { Achievements } from "@/components/achievements";
import { QuickPlay } from "@/components/quick-play";
import { NasheedCollection } from "@/components/nasheed-collection";
import { BackgroundAudio } from "@/components/background-audio";
import { Button } from "@/components/ui/button";
import { IslamicIcon } from "@/components/islamic-icon";
import { useGameData } from "@/hooks/use-game-data";
import { HelpCircle, Users, BarChart3, Shield, GraduationCap, ExternalLink } from "lucide-react";

const gameCategories = [
  {
    id: "greetings",
    title: "Islamic Greetings",
    description: "Learn beautiful Islamic greetings and when to use them",
    icon: "hands-praying",
    color: "royal-blue",
    difficulty: "Easy"
  },
  {
    id: "table-manners",
    title: "Table Manners",
    description: "Learn proper Islamic eating etiquette and table manners",
    icon: "utensils",
    color: "coral",
    difficulty: "Medium"
  },
  {
    id: "respect-kindness",
    title: "Respect & Kindness",
    description: "Learn how to be kind and respectful to everyone",
    icon: "heart",
    color: "islamic-green",
    difficulty: "Easy"
  },
  {
    id: "mosque-etiquette",
    title: "Mosque Etiquette",
    description: "Learn proper behavior and manners in the mosque",
    icon: "mosque",
    color: "purple-500",
    difficulty: "Hard"
  },
  {
    id: "family-respect",
    title: "Family Respect",
    description: "Learn how to respect and love your family members",
    icon: "home",
    color: "golden",
    difficulty: "Medium"
  },
  {
    id: "daily-duas",
    title: "Daily Duas",
    description: "Learn beautiful Islamic supplications for daily life",
    icon: "book-open",
    color: "indigo-500",
    difficulty: "Easy"
  }
];

export default function Home() {
  const { user, progress, isLoading } = useGameData();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-islamic-green to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <IslamicIcon name="mosque" className="text-white text-2xl" />
          </div>
          <p className="text-lg font-semibold text-gray-800">Loading your Islamic learning journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-8">
        <WelcomeHero user={user} />
        
        {/* Game Categories */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Choose Your Adventure</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gameCategories.map((category) => {
              const gameProgress = progress?.find(p => p.gameId === category.id);
              return (
                <GameCard
                  key={category.id}
                  game={category}
                  progress={gameProgress}
                />
              );
            })}
          </div>
        </section>

        <Achievements />
        
        <NasheedCollection />
        
        <QuickPlay />

        {/* Parent Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl shadow-xl p-8 text-white">
            <div className="text-center mb-6">
              <Users className="mx-auto text-4xl mb-4 opacity-80" size={48} />
              <h3 className="text-2xl font-bold mb-2">For Parents</h3>
              <p className="opacity-90">Track your child's Islamic learning journey</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white bg-opacity-20 rounded-2xl p-4">
                <BarChart3 className="mx-auto text-2xl mb-2" size={32} />
                <h4 className="font-semibold mb-1">Progress Reports</h4>
                <p className="text-sm opacity-90">Weekly learning summaries</p>
              </div>
              
              <div className="bg-white bg-opacity-20 rounded-2xl p-4">
                <Shield className="mx-auto text-2xl mb-2" size={32} />
                <h4 className="font-semibold mb-1">Safe Environment</h4>
                <p className="text-sm opacity-90">Child-friendly content only</p>
              </div>
              
              <div className="bg-white bg-opacity-20 rounded-2xl p-4">
                <GraduationCap className="mx-auto text-2xl mb-2" size={32} />
                <h4 className="font-semibold mb-1">Islamic Curriculum</h4>
                <p className="text-sm opacity-90">Age-appropriate Islamic teachings</p>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <Button className="bg-white text-indigo-600 hover:bg-gray-100">
                View Parent Dashboard 
                <ExternalLink className="ml-2" size={16} />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Background Audio Control */}
      <BackgroundAudio />

      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button className="w-16 h-16 bg-gradient-to-br from-islamic-green to-green-600 rounded-full shadow-xl hover:scale-110 transition-transform animate-wiggle">
          <HelpCircle size={24} />
        </Button>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-islamic-green to-green-600 rounded-full flex items-center justify-center">
              <IslamicIcon name="mosque" className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-amiri">آداب الإسلام</h3>
              <p className="text-sm text-gray-400">Adabul Islam</p>
            </div>
          </div>
          
          <p className="text-gray-400 mb-4">
            Teaching beautiful Islamic manners to the next generation
          </p>
          
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
            <a href="#" className="hover:text-white transition-colors">About</a>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-700 text-xs text-gray-500">
            <p>&copy; 2024 Adabul Islam. Made with ❤️ for Muslim children worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
