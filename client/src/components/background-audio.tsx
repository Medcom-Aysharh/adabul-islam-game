import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Music } from "lucide-react";

export function BackgroundAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Initialize Web Audio API for ambient Islamic background tone
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const createIslamicAmbientTone = () => {
    if (!audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    
    // Create multiple oscillators for rich, clear ambient sound
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const oscillator3 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Islamic-inspired harmonious frequencies
    oscillator1.frequency.setValueAtTime(110, audioContext.currentTime); // A2
    oscillator2.frequency.setValueAtTime(165, audioContext.currentTime); // E3 (perfect fifth)
    oscillator3.frequency.setValueAtTime(220, audioContext.currentTime); // A3 (octave)
    
    oscillator1.type = 'triangle'; // Warm, rich tone
    oscillator2.type = 'sine';     // Pure harmonic
    oscillator3.type = 'sawtooth'; // Adds texture
    
    // Very loud and clear volume for children
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.9, audioContext.currentTime + 1);
    
    // Add gentle modulation for organic feeling
    const lfo = audioContext.createOscillator();
    const lfoGain = audioContext.createGain();
    lfo.frequency.setValueAtTime(0.3, audioContext.currentTime);
    lfoGain.gain.setValueAtTime(10, audioContext.currentTime);
    lfo.type = 'sine';
    
    lfo.connect(lfoGain);
    lfoGain.connect(oscillator1.frequency);
    
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    oscillator3.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillatorRef.current = oscillator1;
    gainNodeRef.current = gainNode;
    
    oscillator1.start();
    oscillator2.start();
    oscillator3.start();
    lfo.start();
  };

  const toggleBackgroundAudio = async () => {
    if (!audioContextRef.current) return;

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    if (isPlaying) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
      setIsPlaying(false);
    } else {
      createIslamicAmbientTone();
      setIsPlaying(true);
    }
  };

  const adjustVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (gainNodeRef.current && isPlaying) {
      gainNodeRef.current.gain.setValueAtTime(newVolume * 0.9, audioContextRef.current!.currentTime);
    }
  };

  return (
    <div className="fixed bottom-20 right-6 z-40">
      <div className="bg-white rounded-2xl shadow-xl p-4 border-2 border-islamic-green">
        <div className="flex items-center space-x-3">
          <Button
            onClick={toggleBackgroundAudio}
            className={`w-12 h-12 rounded-full ${
              isPlaying 
                ? "bg-islamic-green hover:bg-green-600" 
                : "bg-gray-400 hover:bg-gray-500"
            } text-white transition-colors`}
          >
            {isPlaying ? <Music size={20} /> : <VolumeX size={20} />}
          </Button>
          
          <div className="flex flex-col space-y-2">
            <span className="text-xs font-semibold text-gray-700">
              {isPlaying ? "Islamic Ambient" : "Background Audio"}
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => adjustVolume(parseFloat(e.target.value))}
              className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #2E8B57 0%, #2E8B57 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>
        </div>
        
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">
            🕌 Peaceful Islamic ambience
          </p>
        </div>
      </div>
    </div>
  );
}