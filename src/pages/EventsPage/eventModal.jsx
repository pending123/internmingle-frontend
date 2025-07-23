import axios from "axios";
import { useState } from "react";
import "./EventModal.css";
import { useAuth } from "@clerk/clerk-react";

//Gets event creation info from Modal and posts it to db
const EventModal = ({ handleCloseModalClick }) => {
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");

  const categories = ["Food", "Music", "Sports", "Art", "None"];

  const resetModal = () => {
    setCategory("");
    setLocation("");
    setDate("");
    setTime("");
    setDescription("");
    setTitle("");
  };

  const { isLoaded, userId: clerkId, getToken } = useAuth();

  //This method will be called onclick to send user event data to the backend
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const combinedDateTime = `${date}T${time}`;

    const eventData = {
      title: title,
      category: category,
      location: location,
      dateTime: combinedDateTime,
      description: description,
    };
    console.log(combinedDateTime);
    console.log(clerkId);


    try {
      const token = await getToken();
      console.log("Hello");
      console.log(eventData)
      await axios.post("http://localhost:3001/events", eventData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("goodbye");
      handleCloseModalClick();
      resetModal();
    } catch (error) {
      console.error("Issue creating Event", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Event</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label>Event Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
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
            ></textarea>
          </div>

          {/* Category button selection */}
          <div className="form-group">
            <label>Categories:</label>
            <div className="category-buttons-group">
              {categories.map((cat) => (
                <button
                  type="button"
                  className={category === cat ? "is-active" : ""}
                  key={cat}
                  onClick={() => {
                    console.log("Category clicked:", cat);
                    setCategory(cat);
                  }}
                >
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
            <button type="submit" className="submit-button">
              Create Event
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={handleCloseModalClick}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
