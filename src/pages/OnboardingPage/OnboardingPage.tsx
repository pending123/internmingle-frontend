import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import './OnboardingPage.css';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

axios.defaults.baseURL = BACKEND_URL;

//hard coded for now
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

// options for num of roomomates
const ROOMMATE_COUNT_OPTIONS = [
  { value: '1', label: '1 roommate' },
  { value: '2', label: '2 roommates' },
  { value: '3', label: '3 roommates' },
  { value: '4', label: '4 roommates' },
  { value: '5', label: '5+ roommates' }
];

interface OnboardingData {
  workCity: string;
  workZipcode: string;
  university: string;
  schoolMajor: string;
  company: string;
  workPosition: string;
  birthday: Date | null;
  gender: string;
  internshipStartDate: Date | null;
  internshipEndDate: Date | null;
  traits: string[];
  hobbies: string[];
  bio: string;
  isLookingForHousing: boolean | null;
  sleepSchedule: string;
  numOfRoomates: string;
  noiseLevel: string;
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  const [formData, setFormData] = useState<OnboardingData>({
    workCity: '',
    workZipcode: '',
    university: '',
    schoolMajor: '',
    company: '',
    workPosition: '',
    birthday: null,
    gender: '',
    internshipStartDate: null,
    internshipEndDate: null,
    traits: [],
    hobbies: [],
    bio: '',
    isLookingForHousing: null,
    sleepSchedule: '',
    numOfRoomates: '',
    noiseLevel: ''
  });

