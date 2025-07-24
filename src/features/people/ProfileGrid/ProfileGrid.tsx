import './ProfileGrid.css'
import ProfileCard from "../ProfileCard/ProfileCard"

type Profile = {
  userId: number;
  firstName: string;
  lastName: string;
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

type ProfileGridProps = 
{
    profiles: Profile[];
};

export default function ProfileGrid({ profiles }: ProfileGridProps) 
{
    console.log(profiles)
    return (
        <>

        <div className="profileGrid">
            {profiles.map((profile) => (
                <ProfileCard key={profile.userId} profile={profile}/>
            ))}
        </div>
        </>
    )
}