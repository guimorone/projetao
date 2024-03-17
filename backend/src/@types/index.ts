export interface IPolls {
  index: number;
  name?: string;
  poll: string;
  coords: number[];
  address: string;
  option1: string | number;
  image1?: string;
  color1?: string;
  option2: string | number;
  image2?: string;
  color2?: string;
  votes1: number;
  votes2: number;
  areaTraffic?: string;
}

export interface ISuggestion {
  name?: string;
  message: string;
}

export interface IFeedbacks extends Partial<ISuggestion> {
  score: null | 'veryBad' | 'bad' | 'neutral' | 'good' | 'veryGood';
}