  const updateFormData = (updates: Partial<OnboardingData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // check if profile is already completed
  useEffect(() => {
    const checkIfAlreadyCompleted = async () => {
      if (!user) return; //prevents API calls when user isn't logged in

      try {
        const token = await getToken();
        if (!token) return;

        const response = await axios.get('/api/profiles/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        //redirects user
        if (response.data?.profileCompleted) {
          console.log('Profile already completed, redirecting to main app...');
          navigate('/intern-finder', { replace: true });
        }
      } catch (error: any) {
        // 404 error message expected for new users since completing profile for the first time
        if (error.response?.status === 404) {
          console.log('New user confirmed - starting onboarding');
        } else {
          console.error('Error checking profile status:', error);
        }
      } finally {
        setIsCheckingProfile(false);
      }
    };

    checkIfAlreadyCompleted();
  }, [user, getToken, navigate]);

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        return formData.workCity.trim() !== '';
      case 2:
        return true; // step is optional, a user may choose to skip
      case 3:
        return (
          formData.university.trim() !== '' && // prevents users from just entering whitespace
          formData.schoolMajor.trim() !== '' &&
          formData.company.trim() !== '' &&
          formData.workPosition.trim() !== '' &&
          formData.gender.trim() !== '' &&
          formData.bio.trim() !== ''
        );
      case 4:
        return formData.isLookingForHousing !== null;
      case 5:
        // Validate housing preferences more thoroughly-- CLAUDE SUGGESTED
        const isRoommatesValid = formData.numOfRoomates.trim() !== '' && 
                                !isNaN(Number(formData.numOfRoomates)) && 
                                Number(formData.numOfRoomates) > 0;
        return (
          formData.sleepSchedule.trim() !== '' &&
          isRoommatesValid &&
          formData.noiseLevel.trim() !== ''
        );
      case 6:
        return true; //last step
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateStep()) {
      if (currentStep === 5) {
        setError('Please fill in all required fields. number of roommates must be valid numbers.');
      } else {
        setError('Please fill in all required fields');
      }
      return;
    }
    setError('');
    
    if (currentStep === 4) {
      // skip 5 if not looking for housing
      if (!formData.isLookingForHousing) {
        setCurrentStep(6);
      } else {
        setCurrentStep(5);
      }
    } else if (currentStep === 6) {
      handleSubmit();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) return; //user can't go back from first step
    if (currentStep === 6 && !formData.isLookingForHousing) {
      setCurrentStep(4)
    } else {
      setCurrentStep(prev => prev - 1)    
    }
    setError(''); //clears any errors user might have when going back
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      // Get authentication token from Clerk
      const token = await getToken();
      
      if (!token) {
        setError('Authentication failed. Please try signing out and back in.');
        return;
      }
      
      // Prepare data for API - converts types as needed
      const submitData = {
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        workCity: formData.workCity,
        workZipcode: formData.workZipcode || null, // Optional field
        university: formData.university,
        schoolMajor: formData.schoolMajor,
        company: formData.company,
        workPosition: formData.workPosition,
        birthday: formData.birthday?.toISOString() || null,
        gender: formData.gender,
        internshipStartDate: formData.internshipStartDate?.toISOString() || null,
        internshipEndDate: formData.internshipEndDate?.toISOString() || null,
        bio: formData.bio,
        isLookingForHousing: formData.isLookingForHousing,
        // Fix housing preferences data handling
        sleepSchedule: formData.isLookingForHousing ? formData.sleepSchedule : null,
        numOfRoomates: formData.isLookingForHousing ? parseInt(formData.numOfRoomates) : null,
        noiseLevel: formData.isLookingForHousing ? formData.noiseLevel : null
      };

      console.log('Submitting onboarding data:', submitData);

      const response = await axios.post('/api/profiles', submitData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        console.log('Profile created successfully. Redirecting user to main app...');
        navigate('/intern-finder');
      }
    } catch (err: any) {
      console.error('Onboarding submission error:', err);
      
      // Handle specific error cases
      if (err.response?.status === 400) {
        if (err.response?.data?.error === 'Profile already completed') {
          // Profile is already completed, redirect to main app
          console.log('Profile already complete, redirecting...');
          setError('Your profile is already complete. Redirecting to the main app...');
          setTimeout(() => {
            navigate('/intern-finder');
          }, 2000);
        } else {
          // Show the specific validation error from the backend
          const errorMessage = err.response?.data?.error || 'Please check all required fields are filled correctly.';
          setError(errorMessage);
        }
      } else {
        setError('Failed to complete profile. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTrait = (trait: string) => {
    const newTraits = formData.traits.includes(trait)
      ? formData.traits.filter(t => t !== trait)
      : [...formData.traits, trait];
    updateFormData({ traits: newTraits });
  };

  const toggleHobby = (hobby: string) => {
    const newHobbies = formData.hobbies.includes(hobby)
      ? formData.hobbies.filter(h => h !== hobby)
      : [...formData.hobbies, hobby];
    updateFormData({ hobbies: newHobbies });
  };

  const renderStep = () => {
    const firstName = user?.firstName || 'there';

    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h1 className="step-title">Welcome {firstName}!</h1>
            <h2 className="step-subtitle">Where is your internship located?</h2>
            <input
              type="text"
              placeholder="City"
              className="form-input"
              value={formData.workCity}
              onChange={(e) => updateFormData({ workCity: e.target.value })}
              required
            />
            <p className="step-description">
              Meet other interns, discover neighborhoods, and find upcoming events in your area.
            </p>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h1 className="step-title">Welcome {firstName}!</h1>
            <h2 className="step-subtitle">Do you know where your office is located?</h2>
            <p className="step-description">
              Entering this information will help you discover neighborhoods and their distance to your office.
            </p>
            <input
              type="text"
              placeholder="Zip Code (optional)"
              className="form-input"
              value={formData.workZipcode}
              onChange={(e) => {
                // Only allow numeric input
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 5) {
                  updateFormData({ workZipcode: value });
                }
              }}
              maxLength={5}
            />
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h1 className="step-title">Welcome {firstName}!</h1>
            <h2 className="step-subtitle">Please customize your profile.</h2>
            
            <div className="form-grid">
              <input
                type="text"
                placeholder="University"
                className="form-input"
                value={formData.university}
                onChange={(e) => updateFormData({ university: e.target.value })}
                required
              />
              
              <input
                type="text"
                placeholder="Major"
                className="form-input"
                value={formData.schoolMajor}
                onChange={(e) => updateFormData({ schoolMajor: e.target.value })}
                required
              />
              
              <input
                type="text"
                placeholder="Company"
                className="form-input"
                value={formData.company}
                onChange={(e) => updateFormData({ company: e.target.value })}
                required
              />
              
              <input
                type="text"
                placeholder="Position"
                className="form-input"
                value={formData.workPosition}
                onChange={(e) => updateFormData({ workPosition: e.target.value })}
                required
              />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Birthday (optional)"
                  value={formData.birthday}
                  onChange={(date) => updateFormData({ birthday: date })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: false, //TEST
                      className: 'date-picker-field'
                    }
                  }}
                />
              </LocalizationProvider>

