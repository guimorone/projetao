import * as paths from '../constants/paths';

export function classNames(...classes: any[]): string {
	return classes.filter(Boolean).join(' ');
}

export const capitalizeString = (str: string): string => {
	const firstChar = str.charAt(0).toUpperCase();
	const remainingChars = str.slice(1);

	return `${firstChar}${remainingChars}`;
};

export const formatPathname = (str: string): string => {
	str = str.toLowerCase();

	switch (str) {
		case paths.HOME.substring(1):
			return 'Inicio';
		case paths.MAP.substring(1):
			return 'Mapa';
		case paths.SUGGESTION.substring(1):
			return 'Sugestões';
		default:
			return str;
	}
};
