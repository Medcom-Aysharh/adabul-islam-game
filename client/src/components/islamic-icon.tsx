import { 
  Home, 
  Heart, 
  Star, 
  BookOpen, 
  Clock,
  Trophy,
  Users,
  HelpCircle,
  Brain,
  Calendar,
  Utensils
} from "lucide-react";

interface IslamicIconProps {
  name: string;
  className?: string;
}

export function IslamicIcon({ name, className = "" }: IslamicIconProps) {
  const getIcon = () => {
    switch (name) {
      case "mosque":
        return "🕌";
      case "hands-praying":
        return "🤲";
      case "heart":
        return <Heart className={className} />;
      case "star":
        return <Star className={className} />;
      case "book-open":
        return <BookOpen className={className} />;
      case "home":
        return <Home className={className} />;
      case "utensils":
        return <Utensils className={className} />;
      case "clock":
        return <Clock className={className} />;
      case "trophy":
        return <Trophy className={className} />;
      case "users":
        return <Users className={className} />;
      case "help-circle":
        return <HelpCircle className={className} />;
      case "brain":
        return <Brain className={className} />;
      case "calendar":
        return <Calendar className={className} />;
      default:
        return <Star className={className} />;
    }
  };

  const icon = getIcon();
  
  if (typeof icon === "string") {
    return <span className={className}>{icon}</span>;
  }
  
  return icon;
}
