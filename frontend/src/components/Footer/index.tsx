import { DEFAULT_DOCUMENT_TITLE } from '../../constants';

export default function Footer() {
	return (
		<footer className="npmclear-both w-full sm:z-auto mt-auto max-w-7xl mx-auto">
			<h2 className="sr-only">Footer</h2>
			<section className="px-6 py-12 mx-auto lg:px-8">
				<p className="text-center text-xs leading-5 text-gray-700">&copy; {DEFAULT_DOCUMENT_TITLE}</p>
			</section>
		</footer>
	);
}
