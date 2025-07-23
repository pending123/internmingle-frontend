import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  TextField,
  InputAdornment
  
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from '@mui/icons-material/Share'; 
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';

import { format } from "date-fns"; // For date formatting
//import AddImage from "../../../public/assets/AddImage.png";

import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const mapsKey = import.meta.env.VITE_MAPS_API_KEY;

const Event = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const { userId: currentClerkUserId, getToken } = useAuth();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${BACKEND_URL}/events/${eventId}`);
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

  const handleDeleteClick = () => {
    setOpenConfirmDialog(true);
  };
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleConfirmDelete = async () => {
    handleCloseConfirmDialog();

    try {
      const token = await getToken();
      if (!token) {
        alert("Authentication token missing. Please log in again.");
        return;
      }
      console.log("wassup");
      const response = await axios.delete(`${BACKEND_URL}/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Event deleted successfully:", response.data);
      alert("Event deleted successfully!");
      navigate("/events"); // Redirect to events page after successful deletion
    } catch (err) {
      console.error(
        "Failed to delete event:",
        err.response ? err.response.data : err.message
      );
      alert(
        `Failed to delete event: ${
          err.response?.data?.error || "An unexpected error occurred."
        }`
      );
    }
  };

  const handleShareClick = () => {
    setOpenShareDialog(true);
  };

  const handleCloseShareDialog = () => {
    setOpenShareDialog(false);
  };
  const handleCopyLink = () => {
    const eventLink = window.location.href;
    const e = document.createElement('textarea');
    e.value = eventLink;
    document.body.appendChild(e);
    e.select();
    document.execCommand('copy');
    document.body.removeChild(e);

    setSnackbarOpen(true); 
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };


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

  const isUserOwner =
    currentClerkUserId &&
    event.user &&
    event.user.clerkId === currentClerkUserId;
  console.log(isUserOwner);

  // Format date and time for display
  const formattedDate = event.dateTime
    ? format(new Date(event.dateTime), "EEEE, MMMM d, yyyy")
    : "Date TBD";
  const formattedTime = event.dateTime
    ? format(new Date(event.dateTime), "h:mm a")
    : "Time TBD";

  // Placeholder image since imgUrl is null
  const imageUrl = event.imgUrl //|| AddImage;


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
        {/* Map of Location */}

        <Grid container spacing={6} alignItems="stretch" columns={12}>
          <Grid size={6}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 600, color: "#1a1a1a", mb: 2, p: 2, pb: 0 }}
            >
              Location on Map
            </Typography>
            {event.latitude && event.longitude && mapsKey && (
              <Box
                sx={{
                  height: 400,
                  width: "100%",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${
                    event.placeId
                      ? `place_id:${event.placeId}`
                      : `${event.latitude},${event.longitude}`
                  }&zoom=14`}
                  title="Event Location Map"
                ></iframe>
              </Box>
            )}
          </Grid>
          {/* for address if no coordinates/map can be displayed */}
          {(!event.latitude || !event.longitude) && event.address && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mt: 2, textAlign: "center" }}
            >
              Location: {event.address}
            </Typography>
          )}

          {/* Event Description and Actions Section */}

          <Grid size={6} offset={{ md: "auto" }} >
            <Box
              sx={{
                
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
                  
                  size="large"
                  startIcon={<ShareIcon />} 
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
                  onClick={handleShareClick} 
                >
                  
                </Button>

                {isUserOwner && (
                  <IconButton
                    color="error"
                    size="large"
                    onClick={handleDeleteClick}
                  >
                    <DeleteIcon fontSize="inherit" />{" "}
                    {/* <--- The Delete Icon */}
                  </IconButton>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this event? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openShareDialog}
        onClose={handleCloseShareDialog}
        aria-labelledby="share-dialog-title"
      >
        <DialogTitle id="share-dialog-title">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>Share Event</Typography>
            <IconButton edge="end" color="inherit" onClick={handleCloseShareDialog} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Copy the link below to share this event:
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={window.location.href} 
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleCopyLink} edge="end" aria-label="copy link">
                    <ContentCopyIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
      </Dialog>

      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        message="Link copied to clipboard!"
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default Event;
