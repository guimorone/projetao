import { useState, useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { TrashIcon } from '@heroicons/react/20/solid';
import { divIcon, type LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map() {
	const [coords, setCoords] = useState<LatLngExpression>([-8.05, -34.9]);
	const positions: { coords: LatLngExpression; name: string; description: string }[] = [
		{ coords: [-8.05, -34.9], name: 'Teste', description: 'Recife, Pernambuco' },
		{ coords: [-8, -34.9], name: 'Teste 2', description: 'Recife, Pernambuco' },
		{ coords: [-8.02, -35], name: 'Teste 3', description: 'Recife, Pernambuco' },
	];

	function success(position: GeolocationPosition) {
		const lat = position.coords.latitude;
		const lng = position.coords.longitude;
		setCoords([lat, lng]);
	}

	useEffect(() => {
		if (navigator.geolocation) navigator.geolocation.getCurrentPosition(success);
	}, []);

	const Icon = renderToStaticMarkup(<TrashIcon className="w-full h-full text-blue-600" />);
	const legalIcon = divIcon({
		html: Icon,
		iconSize: [35, 35], // size of the icon
		className: 'rounded-full bg-white p-1.5 shadow-md flex items-center',
	});

	return (
		<div className="flex gap-x-4 rounded-lg shadow p-8 bg-white">
			<MapContainer center={coords} zoom={13} scrollWheelZoom={false} className="w-200 h-110">
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{positions.map((pos, index) => (
					<Marker key={`${pos.name}_${index}`} position={pos.coords} icon={legalIcon}>
						<Popup>{pos.description}</Popup>
					</Marker>
				))}
			</MapContainer>
			<h1 className="font-semibold text-lg text-gray-700">Mapa</h1>
		</div>
	);
}
