import './PublicProfile.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Divider } from '@mui/material';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import axios from 'axios';

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

export default function PublicProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { id: profileId } = useParams();
  const baseURL = import.meta.env.VITE_BACKEND_URL;

  useScrollToTop();

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const { data } = await axios.get(`${baseURL}/api/profiles/${profileId}`);
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profiles');
      }
    }
    fetchProfiles();
  }, []);

  return !profile ? null : (
    <>
      <div className='profile'>
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
          <div className='traits'>
            <h3><FontAwesomeIcon icon={faCircle} color='#0073EA' />  Traits</h3>
            <div className='traitList'>
              {profile.traits.map((trait) => (
                <div>{trait}</div>
              ))}
            </div>
          </div>  
          <div className='hobbies'>
            <h3><FontAwesomeIcon icon={faCircle} color='#0073EA' />  Hobbies</h3>
            <div className='hobbyList'>
              {profile.hobbies.map((hobby) => (
                <div>{hobby}</div>
              ))}
            </div>
          </div>
          {profile.isLookingForHousing ?
            <div className='housingPrefs'>
                <h3><FontAwesomeIcon icon={faCircle} color='#0073EA' />  Housing Preferences</h3>
                <div className='prefList'>
                <div>
                    <p>SLEEP SCHEDULE</p>
                    <p><strong>{profile.sleepSchedule}</strong></p>
                </div>
                <div>
                    <p>DESIRED ROOMMATE COUNT</p>
                    <p><strong>{profile.numOfRoomates}</strong></p>
                </div>
                <div>
                    <p>NOISE LEVEL</p>
                    <p><strong>{profile.noiseLevel}</strong></p>
                </div>
                </div>
            </div> : null}
        </div>
      </div>
    </>
  );
}