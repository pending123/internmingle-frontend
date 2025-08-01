import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const formatCommentDate = (dateTimeString) => {
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

const CommentGrid = ({ comments, loading, error }) => { 
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading comments...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: 'center', py: 2 }}>
        {error}
      </Typography>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4, color: '#666' }}>
        <Typography variant="body1">No comments yet. Be the first to add one!</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}> 
      {comments.map(comment => (
        <Paper
          key={comment.commentId} 
          elevation={0} 
          sx={{
            p: { xs: 2, sm: 3 }, 
            borderRadius: '8px',
            border: '1px solid #e0e0e0', 
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar src={comment.user?.profileImageUrl || undefined} sx={{ width: 30, height: 30, mr: 1 }}>
              {comment.user?.firstName?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {comment.user?.firstName} {comment.user?.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              {formatCommentDate(comment.createdAt)}
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
            {comment.textContent}
          </Typography>
        </Paper>
      ))}
    </Stack>
  );
};

export default CommentGrid;