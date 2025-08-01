import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Divider,
  Grid,
  Avatar,
  Chip,
  Stack,
  CircularProgress,
  Button,
  Container,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import SchoolIcon from "@mui/icons-material/School";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import StraightenIcon from "@mui/icons-material/Straighten";
import HomeIcon from "@mui/icons-material/Home";

import WcIcon from "@mui/icons-material/Wc"; // For gender
import CakeIcon from "@mui/icons-material/Cake";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import PeopleIcon from "@mui/icons-material/People";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

const PublicProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id: profileId } = useParams();
  const baseURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    async function fetchProfiles() {
      try {
        setLoading(true); 
        const { data } = await axios.get(
          `${baseURL}/api/profiles/${profileId}`
        );
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profiles");
      }finally {
        setLoading(false); 
      }
    }
    fetchProfiles();
  }, []);

  const formatProfileDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getAge = (birthday) => {
  if (!birthday) return 'N/A';
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const getWeeksBetween = (d1, d2) => {
  if (!d1 || !d2) return 'N/A';
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  return diffWeeks;
};

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading profile...</Typography>
      </Box>
    );
}

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Profile Photo and Name/Work info */}
      <Box
        sx={{
          bgcolor: "white",
          p: { xs: 3, sm: 4 },
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          
        }}
        mb={2}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} sm={2}>
            <Avatar sx={{ width: 175, height: 175 }} />
          </Grid>
          <Grid
            item
            xs={12}
            sm={true}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Stack>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: "#1a1a1a",
                mb: 2,
                textAlign: "left",
              }}
            >
              {profile.firstName} {profile.lastName}
            </Typography>

            {/* Work Position & Company */}
            {profile.workPosition && profile.company && (
              <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <BusinessIcon fontSize="small" /> {profile.workPosition} at {profile.company}
              </Typography>
            )}

            {profile.workCity && (
              <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOnIcon fontSize="small" /> {profile.workCity}
              </Typography>
            )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
      {/* Profile BIo */}
      <Box
        sx={{
          bgcolor: "white",
          p: { xs: 3, sm: 4 },
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        
             {profile.bio && (
          <Box sx={{ mb: 4 }}> 
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: "#1a1a1a", 
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 2,
              }}
            >
              <StraightenIcon fontSize="small" sx={{ color: '#2E5BFF' }} /> About Me
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {profile.bio}
            </Typography>
          </Box>
        )}
        {/* Basic Info Section */}
         <Grid container spacing={10} >
            <Grid item size={6}>
        <Box sx={{  height: '100%' }}> 
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 600,
              color: "#1a1a1a",
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 2,
            }}
          >
            <CalendarTodayIcon fontSize="small" sx={{ color: '#2E5BFF' }} /> Basic Info
          </Typography>
          <Stack divider={<Divider orientation="horizontal" flexItem />} spacing={2}>
            {profile.university && (
              <Box>
                <Typography variant="body2" fontWeight="bold">University:</Typography>
                <Typography variant="body2" color="text.secondary">{profile.university}</Typography>
              </Box>
            )}
            {profile.schoolMajor && (
              <Box>
                <Typography variant="body2" fontWeight="bold">Major:</Typography>
                <Typography variant="body2" color="text.secondary">{profile.schoolMajor}</Typography>
              </Box>
            )}
            {profile.birthday && (
              <Box>
                <Typography variant="body2" fontWeight="bold">Age:</Typography>
                <Typography variant="body2" color="text.secondary">{getAge(new Date(profile.birthday))}</Typography>
              </Box>
            )}
            {profile.gender && (
              <Box>
                <Typography variant="body2" fontWeight="bold">Gender:</Typography>
                <Typography variant="body2" color="text.secondary">{profile.gender}</Typography>
              </Box>
            )}
          </Stack>
        </Box>
        </Grid>
        {/* Internship Details */}
        <Grid item size={6}>
        {(profile.internshipStartDate || profile.internshipEndDate || profile.workPosition) && (
          <Box sx={{  height: '100%' }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontWeight: 600,
                color: "#1a1a1a",
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 2,
              }}
            >
              <BusinessIcon fontSize="small" sx={{ color: '#2E5BFF' }} /> Internship Details
            </Typography>
            <Stack divider={<Divider orientation="horizontal" flexItem />} spacing={2}>
              {profile.internshipStartDate && (
                <Box>
                  <Typography variant="body2" fontWeight="bold">Start Date:</Typography>
                  <Typography variant="body2" color="text.secondary">{formatProfileDate(profile.internshipStartDate)}</Typography>
                </Box>
              )}
              {profile.internshipEndDate && (
                <Box>
                  <Typography variant="body2" fontWeight="bold">End Date:</Typography>
                  <Typography variant="body2" color="text.secondary">{formatProfileDate(profile.internshipEndDate)}</Typography>
                </Box>
              )}
              {profile.internshipStartDate && profile.internshipEndDate && (
                <Box>
                  <Typography variant="body2" fontWeight="bold">Duration:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getWeeksBetween(new Date(profile.internshipStartDate), new Date(profile.internshipEndDate))} weeks
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>
        )}
        </Grid>
        </Grid>
        {/* Traits and Hobbies */}
         <Grid container spacing={10} >
            <Grid item size={6}>
        {(profile.traits && profile.traits.length > 0) || (profile.hobbies && profile.hobbies.length > 0) ? (
          <Box sx={{ mt: 4, mb: 4 }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: "#1a1a1a",
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 2,
              }}
            >
              <CakeIcon fontSize="small" sx={{ color: '#2E5BFF' }} /> Interests & Traits
            </Typography>

            {profile.traits && profile.traits.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Traits:</Typography>
                <Stack direction="row" flexWrap="wrap" sx={{
                columnGap: 1, 
                rowGap: 1,   
              }}>
                  {profile.traits.map((userTrait, index) => (
                    <Chip key={index} label={userTrait} size="medium" variant="filled" sx={{
                        backgroundColor: '#0073EA',
                        color: 'white',             
                        fontWeight: 600,            
                        }} />
                  ))}
                </Stack>
              </Box>
            )}

            {profile.hobbies && profile.hobbies.length > 0 && (
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Hobbies:</Typography>
                <Stack direction="row" flexWrap="wrap"  sx={{
                columnGap: 1, 
                rowGap: 1,   
              }}>
                  {profile.hobbies.map((userHobby, index) => (
                    <Chip key={index} label={userHobby} size="medium" variant="filled" sx={{
                        backgroundColor: '#0073EA',
                        color: 'white',             
                        fontWeight: 600,            
                        }}/>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        ) : null}
        </Grid>
        
        {/* Housing Preferences Section */}
        <Grid item size={6}>
        {profile.isLookingForHousing && (
          <Box sx={{ mt: 4, mb: 4 }}>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: "#1a1a1a",
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 2,
              }}
            >
              <HomeIcon fontSize="small" sx={{ color: '#2E5BFF' }} /> Housing Preferences
            </Typography>
            <Grid container spacing={2}>
                <Stack divider={<Divider orientation="horizontal" flexItem />} spacing={2}>
              {profile.sleepSchedule && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" fontWeight="bold">Sleep Schedule:</Typography>
                  <Typography variant="body2" color="text.secondary">{profile.sleepSchedule}</Typography>
                </Grid>
              )}
              {profile.numOfRoomates !== undefined && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" fontWeight="bold">Desired Roommate Count:</Typography>
                  <Typography variant="body2" color="text.secondary">{profile.numOfRoomates}</Typography>
                </Grid>
              )}
              {profile.noiseLevel && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" fontWeight="bold">Noise Level:</Typography>
                  <Typography variant="body2" color="text.secondary">{profile.noiseLevel}</Typography>
                </Grid>
              )}
              </Stack>
            </Grid>
          </Box>
        )}
        </Grid>
        </Grid>

      </Box>
    </Container>
  );
};

export default PublicProfile;
