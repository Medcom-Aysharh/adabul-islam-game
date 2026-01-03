import { Card } from "@/components/ui/card";
import { AudioPlayer } from "@/components/audio-player";
import { IslamicIcon } from "@/components/islamic-icon";

const islamicMannersSongs = [
  {
    id: 1,
    title: "As-salamu Alaikum",
    description: "A cheerful song about Islamic greetings",
    category: "greetings",
    lyrics: [
      "🎵 As-salamu alaikum, peace be with you",
      "When I see my friends, this is what I do",
      "Wa alaikumus salam, they say back to me",
      "Spreading peace and love for all to see",
      "",
      "In the morning sunshine, afternoon too",
      "Islamic greetings make hearts feel new",
      "Prophet Muhammad taught us this way",
      "To greet each other every single day"
    ]
  },
  {
    id: 2,
    title: "Bismillah Before I Eat",
    description: "Learning table manners with a gentle melody",
    category: "manners",
    lyrics: [
      "🎵 Bismillah, Bismillah, before I start to eat",
      "In the name of Allah, my meal is so sweet",
      "Wash my hands so clean, sit up nice and tall",
      "Share with those around me, kindness for all",
      "",
      "Alhamdulillahi, when my meal is done",
      "Thank you Allah for this food, you're the only One",
      "Don't waste what's on my plate, eat with my right hand",
      "Islamic table manners help me understand"
    ]
  },
  {
    id: 3,
    title: "Kind Hearts, Gentle Words",
    description: "A soft song about showing respect and kindness",
    category: "kindness",
    lyrics: [
      "🎵 Kind hearts and gentle words, that's how I want to be",
      "Helping mama, helping baba, with love and harmony",
      "When someone needs my help, I'll be there right away",
      "Like the Prophet showed us, kindness every day",
      "",
      "Respect for elders, love for friends",
      "Good manners never end",
      "Smile and say please and thank you too",
      "Allah loves the kind things that we do"
    ]
  },
  {
    id: 4,
    title: "In Allah's House",
    description: "Teaching mosque etiquette with reverence",
    category: "respect",
    lyrics: [
      "🎵 In Allah's house, the masjid so bright",
      "I walk in quietly, with steps so light",
      "Take off my shoes, make wudu so clean",
      "The most peaceful place I've ever seen",
      "",
      "Listen to the imam, sit up straight and tall",
      "Pray with concentration, answering Allah's call",
      "After prayer I whisper, make dua to thee",
      "Thank you Allah for this place where I'm free"
    ]
  }
];

export function NasheedCollection() {
  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <IslamicIcon name="heart" className="text-white text-3xl" />
        </div>
        <h3 className="text-3xl font-bold text-gray-800 mb-2 font-amiri">🎵 Islamic Manners Songs</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Beautiful nasheeds that teach Islamic etiquette and manners through gentle melodies and meaningful lyrics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {islamicMannersSongs.map((song) => (
          <AudioPlayer
            key={song.id}
            title={song.title}
            description={song.description}
            lyrics={song.lyrics}
            category={song.category}
          />
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl shadow-xl p-6 text-white text-center">
        <h4 className="text-xl font-bold mb-2">🎼 Music & Islamic Learning</h4>
        <p className="text-purple-100 text-sm max-w-3xl mx-auto">
          These gentle nasheeds help children remember Islamic manners through beautiful melodies. 
          Music has always been a wonderful way for young hearts to learn and remember the teachings of Islam.
        </p>
      </div>
    </section>
  );
}