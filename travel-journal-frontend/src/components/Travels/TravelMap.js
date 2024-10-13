
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PropTypes from 'prop-types';


const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const TravelMap = ({ coordinates, location }) => {
  if (!coordinates || coordinates.length !== 2) {
    return <div>Неправильные координаты для отображения карты.</div>;
  }

  const position = [coordinates[1], coordinates[0]]; 

  return (
    <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={markerIcon}>
        <Popup>
          <strong>{location}</strong>
         
        </Popup>
      </Marker>
    </MapContainer>
  );
};

TravelMap.propTypes = {
  coordinates: PropTypes.arrayOf(PropTypes.number).isRequired,
  location: PropTypes.string.isRequired,
};

export default TravelMap;
