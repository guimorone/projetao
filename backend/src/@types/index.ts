

export interface IPolls {
  index: number;
  name?: string;
  poll: string;
  coords: number[];
  address: string;
  option1: string | number;
  option2: string | number;
  votes1: number;
  votes2: number;
}

export interface ISuggestion {
  name?: string;
  message: string;
}

export interface IFeedbacks extends Partial<ISuggestion> {
  score: null | 'veryBad' | 'bad' | 'neutral' | 'good' | 'veryGood';
}
