import { useLocation } from 'react-router-dom';
import { classNames } from '../../utils';
import { DEFAULT_DOCUMENT_TITLE } from '../../constants';
import { HOME } from '../../constants/paths';

export default function Footer() {
	const { pathname } = useLocation();

	return (
		<footer className="clear-both sm:z-auto mt-auto max-w-7xl mx-auto">
			<h2 className="sr-only">Footer</h2>
			<section className="py-12 mx-auto">
				<p className={classNames(pathname === HOME && 'hidden', 'text-center text-xs leading-5 text-gray-700')}>
					&copy; {DEFAULT_DOCUMENT_TITLE}
				</p>
			</section>
		</footer>
	);
}
