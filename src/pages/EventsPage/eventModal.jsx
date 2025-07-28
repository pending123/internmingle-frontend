import axios from "axios";
import { useState } from "react";
import "./EventModal.css";
import { useAuth } from "@clerk/clerk-react";
import ImageSearchResultsGrid from "./ModalImageGrid";
import {
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  Stack,
  CircularProgress,
  InputAdornment,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { styled } from "@mui/system";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const mapsKey = import.meta.env.VITE_MAPS_API_KEY;

const CategoryButton = styled(Button)(({ theme, active }) => ({
  margin: theme.spacing(0.5),
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  textTransform: "none",
  fontWeight: 600,
  backgroundColor: active ? "#2E5BFF" : "#e0e0e0",
  color: active ? "#fff" : "#333",
  "&:hover": {
    backgroundColor: active ? "#1a4bd9" : "#d0d0d0",
  },
}));

//Gets event creation info from Modal and posts it to db
const EventModal = ({ handleCloseModalClick }) => {
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [photoSearchInput, setPhotoSearchInput] = useState("");
  const [imageResults, setImageResults] = useState([]);
  const [showImages, setShowImages] = useState(false);
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  const [locationSearchInput, setLocationSearchInput] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isSearchingLocations, setIsSearchingLocations] = useState(false);
  const [locationSearchError, setLocationSearchError] = useState(null);
  const [selectedPlaceData, setSelectedPlaceData] = useState(null);
  const categories = ["Food", "Music", "Sports", "Art", "None"];

  const resetModal = () => {
    setCategory("");
    setLocation("");
    setDate("");
    setTime("");
    setDescription("");
    setTitle("");
    setImageUrl("");
    setPhotoSearchInput("");
    setImageResults([]);
    setShowImages(false);
    setIsSearchingImages(false);
    setLocationSearchInput("");
    setLocationSuggestions([]);
    setIsSearchingLocations(false);
    setLocationSearchError(null);
    setSelectedPlaceData(null);
  };

  const { isLoaded, userId: clerkId, getToken } = useAuth();
  //fetches query results from unsplash API
  const handleImageSearch = async (event) => {
    event.preventDefault();
    setImageUrl("");
    setIsSearchingImages(true);
    setImageResults([]);
    const query = photoSearchInput;
    const { data } = await axios.get(
      `${BACKEND_URL}/api/photos/search?query=${query}`
    );
    setImageResults(data.results);
    setShowImages(true);
    setIsSearchingImages(false);
  };

  const handleImageSelect = (imgUrl) => {
    setImageUrl(imgUrl);
    setShowImages(false);
   
  };

  //This method will be called onclick to send user event data to the backend
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const combinedDateTime = `${date}T${time}`;
      console.log(selectedPlaceData)

    const eventData = {
      title: title,
      category: category,
      dateTime: combinedDateTime,
      description: description,
      imgUrl: imageUrl,
      location: selectedPlaceData ? selectedPlaceData.location : locationSearchInput,
      latitude: selectedPlaceData ? selectedPlaceData.latitude : null,
      longitude: selectedPlaceData ? selectedPlaceData.longitude : null,
      placeId: selectedPlaceData ? selectedPlaceData.placeId : null,
      placeName: selectedPlaceData ? selectedPlaceData.placeName : null,
    };

    try {
      const token = await getToken();
      console.log(eventData);
      await axios.post(`${BACKEND_URL}/events`, eventData, {
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

  const handleLocationAutocompleteChange = async (event, newInputValue) => {
    setLocationSearchInput(newInputValue);

    if (newInputValue.length > 1) {
      setIsSearchingLocations(true);
      setLocationSearchError(null);
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/places/autocomplete`,
          {
            params: { input: newInputValue },
          }
        );
        setLocationSuggestions(response.data.predictions || []);
      } catch (error) {
        console.error("Error fetching location suggestions:", error.message);
        setLocationSearchError(
          "Failed to get location suggestions. Please try again."
        );
        setLocationSuggestions([]);
      } finally {
        setIsSearchingLocations(false);
      }
    } else {
      setLocationSuggestions([]);
      setIsSearchingLocations(false);
      setLocationSearchError(null);
    }
  };

  const handleLocationSelect = async (event, newValue) => {
    if (newValue && newValue.place_id) {
      setIsSearchingLocations(true);
      setLocationSearchError(null);
      setLocationSuggestions([]);

      try {
        const response = await axios.get(`${BACKEND_URL}/api/places/details`, {
          params: { place_id: newValue.place_id },
        });
        const placeDetails = response.data.result;

        setSelectedPlaceData({
          location: placeDetails.formatted_address,
          latitude: placeDetails.geometry.location.lat,
          longitude: placeDetails.geometry.location.lng,
          placeId: placeDetails.place_id,
          placeName: placeDetails.name,
        });
        setLocation(placeDetails.formatted_address);
      } catch (error) {
        console.error("Error fetching place details:", error.message);
        setLocationSearchError(
          "Failed to get full place details. Please re-select."
        );
        setSelectedPlaceData(null);
      } finally {
        setIsSearchingLocations(false);
      }
    } else {
      setSelectedPlaceData(null);
      setLocation("");
    }
  };

  return (
    <Dialog open={open} onClose={handleCloseModalClick} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: 600, textAlign: "center", mt: 1 }}
        >
          Create New Event
        </Typography>
      </DialogTitle>
      <DialogContent>
        {" "}
        <Box
          component="form"
          onSubmit={handleFormSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Event Title */}
          <TextField
            label="Event Title"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            margin="normal"
            variant="outlined"
          />

          {/* Location */}
          <Autocomplete
            id="location-autocomplete"
            options={locationSuggestions}
            getOptionLabel={(option) => {
              if (typeof option === "string") {
                return option;
              }
              if (option && option.description) {
                return option.description;
              }
              if (option && option.address) {
                return option.address;
              }
              return "";
            }}
            loading={isSearchingLocations}
            onInputChange={handleLocationAutocompleteChange}
            onChange={handleLocationSelect}
            value={selectedPlaceData}
            freeSolo
            isOptionEqualToValue={(option, value) => {
              if (!value) return false;
              if (typeof option === "string") {
                return option === value.description || option === value.address;
              }
              return option.place_id === value.place_id;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Event Location"
                variant="outlined"
                fullWidth
                margin="normal"
                required
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isSearchingLocations ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
          {selectedPlaceData && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: -1, mb: 1 }}
            >
              Selected:{" "}
              {selectedPlaceData.placeName || selectedPlaceData.address}
            </Typography>
          )}

          {/* Description */}
          <TextField
            label="Description"
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            fullWidth
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
             sx={{ mt: -1, mb:-1 }}
          />

          {/* Category button selection */}
          <Box sx={{ mt: 2, mb: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Categories:
            </Typography>
            <Stack direction="row" flexWrap="wrap" spacing={1}>
              {categories.map((cat) => (
                <CategoryButton
                  key={cat}
                  active={category === cat ? 1 : 0}
                  onClick={() => setCategory(cat)}
                  variant={category === cat ? "contained" : "outlined"}
                  color={category === cat ? "primary" : "default"}
                >
                  {cat}
                </CategoryButton>
              ))}
            </Stack>
          </Box>
          <TextField
            label="Search Event Photo"
            id="photoSearch"
            name="photoSearch"
            value={photoSearchInput}
            onChange={(e) => setPhotoSearchInput(e.target.value)}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button onClick={handleImageSearch} edge="end">
                    Search
                  </Button>
                </InputAdornment>
              ),
            }}
          />
          {!imageUrl && (imageResults.length > 0 || showImages) && (
            <ImageSearchResultsGrid
              results={imageResults}
              onSelectImage={handleImageSelect}
              loading={isSearchingImages}
            />
          )}

          {/* Date of Event */}
          <TextField
            label="Event Date"
            id="eventDate"
            name="eventDate"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />

          {/* Time of Event */}
          <TextField
            label="Event Time"
            id="eventTime"
            name="eventTime"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            fullWidth
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, justifyContent: "center" }}>
        {/* Submit/Clar Button */}
        <Button
          type="submit"
          variant="contained"
          size="large"
          sx={{
            backgroundColor: "#2E5BFF",
            "&:hover": { backgroundColor: "#1a4bd9" },
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 600,
            borderRadius: "8px",
            textTransform: "none",
          }}
          onClick={handleFormSubmit}
        >
          Create Event
        </Button>
        <Button
          type="button"
          variant="outlined"
          size="large"
          sx={{
            borderColor: "#ccc",
            color: "#666",
            "&:hover": {
              borderColor: "#999",
              color: "#333",
              bgcolor: "rgba(0,0,0,0.04)",
            },
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 600,
            borderRadius: "8px",
            textTransform: "none",
          }}
          onClick={handleCloseModalClick}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventModal;
