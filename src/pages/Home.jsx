import React from 'react';
import itinerary from '../data/itinerary.json';
import DayCard from '../components/DayCard/DayCard';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <div className="hero-section">
                <p className="trip-dates">21 - 27 Septiembre 2026</p>
                <div className="trip-stats">
                    <span>7 Días</span>
                    <span>•</span>
                    <span>30+ Lugares</span>
                </div>
            </div>

            <div className="days-list">
                {itinerary.days.map((day) => (
                    <DayCard key={day.id} day={day} />
                ))}
            </div>
        </div>
    );
};

export default Home;
