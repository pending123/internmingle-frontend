import React from "react";
import {
  Box,
  Typography,
  Paper, 
  Stack, 
  CircularProgress, 
  IconButton,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp"; 
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"; 
import { Link } from "react-router-dom";

const formatPostDate = (dateTimeString) => {
  if (!dateTimeString) return "N/A";
  try {
    return new Date(dateTimeString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Invalid Date";
  }
};

const ForumGrid = ({ forums, loading, error }) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading forum posts...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: "center", py: 2 }}>
        {error}
      </Typography>
    );
  }

  if (!forums || forums.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4, color: "#666" }}>
        <Typography variant="h6">No forum posts to display.</Typography>
        <Typography variant="body1">Be the first to create one!</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {forums.map((forum) => (
        <Paper
          key={forum.forumId}
          elevation={1}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: "12px",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              boxShadow: 3,
              transform: "translateY(-2px)",
            },
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            component={Link}
            to={`/forums/${forum.forumId}`}
            sx={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 0.5, color: "#1a1a1a" }}
            >
              {forum.title.length > 60
                ? `${forum.title.substring(0, 60)}...`
                : forum.title}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {forum.upvoteCount !== undefined
                ? `${forum.upvoteCount} Upvotes`
                : "N/A Upvotes"}
              {forum.commentCount !== undefined
                ? ` • ${forum.commentCount} Comments`
                : ""}
              {` • Created At: ${formatPostDate(forum.createdAt)}`}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Author: {forum.user?.firstName} {forum.user?.lastName}
            </Typography>

            <Typography
              variant="body2"
              color="text.primary"
              sx={{ lineHeight: 1.5 }}
            >
              {forum.textContent.length > 100
                ? `${forum.textContent.substring(0, 100)}...`
                : forum.textContent}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 1,
              mt: 2,
              pt: 1,
              borderTop: "1px solid #f0f0f0",
            }}
          >
           <ThumbUpIcon fontSize="small" sx={{ color: 'primary.main' }} /> {/* Use theme color */}
              <Typography variant="body2" color="text.secondary">
                {forum.upvoteCount}
              </Typography>
            <IconButton
              size="small"
              color="info"
              aria-label="comments"
              component={Link}
              to={`/forums/${forum.forumId}`}
            >
              <ChatBubbleOutlineIcon fontSize="small" />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {forum.commentCount || 0}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Stack>
  );
};

export default ForumGrid;
