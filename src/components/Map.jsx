import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const center = {
    lat: 50.6159, // example latitude
    lng: 18.0674  // example longitude
};

const customIcon = L.icon({
    iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png', // Example icon
    iconSize: [24, 36],
});

const Map = ({ markers }) => {
    return (
        <MapContainer center={center} zoom={12} className="leaflet-container">
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {markers && markers.map((marker, index) => (
                <Marker
                    key={index}
                    position={marker.position}
                    icon={customIcon}
                >
                    <Popup>
                        <h2>{marker.name}</h2>
                        <p>{marker.description}</p>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;
