import { useState, useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from 'flowbite-react';
import { divIcon, type LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { TrashIcon } from '@heroicons/react/20/solid';
import { useTypedOutletContext } from '../../utils/hooks';
import { RECIFE_COORDS } from '../../constants';
import 'leaflet/dist/leaflet.css';

export default function Map() {
	const [coords, setCoords] = useState<LatLngExpression>(RECIFE_COORDS);
	const { polls, setPolls } = useTypedOutletContext();

	const { isFetching, data, isSuccess } = useQuery<typeof polls>({
		queryKey: ['spreadsheet', 'GET'],
		enabled: true,
		refetchOnMount: 'always',
		refetchOnWindowFocus: true,
		refetchOnReconnect: 'always',
		refetchIntervalInBackground: true,
		staleTime: 60 * 60 * 1000, // 1 hora de cache
	});

	function success(position: GeolocationPosition) {
		const lat = position.coords.latitude;
		const lng = position.coords.longitude;

		setCoords([lat, lng]);
	}

	useEffect(() => {
		if (isSuccess && data) setPolls(data);
	}, [isSuccess, data]);

	useEffect(() => {
		if (navigator.geolocation) navigator.geolocation.getCurrentPosition(success);
	}, []);

	const Icon = renderToStaticMarkup(<TrashIcon className="w-full h-full text-blue-600" />);
	const legalIcon = divIcon({
		html: Icon,
		iconSize: [35, 35],
		className: 'rounded-full bg-white p-1.5 shadow-md flex items-center',
	});

	return (
		<>
			{isFetching ? (
				<Spinner color="info" size="xl" />
			) : (
				<MapContainer center={coords} zoom={13} className="fixed w-screen h-screen inset-x-0 top-0">
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
					{polls?.map((p, index) => (
						<Marker key={index} position={p.coords} icon={legalIcon}>
							<Popup>
								<div className="space-y-2 text-sm md:text-base z-50">
									<h2 className="text-semibold text-base md:text-lg text-gray-700 mb-4">{p.poll}</h2>
									<p>
										<strong>Endereço: </strong>
										{p.address || 'Não informado'}
									</p>
									<p>
										<strong>1ª Opção: </strong>
										{p.option1}
										<span className="text-xs">
											{' '}
											({p.votes1} {`${p.votes1 === 1 ? 'voto' : 'votos'}`})
										</span>
									</p>
									<p>
										<strong>2ª Opção: </strong>
										{p.option2}
										<span className="text-xs">
											{' '}
											({p.votes2} {`${p.votes2 === 1 ? 'voto' : 'votos'}`})
										</span>
									</p>
									<p>
										<strong>Criada por: </strong>
										{p.name || 'Anônimo'}
									</p>
								</div>
							</Popup>
						</Marker>
					))}
				</MapContainer>
			)}
		</>
	);
}
