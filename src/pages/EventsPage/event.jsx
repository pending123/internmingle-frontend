// Event.jsx (Create this file in the same directory as EventGrid.jsx, or adjust path)
import React from 'react';

const Event = ({ location, category, dateTime, description, imageUrl }) => {
    // Basic date and time formatting for display
    const eventDate = new Date(dateTime);
    const formattedDate = eventDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const formattedTime = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    return (
        <div className="event-card"> {/* This div represents one event card */}
            {imageUrl && <img src={imageUrl} alt={location} className="event-card-image" />}
            <div className="event-card-content">
                <h3 className="event-card-category">{category}</h3>
                <p className="event-card-location">{location}</p>
                <p className="event-card-datetime">{formattedDate} at {formattedTime}</p>
                <p className="event-card-description">{description}</p>
                {/* You might add a "View Details" button here that navigates to a single event page */}
            </div>
        </div>
    );
};

export default Event;