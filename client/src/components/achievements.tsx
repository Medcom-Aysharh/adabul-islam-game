import { Card } from "@/components/ui/card";
import { IslamicIcon } from "@/components/islamic-icon";
import { useQuery } from "@tanstack/react-query";
import { Star, Trophy, Heart, Calendar } from "lucide-react";
import type { Achievement } from "@shared/schema";

export function Achievements() {
  const { data: achievements = [], isLoading } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });

  if (isLoading) {
    return (
      <section className="mb-12">
        <Card className="bg-white rounded-3xl shadow-xl p-8 border-t-4 border-golden">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Recent Achievements</h3>
          <div className="text-center">Loading achievements...</div>
        </Card>
      </section>
    );
  }

  const getAchievementIcon = (achievementId: string) => {
    switch (achievementId) {
      case "greeting_master": return Trophy;
      case "kind_helper": return Heart;
      case "daily_learner": return Calendar;
      default: return Star;
    }
  };

  const getAchievementColor = (achievementId: string) => {
    switch (achievementId) {
      case "greeting_master": return "from-yellow-50 to-orange-50 border-golden";
      case "kind_helper": return "from-green-50 to-emerald-50 border-islamic-green";
      case "daily_learner": return "from-blue-50 to-indigo-50 border-royal-blue";
      default: return "from-gray-50 to-gray-100 border-gray-300";
    }
  };

  return (
    <section className="mb-12">
      <Card className="bg-white rounded-3xl shadow-xl p-8 border-t-4 border-golden">
        <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">Recent Achievements</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.slice(0, 3).map((achievement) => {
            const IconComponent = getAchievementIcon(achievement.achievementId);
            const colorClasses = getAchievementColor(achievement.achievementId);
            
            return (
              <div
                key={achievement.id}
                className={`text-center p-4 bg-gradient-to-br ${colorClasses} rounded-2xl border-2 ${
                  achievement.achievementId === "greeting_master" ? "animate-bounce-gentle" : ""
                }`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-golden to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <IconComponent className="text-white text-xl" size={24} />
                </div>
                <h4 className="font-bold text-gray-800 mb-1">{achievement.title}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                <div className="mt-2 flex justify-center space-x-1">
                  {Array.from({ length: achievement.stars }, (_, i) => (
                    <Star key={i} className="text-golden fill-golden" size={16} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </section>
  );
}
