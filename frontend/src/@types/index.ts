import type { SVGProps, JSX } from 'react';
import type { LatLngExpression } from 'leaflet';

export interface IPolls {
	name?: string;
	poll: string;
	coords: LatLngExpression;
	address: string;
	option1: string | number;
	image1?: string;
	color1?: string;
	option2: string | number;
	image2?: string;
	color2?: string;
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

export type IconType = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => JSX.Element;
