export interface League {
  id: number;
  name: string;
  shortName: string;
  country: string;
  flag: string;
  accentColor: string;
}

export const LEAGUES: League[] = [
  {
    id: 2021,
    name: 'Premier League',
    shortName: 'PL',
    country: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    accentColor: '#3D195B',
  },
  {
    id: 2014,
    name: 'La Liga',
    shortName: 'LL',
    country: 'Spain',
    flag: '🇪🇸',
    accentColor: '#C60B1E',
  },
  {
    id: 2002,
    name: 'Bundesliga',
    shortName: 'BL',
    country: 'Germany',
    flag: '🇩🇪',
    accentColor: '#D00000',
  },
  {
    id: 2019,
    name: 'Serie A',
    shortName: 'SA',
    country: 'Italy',
    flag: '🇮🇹',
    accentColor: '#0066CC',
  },
  {
    id: 2015,
    name: 'Ligue 1',
    shortName: 'L1',
    country: 'France',
    flag: '🇫🇷',
    accentColor: '#00318F',
  },
  {
    id: 2001,
    name: 'Champions League',
    shortName: 'UCL',
    country: 'Europe',
    flag: '⭐',
    accentColor: '#1B3A6B',
  },
];

export const LEAGUE_MAP = Object.fromEntries(LEAGUES.map((l) => [l.id, l]));
