import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EventModal from "./eventModal";

const eventsPage = () => {
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

//useEffect to populate event useState
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

//Changes Category useState and creates category buttons
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

    const handleCreateClick = () => {
        setShowModal(true)
    }

    const handleCloseModalClick =() => {
        setShowModal(false)
    }
    //Creates Search button and sets Submitted Search Input
    <form onSubmit={handleSearchSubmit}>
        <input
            type="text"
            name="query"
            placeholder="search"
            value={searchInputValue}
            onChange={handleOnSearchInputChange}    
        />
        <button
            type="submit"
        >
            Search
        </button>
        <button
        type="button"
        onClick={handleClearSearch}
        >
        Clear
        </button>
    </form>

    return (
        <>
            <button onClick={handleCreateClick}>Create New Event</button> {/* This button OPENS the modal */}

            {showModal && (
                <EventModal
                    handleCloseModalClick={handleCloseModalClick} // <-- Pass this so modal can close itself
                    // If you want the parent to know when the event is created, pass a callback:
                    // onEventCreated={handleEventCreated} // Example callback
                />
            )}
        </>
    );

}
export default eventsPage