import { Link } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import './Navbar.css'
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faCompass } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Navbar()
{
    return (
        <div className="navbar">
            <h1>InternMingle</h1>
            <div className="nav-links">
                <Link to="/intern-finder"><FontAwesomeIcon icon={faUsers} /> Intern Finder</Link>
                <Link to="/neighborhoods"><FontAwesomeIcon icon={faCompass} /> Neighborhood Exploration</Link>
                <Link to="/events"><FontAwesomeIcon icon={faCalendar} /> Events</Link>
                <div style={{ transform: 'scale(1.5)', transformOrigin: 'center' }}>
                    <UserButton />
                </div>

            </div>
        </div>
    )
}