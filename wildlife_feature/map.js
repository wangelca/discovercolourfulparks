// references: ChatGPT: how to map the wildlife sightings to the front end
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const Map = ({ sightings }) => (
    <MapContainer center={[45.4215, -75.6972]} zoom={10} style={{ height: '500px', width: '100%' }}>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sightings.map(sighting => (
            <Marker key={sighting.id} position={[sighting.latitude, sighting.longitude]}>
                <Popup>
                    <b>{sighting.animal_type}</b>
                    <p>{sighting.description}</p>
                    <p>Reported by: {sighting.reported_by || 'Anonymous'}</p>
                </Popup>
            </Marker>
        ))}
    </MapContainer>
);

export default Map;
