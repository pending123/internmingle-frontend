import './ProfileCard.css';
import { Button } from '@mui/material';
import { Link } from "react-router-dom";

export default function ProfileCard() 
{
    return (
        <>
        <div className='profileCard'>
            <div className="profilePhoto"></div>
            <h2>Jane Doe</h2>
            <h4>UX Design • Salesforce</h4>
            <p className='profileDesc'>Creative designer who loves sketching, museums and finding the best brunch spots in the city</p>
            <ul className='profileTags'>

                <li>AI/ML</li>

                <li>Design</li>
                <li>Video Games</li>
            </ul>
            <Button variant='contained' color='primary'>
                <Link to="/public-profile/:id">View Profile</Link>
            </Button>
        </div>
        </>
    )
}