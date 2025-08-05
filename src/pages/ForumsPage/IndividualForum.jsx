import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Paper, // For the main forum post card
  Avatar, // For author's avatar
  Stack, // For vertical spacing
  Divider, // For separating sections
  TextField, // For comment input
  InputAdornment, // For comment input icon/button
  IconButton, // For upvote icon button
  Snackbar, // For "Copied!" notification
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp'; // Upvote icon
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'; // Comment icon
import EditIcon from '@mui/icons-material/Edit'; // Edit icon
import DeleteIcon from '@mui/icons-material/Delete'; // Delete icon
import ContentCopyIcon from '@mui/icons-material/ContentCopy'; // Copy icon for share
import CloseIcon from '@mui/icons-material/Close'; // Close icon for Snackbar
import ShareIcon from '@mui/icons-material/Share'; // Share icon
import CommentGrid from './CommentGrid';
import { useAuth } from "@clerk/clerk-react";



const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ;

// Helper to format date for display (e.g., "Jul 9, 2025")
const formatDisplayDate = (dateTimeString) => {
  if (!dateTimeString) return 'N/A';
  try {
    return new Date(dateTimeString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

const IndividualForumPage = () => {
  const { id: forumId } = useParams(); 
  const navigate = useNavigate();
  const { userId: currentClerkUserId, getToken } = useAuth();

  const [forum, setForum] = useState(null);
  const [comments, setComments] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentInput, setCommentInput] = useState(''); 
  const [isCommenting, setIsCommenting] = useState(false); 
  const [commentError, setCommentError] = useState(null); 

  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [upvoteLoading, setUpvoteLoading] = useState(false); 
  const [snackbarOpen, setSnackbarOpen] = useState(false); 
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchForumData = async () => { // Renamed for clarity within this useEffect
      console.log("Fetching forum data for forumId:", forumId); // Debugging log
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch Forum Post Details
        const forumRes = await axios.get(`${BACKEND_URL}/api/forums/${forumId}`);
        setForum(forumRes.data);
        console.log("Forum fetched:", forumRes.data); // Debugging

        // 2. Fetch Comments for this Forum Post
        const commentsRes = await axios.get(`${BACKEND_URL}/api/forums/${forumId}/comments`);
        setComments(commentsRes.data);
        console.log("Comments fetched:", commentsRes.data); // Debugging

        // 3. Check Upvote Status for current user
        if (currentClerkUserId) {
          const token = await getToken();
          if (!token) {
            console.warn("No token available for upvote status check. User might not be fully authenticated.");
            setHasUpvoted(false);
          } else {
            const upvoteStatusRes = await axios.get(`${BACKEND_URL}/api/forums/${forumId}/upvote/status`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            setHasUpvoted(upvoteStatusRes.data.hasUpvoted);
            console.log("Upvote status fetched:", upvoteStatusRes.data.hasUpvoted); // Debugging
          }
        } else {
          console.log("User not logged in, skipping upvote status check.");
          setHasUpvoted(false);
        }

      } catch (err) {
        console.error("Failed to fetch forum/comments:", err);
        setError(err.response?.data?.error || 'Failed to load forum post.');
        setForum(null);
        setComments([]);
      } finally {
        setLoading(false);
        console.log("Forum data fetch process finished."); // Debugging
      }
    };

    if (forumId) { // Only fetch if forumId is available from URL
      fetchForumData();
    } else {
      setLoading(false);
      setError("No forum ID provided in the URL.");
    }
  }, [forumId, BACKEND_URL, currentClerkUserId, getToken]);  // Dependencies

  const handleUpvote = async () => {
    if (!currentClerkUserId) {
      alert("Please log in to upvote.");
      return;
    }
    setUpvoteLoading(true);
    try {
      const token = await getToken();
      let response;
      if (hasUpvoted) {
        response = await axios.delete(`${BACKEND_URL}/api/forums/${forumId}/upvote`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setHasUpvoted(false);
        setForum(prev => ({ ...prev, upvoteCount: (prev?.upvoteCount || 0) - 1 })); // Optimistic update
        setSnackbarMessage("Upvote removed!");
      } else {
        response = await axios.post(`${BACKEND_URL}/api/forums/${forumId}/upvote`, {}, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setHasUpvoted(true);
        setForum(prev => ({ ...prev, upvoteCount: (prev?.upvoteCount || 0) + 1 })); // Optimistic update
        setSnackbarMessage("Post upvoted!");
      }
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error upvoting/un-upvoting:", err);
      setSnackbarMessage(err.response?.data?.error || "Failed to update upvote.");
      setSnackbarOpen(true);
      // Revert optimistic update on error
      if (hasUpvoted) { // If it was an un-upvote attempt that failed
        setForum(prev => ({ ...prev, upvoteCount: (prev?.upvoteCount || 0) + 1 }));
      } else { // If it was an upvote attempt that failed
        setForum(prev => ({ ...prev, upvoteCount: (prev?.upvoteCount || 0) - 1 }));
      }
    } finally {
      setUpvoteLoading(false);
    }
  };

  // --- Handle Comment Submission ---
  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) {
      setCommentError("Comment cannot be empty.");
      return;
    }
    if (!currentClerkUserId) {
      alert("Please log in to comment.");
      return;
    }
    setIsCommenting(true);
    setCommentError(null);

    try {
      const token = await getToken();
      const response = await axios.post(`${BACKEND_URL}/api/forums/${forumId}/comments`,
        { textContent: commentInput },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setComments(prev => [...prev, response.data.comment]); // Add new comment to list
      setForum(prev => ({ ...prev, commentCount: (prev?.commentCount || 0) + 1 })); // Optimistic update
      setCommentInput(''); // Clear input
      setSnackbarMessage("Comment added!");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error submitting comment:", err);
      setCommentError(err.response?.data?.error || "Failed to add comment.");
      setSnackbarMessage(err.response?.data?.error || "Failed to add comment.");
      setSnackbarOpen(true);
    } finally {
      setIsCommenting(false);
    }
  };

  // --- Handle Share ---
  const handleShareLink = () => {
    const eventLink = window.location.href;
    const el = document.createElement('textarea');
    el.value = eventLink;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setSnackbarMessage("Link copied to clipboard!");
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };


  // --- Conditional Rendering for Loading, Error, Not Found ---
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading forum post...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error">{error}</Typography>
        <Button variant="contained" onClick={() => navigate('/forums')} sx={{ mt: 2 }}>Go Back to Forums</Button>
      </Container>
    );
  }

  if (!forum) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Forum post not found.</Typography>
        <Button variant="contained" onClick={() => navigate('/forums')} sx={{ mt: 2 }}>Go Back to Forums</Button>
      </Container>
    );
  }

  // Determine if the current user owns this forum post (for edit/delete)
  const isOwner = currentClerkUserId && forum.user && forum.user.clerkId === currentClerkUserId;


  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: '12px', boxShadow: 3, mb: 4 }}>
        {/* Author and Date Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={forum.user?.profileImageUrl || undefined} sx={{ width: 40, height: 40, mr: 1 }}>
            {forum.user?.firstName?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {forum.user?.firstName} {forum.user?.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Last Edited: {formatDisplayDate(forum.createdAt)}
            </Typography>
          </Box>
        </Box>

        {/* Forum Title */}
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1a1a1a', mb: 2 }}>
          {forum.title}
        </Typography>

        {/* Forum Text Content */}
        <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 3 }}>
          {forum.textContent}
        </Typography>

        {/* Upvote, Comment Count, Share, Edit, Delete Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderTop: '1px solid #f0f0f0', pt: 2 }}>
          {/* Upvote */}
          <IconButton
            size="small"
            color={hasUpvoted ? 'primary' : 'default'} // Blue if upvoted
            onClick={handleUpvote}
            disabled={upvoteLoading || !currentClerkUserId} // Disable if loading or not logged in
            aria-label="upvote post"
          >
            <ThumbUpIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
            {forum.upvoteCount}
          </Typography>

          {/* Comment Count */}
          <IconButton size="small" color="info" aria-label="comments">
            <ChatBubbleOutlineIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
            {forum.commentCount || 0}
          </Typography>

          {/* Share Button */}
          <Button
            variant="outlined"
            size="small"
            startIcon={<ShareIcon />}
            onClick={handleShareLink}
            sx={{ textTransform: 'none', borderRadius: '8px' }}
          >
            Share
          </Button>

          {/* Edit/Delete Buttons (Conditional) */}
          {isOwner && (
            <>
              {/* <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => }
                sx={{ ml: 2, textTransform: 'none', borderRadius: '8px' }}
              >
                Edit
              </Button> */}
              <Button
                variant="outlined"
                size="small"
                startIcon={<DeleteIcon />}
                color="error"
                onClick={() => alert('Delete functionality to be implemented!')} // Use a dialog for delete
                sx={{ textTransform: 'none', borderRadius: '8px' }}
              >
                Delete
              </Button>
            </>
          )}
        </Box>
      </Paper>

      {/* Add a Comment Section */}
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: '12px', boxShadow: 1, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>Add a Comment</Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Your Comment"
          variant="outlined"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          error={!!commentError} // Show error state
          helperText={commentError} // Display error message
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleCommentSubmit}
          disabled={isCommenting || !currentClerkUserId} // Disable if submitting or not logged in
          sx={{ textTransform: 'none', borderRadius: '8px' }}
        >
          {isCommenting ? <CircularProgress size={24} color="inherit" /> : "Post Comment"}
        </Button>
      </Paper>

      {/* Comments Section */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, color: '#1a1a1a', mb: 2 }}>
        Comments ({comments.length})
      </Typography>
      <CommentGrid comments={comments} loading={loading} error={error} /> {/* Pass comments to CommentGrid */}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

export default IndividualForumPage;