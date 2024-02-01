import type { Dispatch, SetStateAction } from 'react';
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

export interface IFeedbacks {
	name?: string;
	score: number;
	feedback: string;
}

export type ContextType = {
	polls: IPolls[];
	setPolls: Dispatch<SetStateAction<IPolls[]>>;
};
