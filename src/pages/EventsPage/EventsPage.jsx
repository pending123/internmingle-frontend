import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './EventsPage.css'
import EventModal from "./EventModal";
import EventGrid from "./EventGrid";


const eventsPage = () => {
const fakeEvents = [
  {
    "id": 101,
    "location": "Golden Gate Park, San Francisco",
    "category": "Sports",
    "dateTime": "2025-07-20T10:00:00",
    "description": "Casual Sunday morning pick-up soccer game. All skill levels welcome!",
    "imageUrl": "https://example.com/soccer.jpg"
  },
  {
    "id": 102,
    "location": "Salesforce Tower, San Francisco",
    "category": "Networking",
    "dateTime": "2025-07-22T17:30:00",
    "description": "Tech Intern Mixer: Meet fellow interns and industry professionals. Free snacks and drinks!",
    "imageUrl": "https://example.com/networking.jpg"
  },
  {
    "id": 103,
    "location": "Ferry Building, San Francisco",
    "category": "Food",
    "dateTime": "2025-07-25T19:00:00",
    "description": "San Francisco Food Tour: Explore local eateries and culinary delights near the waterfront.",
    "imageUrl": "https://example.com/food_tour.jpg"
  },
  {
    "id": 104,
    "location": "Online (Zoom)",
    "category": "Professional Development",
    "dateTime": "2025-07-28T14:00:00",
    "description": "Webinar: Navigating Your First Internship - Tips for Success and Career Growth.",
    "imageUrl": "https://example.com/webinar.jpg"
  },
  {
    "id": 105,
    "location": "The Fillmore, San Francisco",
    "category": "Music",
    "dateTime": "2025-08-01T20:30:00",
    "description": "Live Concert: Indie band 'The City Lights' performing their new album.",
    "imageUrl": "https://example.com/concert.jpg"
  },
  ,
  {
    "id": 106,
    "location": "Exploratorium, Pier 15, San Francisco",
    "category": "Culture",
    "dateTime": "2025-08-05T11:00:00",
    "description": "Explore interactive exhibits on science, art, and perception. Discounted intern tickets available!",
    "imageUrl": "https://example.com/exploratorium.jpg"
  },
  {
    "id": 107,
    "location": "Dolores Park, San Francisco",
    "category": "Social",
    "dateTime": "2025-08-09T16:00:00",
    "description": "Intern Picnic & Games: Enjoy the sun, bring snacks, and meet new friends at Dolores Park.",
    "imageUrl": "https://example.com/dolores_park.jpg"
  },
  {
    "id": 108,
    "location": "Lands End Trail, San Francisco",
    "category": "Outdoors",
    "dateTime": "2025-08-15T09:00:00",
    "description": "Morning Hike with ocean views. Moderate difficulty, bring water and good shoes.",
    "imageUrl": "https://example.com/lands_end.jpg"
  }
];



    const [events, setEvents] = useState([])
    const [category, setCategory] = useState("All")
    const [searchInputValue,setSearchInputValue] = useState("")
    const [submittedSearch, setSubmittedSearch] = useState("")
    const [skip, setSkip] = useState(0)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const handleClearSearch = () => {
        setSearchInputValue("")
        setSubmittedSearch("")
    };

    const handleOnSearchInputChange = (event) => {
        setSearchInputValue(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setSubmittedSearch(searchInputValue)
    }

    const categories =["All", "Recent", "Food", "Music", "Sports", "Art"]


//useEffect to populate event useState, reloads when search is submitted, category is changed or show more button is clicked (skip changes)

    useEffect(() => {
        const loadEvents = async () => {
            try{
                setLoading(true);

                const{data: eventData} = await axios.get(`http://localhost:3000/events?category=${category}&searchTerm=${submittedSearch}&limit=20&skip=${skip}`)
                setEvents(prevEvents => [...prevEvents, ...eventData])
            }catch(error){
                console.error("Failed to load Events:", error);
            }finally{
                setLoading(false)
            }
        }
        loadEvents();
    }, [submittedSearch, category, skip])

    const handleCreateClick = () => {
        setShowModal(true)
    }

    const handleCloseModalClick =() => {
        setShowModal(false)
    }
    

    return (
        <>

        <div>
            {/* //Creates Search button and sets Submitted Search Input */}
            <div className="searchBarContainer">
            <form onSubmit={handleSearchSubmit}>
                <input className="searchBar"
                    type="text"
                    name="query"
                    placeholder="search"
                    value={searchInputValue}
                    onChange={handleOnSearchInputChange}    
                />
                <button className="searchButton"
                    type="submit"
                >
                    Search
                </button>
                <button className="clearButton"
                type="button"
                onClick={handleClearSearch}
                >
                Clear
                </button>
            </form>
            </div>
            {/* Changes Category useState and creates category buttons */}
            <div className="categoryButtonsContainer">
            {categories.map((cat)=>(
                <li
                className={category === cat ? "is-active" : ""}
                key={cat}
                >
                <button
                    onClick={() => {
                    console.log("Category clicked:", cat);
                    setCategory(cat);
                    }}>
                    {cat}
                </button>
                </li>
            ))}
            </div>
        </div>
            <button className="createEvent" onClick={handleCreateClick}>Create New Event</button> 

            {showModal && (
                <EventModal
                    handleCloseModalClick={handleCloseModalClick} 
                />
            )}

            <div>
                <EventGrid
                    events={fakeEvents}
                    
                />
            </div>
        </>

    );

}
export default eventsPage

// model UserHasTrait{
//     userId              Int
//     traitId             Int
// }

// model UserHasHobby{
//     userId              Int
//     hobbyId             Int

// }
