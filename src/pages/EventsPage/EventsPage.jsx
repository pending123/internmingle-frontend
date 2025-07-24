import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./EventsPage.css";
import EventModal from "./eventModal";
import EventGrid from "./EventGrid";
import SearchBar from "../../components/SearchBar/SearchBar";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

const eventsPage = () => {
  

  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState("All");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClearSearch = () => {
    setSearchInputValue("");
    setSubmittedSearch("");
  };

  const handleOnSearchInputChange = (event) => {
    setSearchInputValue(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSubmittedSearch(searchInputValue);
  };

  const categories = ["All", "Food", "Music", "Sports", "Art"];

  //useEffect to populate event useState, reloads when search is submitted, category is changed or show more button is clicked (skip changes)

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);

        const { data: eventData } = await axios.get(
          `http://localhost:3001/events?category=${category}&searchTerm=${submittedSearch}&limit=20&skip=${skip}`
        );
        if (skip === 0) {
          setEvents(eventData);
        } else {
          setEvents((prevEvents) => [...prevEvents, ...eventData]);
        }
      } catch (error) {
        console.error("Failed to load Events:", error);
      } finally {
        setLoading(false);
      }
      console.log(events);
    };
    loadEvents();
  }, [submittedSearch, category, skip]);

  const handleCreateClick = () => {
    setShowModal(true);
  };

  const handleCloseModalClick = () => {
    setShowModal(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: "#1a1a1a",
            fontSize: { xs: "2rem", md: "2.5rem" },
          }}
        >
          Events in San Francisco
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#666",
            fontSize: "1.1rem",
          }}
        >
          Discover exciting events and connect with fellow interns in the city.
        </Typography>
      </Box>

      {/* Search and Filter Controls */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          mb: 4,
        }}
      >
        {/* Left Side - Categories */}
        <Box sx={{ flex: 1 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                onClick={() => {
                  console.log("Category clicked:", cat);
                  setCategory(cat);
                }}
                variant={category === cat ? "filled" : "outlined"}
                size="medium"
                sx={{
                  backgroundColor: category === cat ? "#2E5BFF" : "transparent",
                  color: category === cat ? "white" : "#666",
                  borderColor: category === cat ? "#2E5BFF" : "#A9A9A9",
                  fontWeight: category === cat ? 600 : 400,
                  fontSize: "1rem",
                  height: "40px",
                  px: 2,
                  "&:hover": {
                    backgroundColor: category === cat ? "#1B4AEF" : "#f5f5f5",
                    borderColor: category === cat ? "#1B4AEF" : "#bbb",
                  },
                  cursor: "pointer",
                  mb: 1,
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Right Side - Search Bar */}
        <Box
          sx={{
            minWidth: { xs: "100%", md: "350px" },
            maxWidth: { xs: "100%", md: "400px" },
          }}
        >
          <form onSubmit={handleSearchSubmit}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search Events..."
                value={searchInputValue}
                onChange={handleOnSearchInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#666" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    "&:hover fieldset": {
                      borderColor: "#2E5BFF",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2E5BFF",
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#2E5BFF",
                  px: 3,
                  py: 1.5,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                  minWidth: "auto",
                  height: "56px",
                }}
              >
                Search
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={handleClearSearch}
                sx={{
                  borderColor: "#A9A9A9",
                  color: "#666",
                  px: 3,
                  py: 1.5,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 600,
                  minWidth: "auto",
                  height: "56px",
                }}
              >
                Clear
              </Button>
            </Box>
          </form>
        </Box>
      </Box>

      {/* Create Event Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
          sx={{
            backgroundColor: "#4CAF50",
            color: "white",
            px: 4,
            py: 1.5,
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#45a049",
            },
          }}
        >
          Create New Event
        </Button>
      </Box>

      {/* Event Modal */}
      {showModal && (
        <EventModal handleCloseModalClick={handleCloseModalClick} />
      )}

      {/* Events Grid */}
      <EventGrid events={events} />
    </Container>
  );
};
export default eventsPage;
