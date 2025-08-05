import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ForumModal = ({ open, handleCloseModalClick }) => {
  const [title, setTitle] = useState("");
  const [textContent, setTextContent] = useState("");

  const resetModal = () => {
    setTitle("");
    setTextContent("");
  };

  const { isLoaded, userId: clerkId, getToken } = useAuth();

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const forumData = {
      title: title,
      textContent: textContent,
      clerkId: clerkId,
    };

    if (!isLoaded || !clerkId) {
      console.error("Clerk authentication not loaded or user not signed in.");
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        return;
      }

      console.log("Submitting forum data:", forumData);
      await axios.post(`${BACKEND_URL}/api/forums`, forumData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Forum post created successfully.");
      handleCloseModalClick();
      resetModal();
    } catch (error) {
      console.error("Issue creating Forum Post", error.response ? error.response.data : error.message);
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
          Create New Forum Post
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Box
          component="form"
          onSubmit={handleFormSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Post Title"
            id="forum-title"
            name="forum-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            margin="normal"
            variant="outlined"
          />

          <TextField
            label="Post Content"
            id="forum-content"
            name="forum-content"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            required
            fullWidth
            margin="normal"
            variant="outlined"
            multiline
            rows={6}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, justifyContent: "center" }}>
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
          Create Post
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

export default ForumModal;