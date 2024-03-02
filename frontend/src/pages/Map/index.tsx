import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon, type LatLngExpression, type Map as MapType } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { TrashIcon } from '@heroicons/react/20/solid';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { TbViewfinder } from 'react-icons/tb';
import { useTypedOutletContext } from '../../utils/hooks';
import { RECIFE_COORDS } from '../../constants';
import { POLL } from '../../constants/paths';
import 'leaflet/dist/leaflet.css';

export default function Map() {
	const [coords, setCoords] = useState<LatLngExpression | undefined>(undefined);
	const { polls } = useTypedOutletContext();
	const map = useRef<MapType>(null);
	const center: LatLngExpression = coords || RECIFE_COORDS;
	const zoom: number = 13;

	function success(position: GeolocationPosition) {
		const lat = position.coords.latitude;
		const lng = position.coords.longitude;

		setCoords([lat, lng]);
	}

	useEffect(() => {
		if (navigator.geolocation) navigator.geolocation.getCurrentPosition(success);
	}, []);

	const TrashMapIcon = renderToStaticMarkup(<TrashIcon className="w-full h-full text-blue-600" />);
	const trashIcon = divIcon({
		html: TrashMapIcon,
		iconSize: [35, 35],
		className: 'rounded-full bg-white p-1.5 shadow-md flex items-center',
	});

	const MarkerMapIcon = renderToStaticMarkup(<FaMapMarkerAlt className="w-full h-full text-red-600" />);
	const markerIcon = divIcon({
		html: MarkerMapIcon,
		iconSize: [50, 50],
		className: 'rounded-full bg-transparent',
	});

	const recentralizeMap = (): void => {
		if (!map.current) return;

		map.current.flyTo(center, zoom);
	};

	const displayMap = useMemo(
		() => (
			<MapContainer ref={map} center={center} zoom={zoom} className="fixed w-screen h-screen inset-x-0 top-0">
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{coords !== undefined && (
					<Marker position={coords} icon={markerIcon}>
						<Popup className="text-lg">Você está aqui!</Popup>
					</Marker>
				)}
				{polls?.map((p, index) => (
					<Marker key={index} position={p.coords} icon={trashIcon}>
						<Popup>
							<div className="space-y-2 text-base md:text-lg z-50">
								<h2 className="text-semibold text-lg md:text-xl text-gray-700 mb-4">{p.poll}</h2>
								<p>
									<strong>Endereço: </strong>
									{p.address || 'Não informado'}
								</p>
								<p>
									<strong>1ª Opção: </strong>
									{p.option1}
									<span className="text-sm md:text-base">
										{' '}
										({p.votes1} {`${p.votes1 === 1 ? 'voto' : 'votos'}`})
									</span>
								</p>
								<p>
									<strong>2ª Opção: </strong>
									{p.option2}
									<span className="text-sm md:text-base">
										{' '}
										({p.votes2} {`${p.votes2 === 1 ? 'voto' : 'votos'}`})
									</span>
								</p>
								<p>
									<strong>Criada por: </strong>
									{p.name || 'Anônimo'}
								</p>
								<div className="pt-4 pb-2">
									<Link
										to={`${POLL}/${index}`}
										className="rounded-md bg-blue-600 px-3 py-2 shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
									>
										<span className="text-sm font-semibold text-white">Acessar enquete</span>
									</Link>
								</div>
							</div>
						</Popup>
					</Marker>
				))}
			</MapContainer>
		),
		[map.current, polls, coords]
	);

	return (
		<div>
			{displayMap}
			<div className="fixed bottom-8 right-4">
				<button
					className="bg-white p-2 rounded-full shadow-md text-gray-900 hover:opacity-90"
					onClick={recentralizeMap}
				>
					<TbViewfinder className="w-8 h-8" />
				</button>
			</div>
		</div>
	);
}