              <input
                type="text"
                placeholder="Gender"
                className="form-input"
                value={formData.gender}
                onChange={(e) => updateFormData({ gender: e.target.value })}
                required
              />

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Internship Start Date (optional)"
                  value={formData.internshipStartDate}
                  onChange={(date) => updateFormData({ internshipStartDate: date })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: false, //TEST
                      className: 'date-picker-field'
                    }
                  }}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Internship End Date (optional)"
                  value={formData.internshipEndDate}
                  onChange={(date) => updateFormData({ internshipEndDate: date })}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: false,
                      className: 'date-picker-field'
                    }
                  }}
                />
              </LocalizationProvider>
              <textarea
                placeholder="Bio"
                className="form-textarea"
                rows={3}
                value={formData.bio}
                onChange={(e) => updateFormData({ bio: e.target.value })}
                required
              />

              {/* Traits Section */}
              <div className="traits-section">
                <label className="section-label">Traits</label>
                <div className="tags-container">
                  {AVAILABLE_TRAITS.map(trait => (
                    <button
                      key={trait}
                      type="button"
                      className={`tag-button ${formData.traits.includes(trait) ? 'tag-selected' : ''}`}
                      onClick={() => toggleTrait(trait)}
                    >
                      {trait}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hobbies Section */}
              <div className="hobbies-section">
                <label className="section-label">Hobbies</label>
                <div className="tags-container">
                  {AVAILABLE_HOBBIES.map(hobby => (
                    <button
                      key={hobby}
                      type="button"
                      className={`tag-button ${formData.hobbies.includes(hobby) ? 'tag-selected' : ''}`}
                      onClick={() => toggleHobby(hobby)}
                    >
                      {hobby}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h1 className="step-title">Welcome {firstName}!</h1>
            <h2 className="step-subtitle">Are you looking for roommates?</h2>
            
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="housing"
                  value="true"
                  checked={formData.isLookingForHousing === true}
                  onChange={() => updateFormData({ isLookingForHousing: true })}
                />
                <span>Yes, I'm looking for roommates.</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="housing"
                  value="false"
                  checked={formData.isLookingForHousing === false}
                  onChange={() => updateFormData({ isLookingForHousing: false })}
                />
                <span>No, I'm not interested in finding roommates.</span>
              </label>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <h1 className="step-title">Welcome {firstName}!</h1>
            <h2 className="step-subtitle">Please specify your housing preferences.</h2>
            
            <div className="form-grid">
              <select
                className="form-select"
                value={formData.sleepSchedule}
                onChange={(e) => updateFormData({ sleepSchedule: e.target.value })}
                required
              >
                <option value="">Select Sleep Schedule</option>
                {SLEEP_SCHEDULES.map(schedule => (
                  <option key={schedule} value={schedule}>{schedule}</option>
                ))}
              </select>

              <select
                className="form-select"
                value={formData.numOfRoomates}
                onChange={(e) => updateFormData({ numOfRoomates: e.target.value })}
                required
              >
                <option value="">Select Number of Roommates</option>
                {ROOMMATE_COUNT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              <select
                className="form-select"
                value={formData.noiseLevel}
                onChange={(e) => updateFormData({ noiseLevel: e.target.value })}
                required
              >
                <option value="">Select Noise Level</option>
                {NOISE_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="step-content final-step">
            <h1 className="step-title">Welcome {firstName}!</h1>
            <h2 className="step-subtitle">Your profile is now set up.</h2>
            <p className="step-description">
              You're ready to start connecting with other interns and exploring your city!
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="onboarding-container">
      {/* Show loading while checking if profile is already completed */}
      {isCheckingProfile ? (
        <div className="loading-container">
          <h2>Checking your profile...</h2>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>
      ) : (
        <div className="onboarding-card">
          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(currentStep / 6) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="error-alert">
              {error}
            </div>
          )}

          {/* Current Step Content */}
          {renderStep()}

          {/* nav Buttons */}
          <div className="navigation-buttons">
            <div>
              {currentStep > 1 && (
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  className="back-button"
                >
                  Back
                </Button>
              )}
            </div>
            
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={isSubmitting}
              className="next-button"
            >
              {currentStep === 6 ? 'Finish' : 'Next'}
            </Button>

            </div>
        </div>
      )}
    </div>
  );
}