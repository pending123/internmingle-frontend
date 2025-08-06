import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

// HARD CODED FOR NOW---NEED TO CHANGE!!
const AVAILABLE_TRAITS = [
  'Organized', 'Creative', 'Outgoing', 'Analytical', 'Empathetic', 
  'Adventurous', 'Detail-oriented', 'Team player', 'Independent', 'Optimistic'
];

const AVAILABLE_HOBBIES = [
  'Reading', 'Hiking', 'Cooking', 'Gaming', 'Photography', 'Music', 
  'Sports', 'Travel', 'Art', 'Fitness', 'Dancing', 'Movies'
];

const SLEEP_SCHEDULES = [
  'Early bird (before 10 PM)', 
  'Night owl (after 12 AM)', 
  'Flexible'
];

const NOISE_LEVELS = [
  'Quiet', 
  'Moderate', 
  'Don\'t mind noise'
];

const ROOMMATE_COUNT_OPTIONS = [
  { value: 1, label: '1 roommate' },
  { value: 2, label: '2 roommates' },
  { value: 3, label: '3 roommates' },
  { value: 4, label: '4 roommates' },
  { value: 5, label: '5+ roommates' }
];

type Profile = {
  userId: number;
  firstName: string;
  lastName: string;
  gender: string;
  birthday?: Date | null;
  university: string;
  schoolMajor: string;
  company: string;
  workPosition: string;
  workCity: string;
  workZipcode?: string;
  internshipStartDate: string;
  internshipEndDate: string;
  bio: string;
  isLookingForHousing: boolean;
  hobbies: string[];
  traits: string[];
  sleepSchedule: string;
  numOfRoomates: number;
  noiseLevel: string;
};

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  profile: Profile;
  onProfileUpdate: (updatedProfile: Profile) => void;
}

