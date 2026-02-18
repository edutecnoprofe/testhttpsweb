import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './DayCard.css';

const DayCard = ({ day }) => {
    return (
        <Link to={`/day/${day.id}`} className="day-card">
            <div className="day-card-content">
                <span className="day-card-date">{day.date}</span>
                <h2 className="day-card-title">{day.title}</h2>
                <p className="day-card-summary">{day.summary}</p>
            </div>
            <div className="day-card-arrow">
                <ChevronRight size={20} />
            </div>
        </Link>
    );
};

export default DayCard;
