import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  Container,
  Grid,
  Box,
  Paper,
  Card,
  CardContent,
  Button,
  Typography,
} from "@mui/material";

const HomePage = () => {
  return (
    <Box>
      <Box
        sx={{
          minHeight: "20vh",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          pb: 2,
        }}
      >
        <Container maxWidth="lg">
          <Grid alignItems="center">
            <Grid alignItems="center">
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  lineHeight: 1.2,
                  textAlign: "center",
                }}
              >
                Welcome to InternMingle
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                  textAlign: "center",
                }}
              ></Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Intern Connection Section */}
      <Box
        sx={{
          pb: 4,
          minHeight: "40vh",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center" columns={12}>
            <Grid size={6}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: "#1a1a1a",
                  fontSize: { xs: "2rem", md: "2.8rem" },
                }}
              >
                Connect with Other Interns
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  color: "#666",
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                }}
              >
                With InternMingle, you can view other interns in the same city
                and see their profiles, including their university, major,
                internship company, and interests, helping you find common
                ground and initiate connections
              </Typography>
              <Button
                variant="contained"
                component={Link}
                to="/intern-finder"
                size="large"
                sx={{
                  backgroundColor: "#2E5BFF",
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: "8px",
                  textTransform: "none",
                }}
              >
                View Interns Near You →
              </Button>
            </Grid>
            {/* Picture of Interns */}

            <Grid size={6} offset={{ md: "auto" }}>
              <img
                src="src/assets/internsTalking.png"
                alt="Interns Talking"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  width: "90%", // Make it 50% of the Grid item's width
                  display: "block",
                  marginLeft: "auto", // Use specific margin properties for 'auto' with 'style'
                  marginRight: "auto",
                  borderRadius: "8px",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Neighborhood Exploration Page */}
      <Box
        sx={{
          pb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center" columns={12}>
            {/* Picture of Map */}
            <Grid size={6} offset={{ md: "auto" }}>
              <img
                src="src/assets/flatMap.png"
                alt="Interns Talking"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  width: "90%", // Make it 50% of the Grid item's width
                  display: "block",
                  marginLeft: "auto", // Use specific margin properties for 'auto' with 'style'
                  marginRight: "auto",
                  borderRadius: "8px",
                }}
              />
            </Grid>
            <Grid size={6} offset={{ md: "auto" }}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: "#1a1a1a",
                  fontSize: { xs: "2rem", md: "2.8rem" },
                }}
              >
                Explore Neighborhoods
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  color: "#666",
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                }}
              >
                Explore Neighborhoods lets you easily discover new areas,
                providing seamless navigation, insights into pedestrian-friendly
                routes, and the ability to find local attractions, restaurants,
                and amenities.
              </Typography>
              <Button
                variant="contained"
                component={Link}
                to="/neighborhoods"
                size="large"
                sx={{
                  backgroundColor: "#2E5BFF",
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: "8px",
                  textTransform: "none",
                }}
              >
                Try it now →
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Events  Section */}
      <Box
        sx={{
          pb: 4,
          minHeight: "40vh",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center" columns={12}>
            <Grid size={6}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: "#1a1a1a",
                  fontSize: { xs: "2rem", md: "2.8rem" },
                }}
              >
                Join and Create Events
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  color: "#666",
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                }}
              >
                With InternMingle, you can explore a curated list of upcoming
                events in your city with details about the event's purpose,
                location, and time, helping you plan your social calendar and
                meet new people with shared interests.
              </Typography>
              <Button
                variant="contained"
                component={Link}
                to="/events"
                size="large"
                sx={{
                  backgroundColor: "#2E5BFF",
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: "8px",
                  textTransform: "none",
                }}
              >
                View Events Near You →
              </Button>
            </Grid>
            {/* Picture of Interns */}

            <Grid size={6} offset={{ md: "auto" }}>
              <img
                src="src/assets/peopleEvents.png"
                alt="Interns Talking"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  width: "90%", // Make it 50% of the Grid item's width
                  display: "block",
                  marginLeft: "auto", // Use specific margin properties for 'auto' with 'style'
                  marginRight: "auto",
                  borderRadius: "8px",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
