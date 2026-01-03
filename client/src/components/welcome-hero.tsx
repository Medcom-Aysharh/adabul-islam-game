import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { IslamicIcon } from "@/components/islamic-icon";
import type { User } from "@shared/schema";

interface WelcomeHeroProps {
  user?: User;
}

export function WelcomeHero({ user }: WelcomeHeroProps) {
  // Mock daily progress - in real app this would come from API
  const dailyProgress = 65;
  const gamesCompletedToday = 3;
  const totalGamesToday = 5;

  return (
    <section className="text-center mb-12">
      <Card className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-t-4 border-islamic-green">
        <div className="flex justify-center mb-4">
          <div className="w-32 h-32 bg-gradient-to-br from-islamic-green to-green-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse-slow">
            <IslamicIcon name="heart" className="text-white text-4xl" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4 font-amiri">السلام عليكم!</h2>
        <h3 className="text-2xl font-semibold text-islamic-green mb-4">Welcome Back, Little Muslim!</h3>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Ready to learn beautiful Islamic manners and earn stars? 
          Let's explore the wonderful world of Adab together!
        </p>
        
        {/* Daily Progress */}
        <div className="mt-6 bg-green-50 rounded-2xl p-4 max-w-md mx-auto">
          <h4 className="font-semibold text-green-800 mb-2">Today's Progress</h4>
          <Progress value={dailyProgress} className="mb-2" />
          <p className="text-sm text-green-700">
            {gamesCompletedToday} out of {totalGamesToday} games completed today!
          </p>
        </div>
      </Card>
    </section>
  );
}
