import { Link } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import './Navbar.css'
import { faUsers, faUser, faCompass, faCalendar, faComment } from "@fortawesome/free-solid-svg-icons";
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
                <Link to="/chats"><FontAwesomeIcon icon={faComment}/></Link>
                <div style={{ transform: 'scale(1.5)', transformOrigin: 'center' }}>
                    <UserButton>
                        <UserButton.MenuItems>
                            <UserButton.Link 
                                label="View my profile"
                                labelIcon={<FontAwesomeIcon icon={faUser} />}
                                href="/profiles/me"
                            />
                            <UserButton.Action label="manageAccount" />
                            <UserButton.Action label="signOut" />
                        </UserButton.MenuItems>
                    </UserButton>
                </div>
            </div>
        </div>
    )
}