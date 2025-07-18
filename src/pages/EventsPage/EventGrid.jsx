// import React, { useState, useEffect } from "react";


// fakeEvents= [
//   {
//     "id": 101,
//     "location": "Golden Gate Park, San Francisco",
//     "category": "Sports",
//     "dateTime": "2025-07-20T10:00:00",
//     "description": "Casual Sunday morning pick-up soccer game. All skill levels welcome!",
//     "imageUrl": "https://example.com/soccer.jpg"
//   },
//   {
//     "id": 102,
//     "location": "Salesforce Tower, San Francisco",
//     "category": "Networking",
//     "dateTime": "2025-07-22T17:30:00",
//     "description": "Tech Intern Mixer: Meet fellow interns and industry professionals. Free snacks and drinks!",
//     "imageUrl": "https://example.com/networking.jpg"
//   },
//   {
//     "id": 103,
//     "location": "Ferry Building, San Francisco",
//     "category": "Food",
//     "dateTime": "2025-07-25T19:00:00",
//     "description": "San Francisco Food Tour: Explore local eateries and culinary delights near the waterfront.",
//     "imageUrl": "https://example.com/food_tour.jpg"
//   },
//   {
//     "id": 104,
//     "location": "Online (Zoom)",
//     "category": "Professional Development",
//     "dateTime": "2025-07-28T14:00:00",
//     "description": "Webinar: Navigating Your First Internship - Tips for Success and Career Growth.",
//     "imageUrl": "https://example.com/webinar.jpg"
//   },
//   {
//     "id": 105,
//     "location": "The Fillmore, San Francisco",
//     "category": "Music",
//     "dateTime": "2025-08-01T20:30:00",
//     "description": "Live Concert: Indie band 'The City Lights' performing their new album.",
//     "imageUrl": "https://example.com/concert.jpg"
//   }
// ]
// const EventGrid =  ({events}) =>{
//     return(
//         <>
//         {events.map((event)=>(
//             <event
//                 location={event.location}
//                 category ={event.category}
//                 dateTime ={event.dateTime}
//                 description = {event.description}

//                 />
//         ))}
//         </>
//     )
// }\


import React from "react";
// Assuming Event.jsx is in the same directory as EventGrid.jsx
// You'll need to create this Event.jsx file for individual event cards.
import Event from './event.jsx'; 
import './EventGrid.css'
import noImage from '../../assets/AddImage.png'
// Define your fake event data outside the component if it's static
// or simulate it being passed down from a parent.


const EventGrid = ({ events }) => {
    // Optional: Add a check for no events, so the page isn't just blank
    if (!events || events.length === 0) {
        return <p className="no-events-message">No events to display at the moment. Check back soon!</p>;
    }

    return (
        // This <div> will be your actual grid container.
        // You'll apply CSS Grid or Flexbox styles to this class.
        <div className="events-grid-container">
            {events.map((event) => (
                // FIX: Component names must start with an uppercase letter (<Event />)
                // Use event.id as the unique 'key' for efficient list rendering
                <Event
                    key={event.id} // Essential for React lists
                    location={event.location}
                    category={event.category}
                    dateTime={event.dateTime}
                    description={event.description}
                    imageUrl={noImage} // Pass imageUrl if you want to display it
                    // You could also pass the entire event object as a single prop:
                    // eventData={event}
                />
            ))}
        </div>
    );
};

export default EventGrid;
