import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  Paper,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ForumGrid from "./ForumGrid";
import ForumModal from "./ForumModal";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ForumPage = () => {
  const [forums, setForums] = useState([]);
  const [sortBy, setSortBy] = useState("Newest");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const categories = ["Most Upvotes", "Least Upvotes", "Newest", "Oldest"];

  useEffect(() => {
    const loadForums = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: forumData } = await axios.get(
          `${BACKEND_URL}/api/forums?sortBy=${sortBy}&searchTerm=${submittedSearch}`
        );
        setForums(forumData);
      } catch (error) {
        console.error("Failed to load Forums: ", error);
      } finally {
        setLoading(false);
      }
    };
    loadForums();
  }, [submittedSearch, sortBy]);

  const handleCreateClick = () => {
    setShowModal(true);
  };

  const handleCloseModalClick = () => {
    setShowModal(false);
  };
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: { xs: "100%", sm: "300px" } }}>
          <form onSubmit={handleSearchSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search Through Posts"
              value={searchInputValue}
              onChange={handleOnSearchInputChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#666" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {searchInputValue && (
                      <IconButton
                        onClick={handleClearSearch}
                        size="small"
                        edge="end"
                      >
                        <CloseIcon />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  "&:hover fieldset": { borderColor: "#2E5BFF" },
                  "&.Mui-focused fieldset": { borderColor: "#2E5BFF" },
                },
              }}
            />
          </form>
        </Box>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="sort-by-label">Categories</InputLabel>
          <Select
            labelId="sort-by-label"
            id="sort-by-select"
            value={sortBy}
            label="Categories"
            onChange={(e) => {
              setSortBy(e.target.value);
            }}
            sx={{ borderRadius: "8px" }}
          >
            {categories.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
          sx={{
            backgroundColor: "#2E5BFF",
            color: "white",
            px: 3,
            py: 1.5,
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": { backgroundColor: "#1B4AEF" },
          }}
        >
          Create +
        </Button>
      </Box>

      <Grid container spacing={4} alignItems="stretch" columns={12}>
        <Grid size = {8}
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {error ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="error">
                {error}
              </Typography>
            </Box>
          ) : (
            <ForumGrid forums={forums} loading={loading} error={error} />
          )}
        </Grid>

        <Grid offset={{ md: "auto" }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: "12px",
              boxShadow: 1,
              bgcolor: "#f8f9fa",
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 600, color: "#1a1a1a" }}
            >
              Forum Rules
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                1. Be respectful and constructive.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2. No spam or self-promotion.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                3. Keep discussions on topic.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                4. No hate speech or harassment.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                5. Report inappropriate content.
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <ForumModal
        open={showModal}
        handleCloseModalClick={handleCloseModalClick}
      />
    </Container>
  );
};
export default ForumPage;
