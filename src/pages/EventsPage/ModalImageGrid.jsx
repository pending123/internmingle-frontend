import { ImageList, ImageListItem, CircularProgress, Typography, Box } from '@mui/material';


const ModalImageGrid = ({ results, onSelectImage, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Searching for photos...</Typography>
      </Box>
    );
  }

  if (results.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
        No photos found. Try a different search term.
      </Typography>
    );
  }

  return (
    <ImageList cols={3} rowHeight={164} gap={8}> 
      {results.map((item) => (
        <ImageListItem key={item.id} onClick={() => onSelectImage(item.urls.regular)} sx={{ cursor: 'pointer' }}>
          <img
            srcSet={`${item.urls.small}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            src={`${item.urls.small}?w=164&h=164&fit=crop&auto=format`}
            alt={item.alt_description || item.description || 'Unsplash Photo'}
            loading="lazy"
            style={{ borderRadius: '8px', objectFit: 'cover' }}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};

export default ModalImageGrid
