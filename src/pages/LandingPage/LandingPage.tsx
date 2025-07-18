import './LandingPage.css'
import { SignInButton, SignUpButton } from '@clerk/clerk-react';
import { NavLink } from 'react-router-dom';

export default function LandingPage() 
{
    return (
        <>
        <div className='landingPage'>
            <section className='header'>
                <h1>InternMingle</h1>
                <div className='headerBtns'>
                    <div style={{ transform: 'scale(1.5)', transformOrigin: 'center' }}>
                        <SignInButton>
                            <button className='signIn'>Log In</button>
                        </SignInButton>
                    </div>
                    <NavLink to='/about'>About</NavLink>
                </div>
            </section>
            <main>
                <div className='mainText'>
                    <h1>Find People, Places and Possibilities</h1>
                    <h2>Meet interns, discover neighborhoods, and find upcoming events in your area</h2>
                </div>
                <div className='authButtons'>
                    <div style={{ transform: 'scale(2)', transformOrigin: 'center' }}>
                        <SignUpButton>
                            <button className='signUp'>Get Started</button>
                        </SignUpButton>
                    </div>
                </div>
                <section className='interns'>
                    <h2>Meet other People</h2>
                </section>  
                <section className='neighborhoods'>
                    <h2>View Detailed Information about Neighborhoods</h2>
                </section>  
                <section className='events'>
                    <h2>Discover Events</h2>
                </section>  
            </main>        
        </div>
        </>
    )
}