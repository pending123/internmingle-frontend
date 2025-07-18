import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EventModal from "./EventModal";

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
        <div>
            {/* Changes Category useState and creates category buttons */}
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
            <button onClick={handleCreateClick}>Create New Event</button> 

            {showModal && (
                <EventModal
                    handleCloseModalClick={handleCloseModalClick} 
                />
            )}

            <div>
                <eventGrid
                    events={events}
                    
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