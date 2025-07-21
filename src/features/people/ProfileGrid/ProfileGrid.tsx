import './ProfileGrid.css'

import ProfileCard from "../ProfileCard/ProfileCard"

export default function ProfileGrid() 
{
    return (
        <>
        <div className="profileGrid">
            <ProfileCard />
            <ProfileCard />
            <ProfileCard />
            <ProfileCard />
            <ProfileCard />
            <ProfileCard />
        </div>
        </>
    )
}