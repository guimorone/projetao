import { Link } from 'react-router-dom';
import { MAP, SUGGESTION } from '../../constants/paths';

export default function Home() {
	return (
		<div className="mx-auto max-w-lg lg:mx-0 bg-white px-12 py-16 shadow-sm rounded-xl backdrop-blur-sm bg-opacity-70">
			<h1 className="max-w-lg text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Deposita</h1>
			<p className="mt-6 text-xl md:text-2xl leading-8 text-gray-600">
				Acompanhe em tempo real as votações de cada enquete. Vote pessoalmente e compartilhe com seus amigos e
				familiares.
			</p>
			<div className="text-center mt-10 flex items-center gap-x-6">
				<Link
					to={MAP}
					className="text-lg md:text-xl leading-6 rounded-md bg-blue-600 px-3.5 py-2.5 font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
				>
					Ver mapa
				</Link>
				<Link
					to={SUGGESTION}
					className="text-lg md:text-xl font-semibold leading-6 text-white bg-gray-700 hover:bg-gray-600 px-3.5 py-2.5 rounded-md shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700"
				>
					Sugestões & Feedbacks
				</Link>
			</div>
		</div>
	);
}
