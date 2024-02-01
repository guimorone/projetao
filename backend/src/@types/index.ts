

export interface IPolls {
  name?: string;
  poll: string;
  coords: number[];
  address: string;
  option1: string | number;
  option2: string | number;
  votes1: number;
  votes2: number;
}

export interface IFeedbacks {
  name?: string;
  score: number;
  feedback: string;
}

