import type { LatLngExpression } from 'leaflet';

export interface IPolls {
	name?: string;
	poll: string;
	coords: LatLngExpression;
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

export type ContextType = {
	polls: IPolls[];
};
