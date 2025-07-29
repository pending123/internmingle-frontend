import './PersonalProfilePage.css';
import { useEffect, useState } from 'react';
import { Divider, Button } from '@mui/material';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import EditProfileModal from './EditProfileModal';

import { getAge, getWeeksBetween } from '../../utils/TimeHelper'

type Profile = {
    userId: number;
    firstName: string;
    lastName: string;
    gender: string;
    birthday: Date;
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
        <>
            <div className='profile'>
                {/* Edit Profile Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem', paddingBottom: '0' }}>
                    <Button
                        variant="contained"
                        onClick={handleEditClick}
                        sx={{
                            backgroundColor: '#0073EA',
                            color: 'white',
                            padding: '0.5rem 1.5rem',
                            borderRadius: '2rem',
                            fontWeight: 500,
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#0056b3',
                            }
                        }}
                    >
                        Edit Profile
                    </Button>
                </div>

                <div className='demographics'>
                    <div className="profilePhoto"></div>
                    <div className='coreInfo'>
                        <h2>{profile.firstName} {profile.lastName}</h2>
                        <p>{profile.workPosition} • {profile.company}</p>
                    </div>
                </div>
                <Divider />
                <div className='about'>
                    <h3><FontAwesomeIcon icon={faCircle} color='#0073EA' />  About Me</h3>
                    <p className='bio'>
                        {profile.bio}
                    </p>
                </div>
                <div className='moreInfo'>
                    <div className='basicInfo'>
                        <h3><FontAwesomeIcon icon={faCircle} color='#0073EA' />  Basic Info</h3>
                        <div>
                            <p><strong>School:</strong></p>
                            <p className='basicContent'>{profile.university}</p>
                        </div>
                        <Divider />
                        <div>
                            <p><strong>Company:</strong></p>
                            <p className='basicContent'>{profile.company}</p>
                        </div>
                        <Divider />
                        <div>
                            <p><strong>Major:</strong></p>
                            <p className='basicContent'>{profile.schoolMajor}</p>
                        </div>
                        <Divider />
                        <div>
                            <p><strong>Age:</strong></p>
                            <p className='basicContent'>{getAge(new Date(profile.birthday))}</p>
                        </div>
                        <Divider />
                        <div>
                            <p><strong>Location:</strong></p>
                            <p className='basicContent'>{profile.workCity}</p>
                        </div>
                    </div>
                    <div className='intDetails'>
                        <h3><FontAwesomeIcon icon={faCircle} color='#0073EA' />  Internship Details</h3>
                        <div>
                            <p className='intHeading'>Start Date</p>
                            <p>{new Date(profile.internshipStartDate).toLocaleDateString('en-us', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}</p>
                        </div>
                        <div>
                            <p className='intHeading'>End Date</p>
                            <p>{new Date(profile.internshipEndDate).toLocaleDateString('en-us', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}</p>
                        </div>
                        <div>
                            <p className='intHeading'>Duration</p>
                            <p>{getWeeksBetween(new Date(profile.internshipStartDate), new Date(profile.internshipEndDate))} weeks</p>
                        </div>
                    </div>
                    <div>
                        <h3><FontAwesomeIcon icon={faCircle} color='#0073EA' />  Traits</h3>
                        <div className='traitList'>
                            {profile.traits.map((trait, index) => (
                                <div key={index}>{trait}</div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3><FontAwesomeIcon icon={faCircle} color='#0073EA' />  Hobbies</h3>
                        <div className='hobbyList'>
                            {profile.hobbies.map((hobby, index) => (
                                <div key={index}>{hobby}</div>
                            ))}
                        </div>
                    </div>
                    {profile.isLookingForHousing && (
                        <div className='housingPrefs'>
                            <h3><FontAwesomeIcon icon={faCircle} color='#0073EA' />  Housing Preferences</h3>
                            <div className='prefList'>
                                <div>
                                    <p><strong>Sleep Schedule</strong></p>
                                    <p>{profile.sleepSchedule}</p>
                                </div>
                                <div>
                                    <p><strong>Number of Roommates</strong></p>
                                    <p>{profile.numOfRoomates}</p>
                                </div>
                                <div>
                                    <p><strong>Noise Level</strong></p>
                                    <p>{profile.noiseLevel}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Profile Modal */}
            {profile && (
                <EditProfileModal
                    open={editModalOpen}
                    onClose={handleEditClose}
                    profile={profile}
                    onProfileUpdate={handleProfileUpdate}
                />
            )}
        </>
    );
}