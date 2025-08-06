import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";

import './HomePage.css'

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

  const internConnectionRef = useRef(null);

  const handleFindOutMoreClick = () => {
    if (internConnectionRef.current) {
      internConnectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 999,
          m: 5,
          ml: 10,
          p: 0,   
          lineHeight: 0,
          display: 'inline-block',              
        }}
      >
        <img
          src="/assets/internmingle-blue.png"
          alt="InternMingle Logo"
          style={{
            height: "60px",        
            width: "400px",  
                 
          }}
        />
      </Box>


      <Box
        sx={{
          minHeight: "100vh", 
          overflow: 'hidden',   
          display: 'flex',    
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'flex-start', 
        }}
      >
       
        
        <Container maxWidth="md" sx={{ textAlign: 'left',  ml: { xs: 0, sm: 8 } }}> 
          
          <Typography
            variant="h2" 
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
              lineHeight: 1.1,
              color: "#1a1a1a", 
              mb: 4, 
            }}
          >
            Connect, explore, and discover with InternMingle
          </Typography>

          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleFindOutMoreClick} 
              sx={{
                backgroundColor: "#A9A9A9", 
                "&:hover": { backgroundColor: "#8c8c8c" },
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: "4px", 
                textTransform: "none",
              }}
            >
              Find out More
            </Button>

            <SignUpButton>
              <Button
                variant="contained" 
                size="large"
                sx={{
                  backgroundColor: "#2E5BFF", 
                  "&:hover": { backgroundColor: "#1a4bd9" },
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: "4px", 
                  textTransform: "none",
                }}
              >
                Sign Up
              </Button>
            </SignUpButton>

            <SignInButton >
            <Button
              variant="contained" 
                size="large"
                sx={{
                  backgroundColor: "#2E5BFF", 
                  "&:hover": { backgroundColor: "#1a4bd9" },
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: "4px", 
                  textTransform: "none",
                }}
              >
              Login
            </Button>
          </SignInButton>
          </Box>
        </Container>
      </Box>


      {/* Intern Connection Section */}
      <Box
      ref={internConnectionRef} 
        sx={{
          pb: 4,
          minHeight: "40vh",
        }}
      >
        <Container maxWidth="xl">
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
              <SignInButton >
              <Button
                variant="contained"
                // component={Link}
                // to="/intern-finder"
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
                View Interns Near You
              </Button>
              </SignInButton>
            </Grid>
            {/* Picture of Interns */}

            <Grid size={6} offset={{ md: "auto" }}>
              <img
                src="/assets/internsTalking.png"
                alt="Interns Talking"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  width: "90%", 
                  display: "block",
                  marginLeft: "auto", 
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
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center" columns={12}>
            {/* Picture of Map */}
            <Grid size={6} offset={{ md: "auto" }}>
              <img
                src="/assets/flatMap.png"
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
              <SignInButton>
              <Button
                variant="contained"
                // component={Link}
                // to="/neighborhoods"
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
                Try it now
              </Button>
              </SignInButton>
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
        <Container maxWidth="xl">
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
              <SignInButton>
              <Button
                variant="contained"
                // component={Link}
                // to="/events"
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
                View Events Near You
              </Button>
              </SignInButton>
            </Grid>
            {/* Picture of Interns */}

            <Grid size={6} offset={{ md: "auto" }}>
              <img
                src="/assets/peopleEvents.png"
                alt="Interns Talking"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  width: "90%", 
                  display: "block",
                  marginLeft: "auto", 
                  marginRight: "auto",
                  borderRadius: "8px",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 4}}>
        <h1 style={{ color: '#0073EA', fontSize: '3rem' }}>Meet the Team</h1>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                overflow: 'hidden',
                borderRadius: 2,
              }}
            >
              <Box
                component="img"
                src="/assets/mamadou.jpg"
                alt="Mamadou Ndom"
                sx={{
                  border: '1px solid',
                  borderRadius: 4,
                  width: '300px',
                  height: '300px'
                }}
              />
            </Box>
            <Typography variant="h5" align="center" mt={1}>
              Mamadou Ndom
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                overflow: 'hidden',
                borderRadius: 2,
              }}
            >
              <Box
                component="img"
                src="/assets/brianna.jpg"
                alt="Brianna Farinango"
                sx={{
                  border: '1px solid',
                  borderRadius: 4,
                  width: '300px',
                  height: '300px',
                  objectFit: 'cover'
                }}
              />
            </Box>
            <Typography variant="h5" align="center" mt={1}>
                Brianna Farinango
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                overflow: 'hidden',
                borderRadius: 2,
              }}
            >
              <Box
                component="img"
                src="/assets/divine.jpg"
                alt="Divine Precious-Esue"
                sx={{
                  objectFit: 'cover',
                  border: '1px solid',
                  width: '300px',
                  height: '300px',
                  borderRadius: 4,
                }}
              />
            </Box>
            <Typography variant="h5" align="center" mt={1}>
              Divine Precious-Esue
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
