import axios from "axios";
import { useState } from "react";


//Gets event creation info from Modal and posts it to db
const EventModal =  ( {handleCloseModalClick}) => {
    const [category, setCategory] =useState("")
    const [location, setLocation] = useState("")
    const [date, setDate] = useState("")
    const [time, setTime] = useState('');
    const [description, setDescription] =useState("")

    const categories = [ "Food", "Music", "Sports", "Art", "None"]

    const resetModal =() =>{
        setCategory('')
        setLocation('')
        setDate('')
        setTimeInput('')
        setDescription('')
    }
    
    //This method will be called onclick to send user event data to the backend
    const handleFormSubmit = async (event)=>{    
        event.preventDefault()
        
        const combinedDateTime = `${dateInput}T${timeInput}`;

        const eventData = {
            category: category,
            location: location,
            dateTime: combinedDateTime,
            description: description
        }

        try{
            await axios.post("http://localhost:3000/events", eventData)
            handleCloseModalClick()
            resetModal()
        }catch(error){
            console.error("Issue creating Event", error)
        }}

    return(
        <form onSubmit={handleFormSubmit}>
            {/* Location */}
            <label>Location:</label>
            <input 
            type="text" 
            id="location"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            />
            {/* Description */}
            <label>Description</label>
            <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            >
            </textarea>

            {/* Category button selection */}
            <div>
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
        {/* Date of Event */}
        <label>Event Date(YYYY-DD-MM): </label>
        <input
        type="date" 
        id="eventDate"
        name="eventDate"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        />

        {/* TIme of Event */}
        <label> Event Time(00:00):</label>
        <input
            type="time" 
            id="eventTime"
            name="eventTime"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
        />

        <button type="submit">Create Event</button>

        </form>

    )


    
}

export default EventModal