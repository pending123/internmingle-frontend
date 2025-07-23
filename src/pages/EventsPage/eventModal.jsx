import axios from "axios";
import { useState } from "react";
import './EventModal.css'


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
        
        const combinedDateTime = `${date}T${time}`;

        const eventData = {
            category: category,
            location: location,
            dateTime: combinedDateTime,
            description: description
        }

        try{
            console.log("Hello")
            await axios.post("http://localhost:3000/events", eventData)
            handleCloseModalClick()
            resetModal()
        }catch(error){
            console.error("Issue creating Event", error)
        }}

    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Create New Event</h2>
                <form onSubmit={handleFormSubmit}>
                    {/* Location */}

                    <div className="form-group">
                        <label>Location:</label>
                        <input 
                            type="text" 
                            id="location"
                            name="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </div>
                    {/* Description */}
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        >
                        </textarea>
                    </div>

                    {/* Category button selection */}
                    <div className="form-group">
                        <label>Categories:</label>
                        <div className="category-buttons-group">
                            {categories.map((cat)=>(
                            <button
                            type="button"
                            className={category === cat ? "is-active" : ""}
                            key={cat}
                                onClick={() => {
                                console.log("Category clicked:", cat);
                                setCategory(cat);
                                }}>
                                {cat}
                            </button>
                            
                            ))}
                        </div>
                    </div>
                {/* Date of Event */}
                <div className="form-group">
                    <label>Event Date: </label>
                    <input
                    type="date" 
                    id="eventDate"
                    name="eventDate"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    />
                </div>
                {/* TIme of Event */}
                <div className="form-group">
                    <label> Event Time:</label>
                    <input
                        type="time" 
                        id="eventTime"
                        name="eventTime"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />
                </div>
                {/* Submit/Clear Button */}
                    <div className="form-actions">
                        <button type="submit" className="submit-button">Create Event</button>
                        <button type="button" className="cancel-button" onClick={handleCloseModalClick}>Cancel</button>
                    </div>

                </form>
            </div>
        </div>

    )


    
}

export default EventModal