import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Button, Chip, Grid,CircularProgress } from "@mui/material";
import { format } from "date-fns"; // For date formatting
import { useParams } from "react-router-dom";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL


const Event = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `${BACKEND_URL}/events/${eventId}`
        );
        setEvent(response.data);
      } catch (err) {
        console.error("Failed to fetch event:", err);
        setError("Failed to load event details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    } else {
      setLoading(false);
      setError("No event ID provided in the URL.");
    }
  }, [eventId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading event details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.history.back()}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  if (!event) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6">Event not found.</Typography>
        <Button
          variant="contained"
          onClick={() => window.history.back()}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  // Format date and time for display
  const formattedDate = event.dateTime
    ? format(new Date(event.dateTime), "EEEE, MMMM d, yyyy")
    : "Date TBD";
  const formattedTime = event.dateTime
    ? format(new Date(event.dateTime), "h:mm a")
    : "Time TBD";

  // Placeholder image since imgUrl is null
  const imageUrl = event.imgUrl || '/assets/AddImage.png';

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="md">
        <Grid container spacing={6} alignItems="center" columns={12}>
          <Grid size={6}>
            {/* Event Image Section */}
            <Box
              sx={{
                width: "100%",
                height: { xs: 200, sm: 350, md: 450 },
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                mb: 4,
              }}
            />
          </Grid>
          {/* Event Header Section */}
          <Grid size={6}>
            <Box sx={{ mb: 4, textAlign: "left" }}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: "#1a1a1a",
                  fontSize: { xs: "2.2rem", sm: "3rem", md: "3.5rem" },
                  lineHeight: 1.1,
                }}
              >
                {event.title}
              </Typography>
              <Typography
                variant="h6"
                component="p"
                sx={{
                  color: "#555",
                  fontSize: { xs: "1rem", sm: "1.15rem" },
                  mb: 1,
                }}
              >
                {formattedDate} at {formattedTime}
              </Typography>
              <Typography
                variant="body1"
                component="p"
                sx={{
                  color: "#777",
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  mb: 2,
                }}
              >
                Location: {event.location}
              </Typography>
              {event.category.toLowerCase() !== "none" && (
                <Chip
                  label={event.category}
                  size="small"
                  sx={{
                    backgroundColor: "#E8F0FF",
                    color: "#2E5BFF",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    px: 1,
                    py: 0.5,
                  }}
                />
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Event Description and Actions Section */}
        <Box
          sx={{
            bgcolor: "white",
            p: { xs: 3, sm: 4 },
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600, color: "#1a1a1a", mb: 2 }}
          >
            About This Event
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#444", lineHeight: 1.7, mb: 3 }}
          >
            {event.description}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: "#2E5BFF",
                color: "#2E5BFF",
                "&:hover": {
                  borderColor: "#1a4bd9",
                  color: "#1a4bd9",
                  bgcolor: "rgba(46, 91, 255, 0.04)",
                },
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: "8px",
                textTransform: "none",
              }}
              onClick={() =>
                alert("Share Event clicked! Need to Drop Modal to copy Link")
              }
            >
              Share Event
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Event;
