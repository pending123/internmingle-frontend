import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import {
    Box,
    Typography,
    Divider,
    Grid,
    Avatar,
    Chip,
    Stack,
    Button,
    Container,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StraightenIcon from '@mui/icons-material/Straighten';
import HomeIcon from '@mui/icons-material/Home';
import CakeIcon from '@mui/icons-material/Cake';
import EditIcon from '@mui/icons-material/Edit';

import { useScrollToTop } from '../../hooks/useScrollToTop';
import EditProfileModal from './EditProfileModal';
import { getAge, getWeeksBetween } from '../../utils/TimeHelper';

// Helper functions so json doesn't add a default date if a user doesn't enter one
const formatDate = (d: string | null | undefined): string => 
  !d || isNaN(new Date(d).getTime()) || new Date(d).getFullYear() < 1970 
    ? '--' 
    : new Date(d).toLocaleDateString('en-us', { year: 'numeric', month: 'long', day: 'numeric' });

const formatAge = (b: Date | string | null | undefined): string => 
  !b || isNaN(new Date(b).getTime()) || new Date(b).getFullYear() < 1970 
    ? '--' 
    : getAge(new Date(b)).toString();

const formatDuration = (s: string | null | undefined, e: string | null | undefined): string => 
  !s || !e || isNaN(new Date(s).getTime()) || isNaN(new Date(e).getTime()) || 
  new Date(s).getFullYear() < 1970 || new Date(e).getFullYear() < 1700 
    ? '--' 
    : `${getWeeksBetween(new Date(s), new Date(e))} weeks`;

type Profile = {
    userId: number;
    firstName: string;
    lastName: string;
    imageUrl?: string;
    gender: string;
    birthday?: Date | null;
    university: string;
    schoolMajor: string;
    company: string;
    workPosition: string;
    workCity: string;
    workZipcode?: string;
    internshipStartDate: string | null;
    internshipEndDate: string | null;
    bio: string;
    isLookingForHousing: boolean;
    hobbies: string[];
    traits: string[];
    sleepSchedule?: string;
    numOfRoomates?: number;
    noiseLevel?: string;
};

export default function PersonalProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const { getToken } = useAuth();

    useScrollToTop();

    useEffect(() => {
        async function fetchProfile() {
            try {
                const token = await getToken();
                
                if (!token) {
                    console.error('No authentication token available');
                    return;
                }

                const { data } = await axios.get('/api/profiles/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProfile(data);
            } catch (err) {
                console.error('Error fetching profile');
            }
        }
        fetchProfile();
    }, [getToken]);

    const handleProfileUpdate = (updatedProfile: Profile) => {
        setProfile(updatedProfile);
    };

    const handleEditClick = () => {
        setEditModalOpen(true);
    };

    const handleEditClose = () => {
        setEditModalOpen(false);
    };

    return !profile ? null : (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* Profile Header */}
            <Box
                sx={{
                    bgcolor: "white",
                    p: { xs: 3, sm: 4 },
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    mb: 2
                }}
            >
                {/* Profile Photo and Name/Work info */}
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} sm={2}>
                        <Avatar 
                            src={profile.imageUrl}
                            sx={{ width: 175, height: 175 }}
                        />
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
                            
                            {/* Edit Profile Button */}
                            <Button
                                variant="contained"
                                onClick={handleEditClick}
                                startIcon={<EditIcon />}
                                sx={{
                                    mt: 1.5,
                                    backgroundColor: '#0073EA',
                                    color: 'white',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '2rem',
                                    fontWeight: 500,
                                    textTransform: 'none',
                                    width: 'fit-content',
                                    '&:hover': {
                                        backgroundColor: '#0056b3',
                                    }
                                }}
                            >
                                Edit Profile
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>

            {/* Profile Bio and Details */}
            <Box
                sx={{
                    bgcolor: "white",
                    p: { xs: 3, sm: 4 },
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                }}
            >
                {/* About Me Section */}
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

                {/* Basic Info and Internship Details Section */}
                <Grid container spacing={10}>
                    {/* Basic Info */}
                    <Grid item size={6}>
                        <Box sx={{ height: '100%' }}> 
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
                                        <Typography variant="body2" fontWeight="bold">School:</Typography>
                                        <Typography variant="body2" color="text.secondary">{profile.university}</Typography>
                                    </Box>
                                )}
                                {profile.company && (
                                    <Box>
                                        <Typography variant="body2" fontWeight="bold">Company:</Typography>
                                        <Typography variant="body2" color="text.secondary">{profile.company}</Typography>
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
                                        <Typography variant="body2" color="text.secondary">{formatAge(profile.birthday)}</Typography>
                                    </Box>
                                )}
                            </Stack>
                        </Box>
                    </Grid>

                    {/* Internship Details */}
                    <Grid item size={6}>
                        {(profile.internshipStartDate || profile.internshipEndDate || profile.workPosition) && (
                            <Box sx={{ height: '100%' }}>
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
                                    <Box>
                                        <Typography variant="body2" fontWeight="bold">Start Date:</Typography>
                                        <Typography variant="body2" color="text.secondary">{formatDate(profile.internshipStartDate)}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" fontWeight="bold">End Date:</Typography>
                                        <Typography variant="body2" color="text.secondary">{formatDate(profile.internshipEndDate)}</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" fontWeight="bold">Duration:</Typography>
                                        <Typography variant="body2" color="text.secondary">{formatDuration(profile.internshipStartDate, profile.internshipEndDate)}</Typography>
                                    </Box>
                                </Stack>
                            </Box>
                        )}
                    </Grid>
                </Grid>

                {/* Interests & Traits Section */}
                {(profile.traits?.length > 0 || profile.hobbies?.length > 0) && (
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
                                <Stack direction="row" flexWrap="wrap" spacing={1}>
                                    {profile.traits.map((trait, index) => (
                                        <Chip 
                                            key={index} 
                                            label={trait} 
                                            size="medium" 
                                            variant="filled" 
                                            sx={{
                                                backgroundColor: '#0073EA',
                                                color: 'white',             
                                                fontWeight: 600,            
                                            }} 
                                        />
                                    ))}
                                </Stack>
                            </Box>
                        )}

                        {profile.hobbies && profile.hobbies.length > 0 && (
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Hobbies:</Typography>
                                <Stack direction="row" flexWrap="wrap" spacing={1}>
                                    {profile.hobbies.map((hobby, index) => (
                                        <Chip 
                                            key={index} 
                                            label={hobby} 
                                            size="medium" 
                                            variant="filled" 
                                            sx={{
                                                backgroundColor: '#0073EA',
                                                color: 'white',             
                                                fontWeight: 600,            
                                            }}
                                        />
                                    ))}
                                </Stack>
                            </Box>
                        )}
                    </Box>
                )}

                {/* Housing Preferences Section */}
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
                                    <Box>
                                        <Typography variant="body2" fontWeight="bold">Sleep Schedule:</Typography>
                                        <Typography variant="body2" color="text.secondary">{profile.sleepSchedule}</Typography>
                                    </Box>
                                )}
                                {profile.numOfRoomates !== undefined && (
                                    <Box>
                                        <Typography variant="body2" fontWeight="bold">Number of Roommates:</Typography>
                                        <Typography variant="body2" color="text.secondary">{profile.numOfRoomates}</Typography>
                                    </Box>
                                )}
                                {profile.noiseLevel && (
                                    <Box>
                                        <Typography variant="body2" fontWeight="bold">Noise Level:</Typography>
                                        <Typography variant="body2" color="text.secondary">{profile.noiseLevel}</Typography>
                                    </Box>
                                )}
                            </Stack>
                        </Grid>
                    </Box>
                )}
            </Box>

            {/* Edit Profile Modal */}
            {profile && (
                <EditProfileModal
                    open={editModalOpen}
                    onClose={handleEditClose}
                    profile={profile}
                    onProfileUpdate={handleProfileUpdate}
                />
            )}
        </Container>
    );
}