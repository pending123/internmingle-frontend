import './ProfileCard.css';
import { Button } from '@mui/material';
import { Link } from "react-router-dom";

type Profile = {
  userId: number;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  gender: string;
  university: string;
  schoolMajor: string;
  company: string;
  workPosition: string;
  workCity: string;
  bio: string;
  isLookingForHousing: boolean;
  hobbies: string[];
  traits: string[];
};

type ProfileCardProps = {
  profile: Profile;
};



export default function ProfileCard({ profile }: ProfileCardProps) 
{
    const hobbyTags = profile.hobbies.slice(0, 2);
    const traitTag = profile.traits.length > 0 ? [profile.traits[0]] : [];
    const tags = [...hobbyTags, ...traitTag];

    return (
        <>
        <div className='profileCard'>
            <div className="profilePhoto">
                <img
                    src={profile.imageUrl}
                    className="profileImage"
                />
            </div>
            <h2>{profile.firstName}</h2>
            <h4>{profile.workPosition} • {profile.company}</h4>
            <ul className='profileTags'>
            {tags.map((tag, index) => (
                <li key={index}>{tag}</li>
            ))}
            </ul>
            <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/public-profile" 
            state={{ userId: profile.userId }}
            style={{ marginTop: 'auto' }}
            >
            View Profile
            </Button>
        </div>
        </>
    )
}