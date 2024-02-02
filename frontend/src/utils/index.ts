import { toast, type ToastPosition } from 'react-toastify';
import * as paths from '../constants/paths';
import type { FormEvent } from 'react';

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

export const checkIfObjectIsEmpty = (obj: object): boolean =>
	!obj || (!Object.keys(obj).length && Object.getPrototypeOf(obj) === Object.prototype);

export const onSubmitFormHandler = (
	event: FormEvent<HTMLFormElement>,
	preventDefault = true
): { [key: string]: any } => {
	if (preventDefault) event.preventDefault();

	const newParams: { [key: string]: any } = {};
	const elements = Array.from(event.currentTarget.elements);

	elements.forEach(element => {
		if (
			(element instanceof HTMLInputElement ||
				element instanceof HTMLTextAreaElement ||
				element instanceof HTMLSelectElement) &&
			element.name
		)
			newParams[element.name] =
				element.getAttribute('type') === 'checkbox' && 'checked' in element ? element.checked : element.value;
	});

	return newParams;
};

export const showSuccessToast = (message: string, position?: ToastPosition) => {
	toast.success(message, {
		position: `${position ? position : 'top-right'}`,
		autoClose: 3000,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: 'colored',
	});
};

export const showErrorToast = (message: string, position?: ToastPosition) => {
	toast.error(message, {
		position: `${position ? position : 'top-right'}`,
		autoClose: 3000,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: 'colored',
	});
};
