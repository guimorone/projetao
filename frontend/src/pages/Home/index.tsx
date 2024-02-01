import { Link } from 'react-router-dom';
import { MAP, SUGGESTION } from '../../constants/paths';
import poster from '../../assets/poster.png';

export default function Home() {
	return (
		<div className="space-y-12 lg:space-y-0 mx-auto px-6 lg:flex lg:items-center lg:gap-x-10 lg:px-8">
			<div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto">
				<h1 className="mt-10 max-w-lg text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Deposita</h1>
				<p className="mt-6 text-lg leading-8 text-gray-600">
					Acompanhe em tempo real as votações de cada enquete. Vote pessoalmente e compartilhe com seus amigos e
					familiares.
				</p>
				<div className="mt-10 flex items-center gap-x-6">
					<Link
						to={MAP}
						className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
					>
						Ver mapa
					</Link>
					<Link to={SUGGESTION} className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-800">
						Sugestões & Feedbacks <span aria-hidden="true">&rarr;</span>
					</Link>
				</div>
			</div>
			<img src={poster} alt="Poster" className="mx-auto w-96 max-w-full rounded-2xl shadow-xl" />
		</div>
	);
}
