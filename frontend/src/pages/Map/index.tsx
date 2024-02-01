import { useState, useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon, type LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { TrashIcon } from '@heroicons/react/20/solid';
import 'leaflet/dist/leaflet.css';

export default function Map() {
	const [coords, setCoords] = useState<LatLngExpression>([-8.05, -34.9]);
	const positions: { coords: LatLngExpression; name: string; poll: string; score: number; address: string }[] = [
		{ coords: [-8.05, -34.9], name: 'Lixeira 1', poll: 'Enquete', score: 0, address: 'Rua da Amizade' },
		{
			coords: [-8, -34.9],
			name: 'Lixeira 2',
			poll: 'Enquete',
			score: 0,
			address: 'Avenida Leopoldino Canuto de Melo',
		},
		{
			coords: [-8.02, -35],
			name: 'Lixeira 3',
			poll: 'Enquete',
			score: 0,
			address: 'Rua Manoel Bandeira',
		},
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
		<MapContainer center={coords} zoom={13} className="fixed w-screen h-screen inset-x-0 top-0">
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{positions.map((pos, index) => (
				<Marker key={`${pos.name}_${index}`} position={pos.coords} icon={legalIcon}>
					<Popup>
						<div className="space-y-2 text-sm md:text-base z-50">
							<h2 className="text-semibold text-base md:text-lg text-gray-700 mb-4">{pos.name}</h2>
							<p>
								<strong>Enquete atual: </strong>
								{pos.poll}
							</p>
							<p>
								<strong>Pontuação: </strong>
								{pos.score}
							</p>
							<p>
								<strong>Endereço: </strong>
								{pos.address}
							</p>
						</div>
					</Popup>
				</Marker>
			))}
		</MapContainer>
	);
}
