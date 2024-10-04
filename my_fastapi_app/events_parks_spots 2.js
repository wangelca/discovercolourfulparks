import { useState, useEffect } from 'react';

// Component to fetch and display Events
function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/events/')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error fetching events:', error));
  }, []);

  return (
    <div>
      <h2>Events</h2>
      <ul>
        {events.map(event => (
          <li key={event.id}>{event.name} - {new Date(event.date).toLocaleDateString()} - {event.location} - {event.description}</li>
        ))}
      </ul>
    </div>
  );
}

// Component to fetch and display Parks
function Parks() {
  const [parks, setParks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/parks/')
      .then(response => response.json())
      .then(data => setParks(data))
      .catch(error => console.error('Error fetching parks:', error));
  }, []);

  return (
    <div>
      <h2>Parks</h2>
      <ul>
        {parks.map(park => (
          <li key={park.id}>{park.name} - {park.province} - {park.description} - {park.province} - {park.location} - {} </li>
        ))}
      </ul>
    </div>
  );
}

// Component to fetch and display Spots
function Spots() {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/spots/')
      .then(response => response.json())
      .then(data => setSpots(data))
      .catch(error => console.error('Error fetching spots:', error));
  }, []);

  return (
    <div>
      <h2>Spots</h2>
      <ul>
        {spots.map(spot => (
          <li key={spot.id}>
            {spot.name} - {spot.description} - {spot.location} - {spot.hourlyrate}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Main Component to render all sections
function App() {
  return (
    <div>
      <h1>City Guide</h1>
      <Events />
      <Parks />
      <Spots />
    </div>
  );
}

export default App;
