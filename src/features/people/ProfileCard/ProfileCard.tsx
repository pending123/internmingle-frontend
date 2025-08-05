import { Link } from "react-router-dom";
import {
  Typography,
  Button,
  Avatar,   
  Chip,     
  Stack,    
  Paper,    
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business'; 
import LocationOnIcon from '@mui/icons-material/LocationOn'; 

type Profile = {
  userId: number;
  firstName?: string; 
  lastName?: string;
  imageUrl?: string; 
  gender?: string; 
  university?: string;
  schoolMajor?: string;
  company?: string;
  workPosition?: string;
  workCity?: string;
  bio?: string;
  isLookingForHousing?: boolean;
  hobbies: string[]; 
  traits: string[];  
};

type ProfileCardProps = {
  profile: Profile;
};

export default function ProfileCard({ profile }: ProfileCardProps) {
    const hobbyTags = profile.hobbies?.slice(0, 2) || [];
    const traitTag = profile.traits?.length > 0 ? [profile.traits[0]] : [];
    const tags = [...hobbyTags, ...traitTag];

    const defaultProfileImage = 'https://placehold.co/150x150/E0E0E0/333333?text=No+Photo';

    return (
        <Paper
            elevation={2} 
            sx={{
                p: 2,
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', 
                gap: 1.5, 
                height: '100%', 
                maxWidth: 400,
                transition: 'all 0.2s ease-in-out', 
                '&:hover': {
                    boxShadow: 4, 
                    transform: 'translateY(-2px)', 
                },
            }}
        >
            {/* Profile Photo */}
            <Avatar
                alt={`${profile.firstName || ''} ${profile.lastName || ''}`}
                src={profile.imageUrl}// || defaultProfileImage} 
                sx={{
                    width: 80, 
                    height: 80,
                    mb: 1, 
                    boxShadow: 1, 
                }}
            >
                {profile.firstName ? profile.firstName.charAt(0).toUpperCase() : ''}
            </Avatar>

            {/* Name */}
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: '#1a1a1a', textAlign: 'center' }}>
                {profile.firstName} {profile.lastName}
            </Typography>

            {/* Work Position & Company */}
            {profile.workPosition && profile.company && (
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textAlign: 'center' }}>
                    <BusinessIcon fontSize="small" /> {profile.workPosition} • {profile.company}
                </Typography>
            )}

            {/* Work City */}
            {profile.workCity && (
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, textAlign: 'center' }}>
                    <LocationOnIcon fontSize="small" /> {profile.workCity}
                </Typography>
            )}

            {/* Tags (Traits & Hobbies) */}
            {tags.length > 0 && (
                <Stack direction="row" flexWrap="wrap" spacing={1} rowGap={1} sx={{ justifyContent: 'center', mt: 1,  }}>
                    {tags.map((tag, index) => (
                        <Chip
                            key={index} 
                            label={tag}
                            size="small"
                            variant="outlined" 
                            sx={{
                                backgroundColor: '#e0e0e0', 
                                color: '#333',
                                fontWeight: 500,
                                '&:hover': {
                                    backgroundColor: '#d0d0d0', 
                                },
                            }}
                        />
                    ))}
                </Stack>
            )}

            {/* View Profile Button */}
            <Button
                variant="contained"
                color="primary" 
                component={Link} 
                to={`/public-profile/`}
                state={{userId: profile.userId}} 
                size="large"
                sx={{
                    mt: 'auto', 
                    textTransform: 'none', 
                    borderRadius: '8px', 
                    px: 3, 
                    py: 1, 
                }}
            >
                View Profile
            </Button>
        </Paper>
    );
}
