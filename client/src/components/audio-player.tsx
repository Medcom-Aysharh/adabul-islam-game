import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { IslamicIcon } from "@/components/islamic-icon";

interface AudioPlayerProps {
  title: string;
  description: string;
  lyrics: string[];
  category: string;
}

export function AudioPlayer({ title, description, lyrics, category }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // Using Web Audio API to create nasheed tones
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Initialize Web Audio API
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Set demo duration
    setDuration(60); // 1 minute demo duration
    
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  const createNasheedTone = async () => {
    if (!audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    // Create multiple oscillators for richer sound
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Use Islamic-inspired frequencies (pentatonic scale)
    const frequencies = [261.63, 293.66, 329.63, 392.00, 440.00]; // C4, D4, E4, G4, A4
    const baseFreq = frequencies[Math.floor(Math.random() * frequencies.length)];
    
    // Main tone
    oscillator1.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
    oscillator1.type = 'triangle'; // Warmer sound than sine
    
    // Harmony (fifth above)
    oscillator2.frequency.setValueAtTime(baseFreq * 1.5, audioContext.currentTime);
    oscillator2.type = 'triangle';
    
    // Much louder and clearer volume
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.8, audioContext.currentTime + 0.2);
    gainNode.gain.setValueAtTime(0.8, audioContext.currentTime + 0.5);
    
    // Connect both oscillators through the gain
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillatorRef.current = oscillator1;
    gainNodeRef.current = gainNode;
    
    oscillator1.start();
    oscillator2.start();
    
    // Create melody changes every 2 seconds
    const createMelody = () => {
      if (!isPlaying || !oscillator1 || !oscillator2) return;
      
      const newFreq = frequencies[Math.floor(Math.random() * frequencies.length)];
      oscillator1.frequency.setValueAtTime(newFreq, audioContext.currentTime);
      oscillator2.frequency.setValueAtTime(newFreq * 1.5, audioContext.currentTime);
      
      setTimeout(createMelody, 2000);
    };
    
    setTimeout(createMelody, 2000);
  };

  const togglePlayPause = async () => {
    if (isPlaying) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
      setIsPlaying(false);
      setCurrentTime(0);
    } else {
      await createNasheedTone();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (oscillatorRef.current && gainNodeRef.current) {
      const gainNode = gainNodeRef.current;
      if (isMuted) {
        gainNode.gain.setValueAtTime(0.8, audioContextRef.current!.currentTime);
      } else {
        gainNode.gain.setValueAtTime(0, audioContextRef.current!.currentTime);
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'greetings': return 'from-blue-500 to-blue-600';
      case 'manners': return 'from-green-500 to-green-600';
      case 'respect': return 'from-purple-500 to-purple-600';
      case 'kindness': return 'from-pink-500 to-pink-600';
      default: return 'from-islamic-green to-green-600';
    }
  };

  return (
    <Card className="bg-white rounded-3xl shadow-lg p-6 border-l-4 border-islamic-green">
      <div className="flex items-center space-x-4 mb-4">
        <div className={`w-16 h-16 bg-gradient-to-br ${getCategoryColor(category)} rounded-full flex items-center justify-center shadow-lg`}>
          <IslamicIcon name="heart" className="text-white text-2xl" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>

      {/* Audio Controls */}
      <div className="mb-4">
        <div className="flex items-center space-x-4 mb-2">
          <Button
            onClick={togglePlayPause}
            className="w-12 h-12 rounded-full bg-islamic-green hover:bg-green-600 text-white"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </Button>
          
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-islamic-green h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          
          <Button
            onClick={toggleMute}
            variant="ghost"
            className="w-10 h-10 rounded-full"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </Button>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Lyrics Display */}
      <div className="bg-green-50 rounded-2xl p-4">
        <h4 className="font-semibold text-green-800 mb-3">🎵 Song Lyrics</h4>
        <div className="space-y-2">
          {lyrics.map((line, index) => (
            <p key={index} className="text-green-700 text-sm leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Demo Note */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 italic">
          🎼 Click play to hear a gentle melodic tone representing the nasheed. In production, authentic Islamic children's songs would play here.
        </p>
      </div>
    </Card>
  );
}