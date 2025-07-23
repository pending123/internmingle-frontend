import './PublicProfile.css'
import { useParams } from 'react-router-dom'
import { Divider } from '@mui/material';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useScrollToTop } from '../../hooks/useScrollToTop';

export default function PublicProfilePage() 
{

    const { id: profileId } = useParams();

    useScrollToTop();

    return (
        <>
            <div className='profile'>
                <div className='demographics'>
                    <div className="profilePhoto"></div>
                    <div className='coreInfo'>
                        <h2>Jane Doe</h2>
                        <p>UX Designer • Salesforce</p>
                    </div>
                </div>
                <Divider />
                <div className='about'>
                    <h3><FontAwesomeIcon icon={faCircle}color='#0073EA'/>  About Me</h3>
                    <p className='bio'>Creative UX designer who's passionate about turning complex problems into beautiful, intuitive solutions. When I'm not wireframing, you'll find me exploring SF's art scene, hunting for the city's best brunch spots, or getting competitive over board games. Looking for roommates who appreciate good design, great coffee, and spontaneous adventures around the city!</p>
                </div>
                <div className='moreInfo'>
                    <div className='basicInfo'>
                        <h3><FontAwesomeIcon icon={faCircle}color='#0073EA'/>  Basic Info</h3>
                        <p><strong>School:</strong> Salesforce University</p>
                        <Divider />
                        <p><strong>Company:</strong> Salesforce</p>
                        <Divider />
                        <p><strong>Major:</strong> Computer Science</p>
                        <Divider />
                        <p><strong>Age:</strong> 20</p>
                        <Divider />
                        <p><strong>Location:</strong> San Francisco, CA</p>
                    </div>
                    <div className='intDetails'>
                        <h3><FontAwesomeIcon icon={faCircle}color='#0073EA'/>  Internship Details</h3>
                        <p><strong>Start Date:</strong> June 1, 2024</p>
                        <p><strong>End Date:</strong> August 23, 2024</p>
                        <p><strong>Duration:</strong> 12 weeks</p>
                    </div>
                    <div className='traits'>
                        <h3><FontAwesomeIcon icon={faCircle}color='#0073EA'/>  Traits</h3>
                        <div className='traitList'>
                            <div>Creative</div>
                            <div>Collaborative</div>
                            <div>Detail-oriented</div>
                            <div>Outdoorsy</div>
                            <div>Organized</div>
                        </div>
                    </div>  
                    <div className='hobbies'>
                        <h3><FontAwesomeIcon icon={faCircle}color='#0073EA'/>  Hobbies</h3>
                        <div className='hobbyList'>
                            <div>Brunch</div>
                            <div>Design</div>
                            <div>Board Games</div>
                            <div>Art Museums</div>
                            <div>Coffee</div>
                        </div>
                    </div>
                    {/*Not present for those not looking for Housing - conditional render*/}
                    <div className='housingPrefs'>
                        <h3><FontAwesomeIcon icon={faCircle}color='#0073EA'/>  Housing Preferences</h3>
                        <div className='prefList'>
                            <div>
                                <p>SLEEP SCHEDULE</p>
                                <p><strong>Night Owl</strong></p>
                            </div>
                            <div>
                                <p>DESIRED ROOMMATE COUNT</p>
                                <p>1</p>
                            </div>
                            <div>
                                <p>NOISE LEVEL</p>
                                <p>Quiet</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}