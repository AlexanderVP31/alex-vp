/**
 * Audio tracks configuration
 * Using Vite's ?url import for proper asset handling
 */
import locoLatin from '../assets/audio/loopazon-1773553556-loco-spanish-morad-latin-guitar.mp3?url';
import nightclubCountry from '../assets/audio/loopazon-1773553590-nightclub-country-guitar.mp3?url';
import smoothPiano from '../assets/audio/loopazon-1773553917-smooth-piano-loop-j-cole-type.mp3?url';
import beatdownGrit from '../assets/audio/loopazon-1773554114-ivory-beatdown-grit-nas-x-dj-premier.mp3?url';
import sadPianoKeys from '../assets/audio/loopazon-1773554155-sad-robert-glasper-piano-keys-to-the-beat.mp3?url';

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  src: string;
  coverColor?: string;
}

export const audioTracks: AudioTrack[] = [
  {
    id: 'loco-latin',
    title: 'Loco Spanish Morad',
    artist: 'Loopazon',
    src: locoLatin,
    coverColor: 'from-orange-500 to-red-500',
  },
  {
    id: 'nightclub-country',
    title: 'Nightclub Country',
    artist: 'Loopazon',
    src: nightclubCountry,
    coverColor: 'from-blue-500 to-purple-500',
  },
  {
    id: 'smooth-piano',
    title: 'Smooth Piano Loop',
    artist: 'Loopazon',
    src: smoothPiano,
    coverColor: 'from-gray-500 to-slate-700',
  },
  {
    id: 'beatdown-grit',
    title: 'Ivory Beatdown Grit',
    artist: 'Loopazon',
    src: beatdownGrit,
    coverColor: 'from-yellow-500 to-amber-700',
  },
  {
    id: 'sad-piano-keys',
    title: 'Sad Robert Glasper',
    artist: 'Loopazon',
    src: sadPianoKeys,
    coverColor: 'from-indigo-500 to-blue-700',
  },
];

export const getTrackById = (id: string): AudioTrack | undefined => {
  return audioTracks.find((track) => track.id === id);
};

export const getTrackIndex = (id: string): number => {
  return audioTracks.findIndex((track) => track.id === id);
};