export default function EditProfileModal({ open, onClose, profile, onProfileUpdate }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    university: '',
    company: '',
    schoolMajor: '',
    birthday: null as Date | null,
    internshipStartDate: null as Date | null,
    internshipEndDate: null as Date | null,
    workCity: '',
    workZipcode: '',
    workPosition: '',
    bio: '',
    gender: '',
    isLookingForHousing: '',
    traits: [] as string[],
    hobbies: [] as string[],
    sleepSchedule: '',
    numOfRoomates: '',
    noiseLevel: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { getToken } = useAuth();

  // initializes form data when modal opens
  useEffect(() => {
    if (open && profile) {
      setFormData({
        university: profile.university || '',
        company: profile.company || '',
        schoolMajor: profile.schoolMajor || '',
        birthday: profile.birthday ? new Date(profile.birthday) : null,
        internshipStartDate: profile.internshipStartDate ? new Date(profile.internshipStartDate) : null,
        internshipEndDate: profile.internshipEndDate ? new Date(profile.internshipEndDate) : null,
        workCity: profile.workCity || '',
        workZipcode: profile.workZipcode || '',
        workPosition: profile.workPosition || '',
        bio: profile.bio || '',
        gender: profile.gender || '',
        isLookingForHousing: profile.isLookingForHousing ? 'yes' : 'no',
        traits: profile.traits || [],
        hobbies: profile.hobbies || [],
        sleepSchedule: profile.sleepSchedule || '',
        numOfRoomates: profile.numOfRoomates ? String(profile.numOfRoomates) : '',
        noiseLevel: profile.noiseLevel || ''
      });
      setError('');
    }
  }, [open, profile]);

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };


  //CLAUDE SUGGESTED--NEEDS TO CHANGE!!
  const toggleTrait = (trait: string) => {
    const newTraits = formData.traits.includes(trait)
      ? formData.traits.filter(t => t !== trait)
      : [...formData.traits, trait];
    updateFormData({ traits: newTraits });
  };

  //CLAUDE SUGGESTED--NEEDS TO CHANGE!!
  const toggleHobby = (hobby: string) => {
    const newHobbies = formData.hobbies.includes(hobby)
      ? formData.hobbies.filter(h => h !== hobby)
      : [...formData.hobbies, hobby];
    updateFormData({ hobbies: newHobbies });
  };

  const handleSubmit = async () => {


    // validates required fields -- SHOULD MAJOR BE REQUIRED??
    if (!formData.university || !formData.company ||
        !formData.workPosition || !formData.workCity || !formData.bio || !formData.gender) {
      setError('Please fill in all required fields');
      return;
    }

    // validates housing preferences if looking for housing
    const isLookingForHousing = formData.isLookingForHousing === 'yes';
    if (isLookingForHousing && (!formData.sleepSchedule || !formData.numOfRoomates || !formData.noiseLevel)) {
      setError('Please fill in all housing preferences when looking for roommates');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const token = await getToken();
      if (!token) {
        setError('Authentication required');
        return;
      }

      const isLookingForHousing = formData.isLookingForHousing === 'yes';

      const submitData = {
        university: formData.university,
        company: formData.company,
        schoolMajor: formData.schoolMajor,
        birthday: formData.birthday?.toISOString(),
        internshipStartDate: formData.internshipStartDate?.toISOString(),
        internshipEndDate: formData.internshipEndDate?.toISOString(),
        workCity: formData.workCity,
        workZipcode: formData.workZipcode ? formData.workZipcode : undefined, // ensure string or undefined-- CLAUDE SUGGESTED
        workPosition: formData.workPosition,
        bio: formData.bio,
        gender: formData.gender,
        isLookingForHousing,
        // CLAUDE SUGGESTED TO DO: Uncomment when traits and hobbies are implemented on backend
        // traits: formData.traits,
        // hobbies: formData.hobbies,
        sleepSchedule: isLookingForHousing ? formData.sleepSchedule : null,
        numOfRoomates: isLookingForHousing ? parseInt(formData.numOfRoomates) : null,
        noiseLevel: isLookingForHousing ? formData.noiseLevel : null
      };

      const response = await axios.put('/api/profiles/me', submitData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        // updates the profile in the parent component
        onProfileUpdate({
          ...profile,
          ...submitData,
          birthday: formData.birthday || profile.birthday,
          internshipStartDate: formData.internshipStartDate?.toISOString() || profile.internshipStartDate,
          internshipEndDate: formData.internshipEndDate?.toISOString() || profile.internshipEndDate,
          workZipcode: formData.workZipcode ? formData.workZipcode : undefined,
          numOfRoomates: isLookingForHousing ? parseInt(formData.numOfRoomates) : 0,
          sleepSchedule: isLookingForHousing ? formData.sleepSchedule : "",
          noiseLevel: isLookingForHousing ? formData.noiseLevel : ""
        });
        onClose();
      }
    } catch (err: any) {
      console.error('Profile update error:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      console.error('Form data that caused error:', {
        university: formData.university,
        company: formData.company,
        schoolMajor: formData.schoolMajor,
        birthday: formData.birthday?.toISOString(),
        internshipStartDate: formData.internshipStartDate?.toISOString(),
        internshipEndDate: formData.internshipEndDate?.toISOString(),
        workCity: formData.workCity,
        workZipcode: formData.workZipcode || null,
        workPosition: formData.workPosition,
        bio: formData.bio,
        gender: formData.gender,
        isLookingForHousing,
        sleepSchedule: isLookingForHousing ? formData.sleepSchedule : null,
        numOfRoomates: isLookingForHousing ? parseInt(formData.numOfRoomates) : null,
        noiseLevel: isLookingForHousing ? formData.noiseLevel : null
      });
      setError(err.response?.data?.error || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // resets form data to original values if clicked cancel
    if (profile) {
      setFormData({
        university: profile.university || '',
        company: profile.company || '',
        schoolMajor: profile.schoolMajor || '',
        birthday: profile.birthday ? new Date(profile.birthday) : null,
        internshipStartDate: profile.internshipStartDate ? new Date(profile.internshipStartDate) : null,
        internshipEndDate: profile.internshipEndDate ? new Date(profile.internshipEndDate) : null,
        workCity: profile.workCity || '',
        workZipcode: profile.workZipcode || '',
        workPosition: profile.workPosition || '',
        bio: profile.bio || '',
        gender: profile.gender || '',
        isLookingForHousing: profile.isLookingForHousing ? 'yes' : 'no',
        traits: profile.traits || [],
        hobbies: profile.hobbies || [],
        sleepSchedule: profile.sleepSchedule || '',
        numOfRoomates: profile.numOfRoomates ? String(profile.numOfRoomates) : '',
        noiseLevel: profile.noiseLevel || ''
      });
    }
    setError('');
    onClose();
  };

  const isLookingForHousing = formData.isLookingForHousing === 'yes';

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        fontSize: '1.8rem', 
        color: '#333',
        fontWeight: 600,
        pb: 2
      }}>
        Edit Profile
      </DialogTitle>

      <DialogContent sx={{ px: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Basic Information */}
          <Typography variant="h6" sx={{ color: '#0073EA', fontWeight: 600, mt: 1 }}>
            Basic Information
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="University"
              value={formData.university}
              onChange={(e) => updateFormData({ university: e.target.value })}
              fullWidth
              required
            />

          {/* SHOULD MAJOR BE REQUIRED??? */}
            <TextField
              label="Major"
              value={formData.schoolMajor}
              onChange={(e) => updateFormData({ schoolMajor: e.target.value })}
              fullWidth
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Company"
              value={formData.company}
              onChange={(e) => updateFormData({ company: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Position"
              value={formData.workPosition}
              onChange={(e) => updateFormData({ workPosition: e.target.value })}
              fullWidth
              required
            />
          </Box>


          {/* TEST THIS ON THE ONBOARDING FORM !!!! MAKE REQUIURED WHEN UPDATING PROFILE??? */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Birthday"
                value={formData.birthday}
                onChange={(date) => updateFormData({ birthday: date })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    //required: false
                  }
                }}
              />
            </LocalizationProvider>
            <TextField
              label="Gender"
              value={formData.gender}
              onChange={(e) => updateFormData({ gender: e.target.value })}
              fullWidth
              required
            />
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Internship info */}
          <Typography variant="h6" sx={{ color: '#0073EA', fontWeight: 600 }}>
            Internship Information
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Internship Start Date"
                value={formData.internshipStartDate}
                onChange={(date) => updateFormData({ internshipStartDate: date })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    //required: false
                  }
                }}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Internship End Date"
                value={formData.internshipEndDate}
                onChange={(date) => updateFormData({ internshipEndDate: date })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    //required: false
                  }
                }}
              />
            </LocalizationProvider>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Work City"
              value={formData.workCity}
              onChange={(e) => updateFormData({ workCity: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Work Zipcode"
              value={formData.workZipcode}
              onChange={(e) => updateFormData({ workZipcode: e.target.value })}
              fullWidth
            />
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Bio */}
          <Typography variant="h6" sx={{ color: '#0073EA', fontWeight: 600 }}>
            About Me
          </Typography>
          
          <TextField
            label="Bio"
            value={formData.bio}
            onChange={(e) => updateFormData({ bio: e.target.value })}
            multiline
            rows={3}
            fullWidth
            required
          />

          <Divider sx={{ my: 1 }} />

          {/* CLAUDE SUGGESTED ---- Traits */}
          <Typography variant="h6" sx={{ color: '#0073EA', fontWeight: 600 }}>
            Traits (optional) 
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {AVAILABLE_TRAITS.map(trait => (
              <Chip
                key={trait}
                label={trait}
                clickable
                onClick={() => toggleTrait(trait)}
                color={formData.traits.includes(trait) ? 'primary' : 'default'}
                variant={formData.traits.includes(trait) ? 'filled' : 'outlined'}
                sx={{
                  backgroundColor: formData.traits.includes(trait) ? '#0073EA' : 'transparent',
                  color: formData.traits.includes(trait) ? 'white' : '#666',
                  '&:hover': {
                    backgroundColor: formData.traits.includes(trait) ? '#0056b3' : '#e8f4ff'
                  }
                }}
              />
            ))}
          </Box>

          {/* CLAUDE SUGGESTED----Hobbies */}
          <Typography variant="h6" sx={{ color: '#0073EA', fontWeight: 600, mt: 2 }}>
            Hobbies (optional)

          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {AVAILABLE_HOBBIES.map(hobby => (
              <Chip
                key={hobby}
                label={hobby}
                clickable
                onClick={() => toggleHobby(hobby)}
                color={formData.hobbies.includes(hobby) ? 'primary' : 'default'}
                variant={formData.hobbies.includes(hobby) ? 'filled' : 'outlined'}
                sx={{
                  backgroundColor: formData.hobbies.includes(hobby) ? '#0073EA' : 'transparent',
                  color: formData.hobbies.includes(hobby) ? 'white' : '#666',
                  '&:hover': {
                    backgroundColor: formData.hobbies.includes(hobby) ? '#0056b3' : '#e8f4ff'
                  }
                }}
              />
            ))}
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Housing Preferences */}
          <Typography variant="h6" sx={{ color: '#0073EA', fontWeight: 600, mt: 2 }}>
            Housing Preferences
          </Typography>

          <FormControl fullWidth>
            <InputLabel>Are you looking for roommates?</InputLabel>
            <Select
              value={formData.isLookingForHousing}
              onChange={(e) => updateFormData({ isLookingForHousing: e.target.value })}
              label="Are you looking for roommates?"
            >
              <MenuItem value="yes">Yes, I'm looking for roommates.</MenuItem>
              <MenuItem value="no">No, I'm not interested in finding roommates.</MenuItem>
            </Select>
          </FormControl>

          {/* Housing Details - only shown if user looking for housing */}
          {isLookingForHousing && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Sleep Schedule</InputLabel>
                <Select
                  value={formData.sleepSchedule}
                  onChange={(e) => updateFormData({ sleepSchedule: e.target.value })}
                  label="Sleep Schedule"
                >
                  {SLEEP_SCHEDULES.map(schedule => (
                    <MenuItem key={schedule} value={schedule}>{schedule}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Number of Roommates</InputLabel>
                <Select
                  value={formData.numOfRoomates}
                  onChange={(e) => updateFormData({ numOfRoomates: e.target.value })}
                  label="Number of Roommates"
                >
                  {ROOMMATE_COUNT_OPTIONS.map(option => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Noise Level</InputLabel>
                <Select
                  value={formData.noiseLevel}
                  onChange={(e) => updateFormData({ noiseLevel: e.target.value })}
                  label="Noise Level"
                >
                  {NOISE_LEVELS.map(level => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {error && (
            <Typography color="error" sx={{ textAlign: 'center', mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>

          {/* REFER TO STYLING OF OTHER FILES */}
      <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
          disabled={isSubmitting}
          sx={{
            borderColor: '#ccc',
            color: '#666',
            '&:hover': {
              borderColor: '#999',
              color: '#333',
              bgcolor: 'rgba(0,0,0,0.04)'
            },
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: '8px',
            textTransform: 'none'
          }}
        >
          Cancel
        </Button>
        
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{
            backgroundColor: '#0073EA',
            '&:hover': { backgroundColor: '#0056b3' },
            px: 4,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 600,
            borderRadius: '8px',
            textTransform: 'none'
          }}
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}