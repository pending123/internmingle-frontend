import { Link } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import './Navbar.css'

export default function Navbar()
{
    return (
        <div className="navbar">
            <h1>InternMingle</h1>
            <div className="nav-links">
                <Link to="/home">Home</Link>
                <Link to="/intern-finder">Intern Finder</Link>
                <Link to="/neighborhoods">Neighborhood Exploration</Link>
                <Link to="/events">Events</Link>
                <div style={{ transform: 'scale(1.5)', transformOrigin: 'center' }}>
                    <UserButton />
                </div>

            </div>
        </div>
    )
}