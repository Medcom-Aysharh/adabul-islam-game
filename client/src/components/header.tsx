import { IslamicIcon } from "@/components/islamic-icon";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, User } from "lucide-react";
import type { User as UserType } from "@shared/schema";

interface HeaderProps {
  user?: UserType;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white shadow-lg border-b-4 border-islamic-green">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-islamic-green to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <IslamicIcon name="mosque" className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-islamic-green font-amiri">آداب الإسلام</h1>
              <h2 className="text-xl font-semibold text-gray-700">Adabul Islam</h2>
              <p className="text-sm text-gray-500">Islamic Manners for Children</p>
            </div>
          </div>
          
          {/* User Profile Section */}
          <div className="flex items-center space-x-4">
            {/* Progress Indicator */}
            <div className="hidden md:flex items-center space-x-2 bg-yellow-50 px-4 py-2 rounded-full border-2 border-golden">
              <Star className="text-golden" size={20} />
              <span className="font-semibold text-gray-700">{user?.totalStars || 0}</span>
              <span className="text-gray-500">stars</span>
            </div>
            
            {/* Profile Avatar */}
            <Avatar className="w-12 h-12 bg-gradient-to-br from-coral to-pink-400 shadow-lg cursor-pointer hover:scale-110 transition-transform">
              <AvatarFallback className="bg-gradient-to-br from-coral to-pink-400 text-white">
                <User size={20} />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
