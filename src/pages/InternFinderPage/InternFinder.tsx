import ProfileGrid from "../../features/people/ProfileGrid/ProfileGrid"

import { Box, Autocomplete, Button, TextField} from '@mui/material';
import './InternFinder.css'
import { useState, useEffect } from "react";
import axios from 'axios'

export default function InternFinder() 
{

    const companies = ['Salesforce', 'Meta', 'Google', 'Amazon'];
    const hobbies = ['Hiking', 'Yoga', 'Video Games', 'Pilates']

    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
    const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
    const [profiles, setProfiles] = useState<any[]>([]);

    useEffect(() => {
        async function fetchProfiles() {
            try {
                const { data } = await axios.get(`http://localhost:3000/api/profiles/`);
                setProfiles(data);
            } catch (err) 
            {
                console.error('Error fetching profiles')
            }
        };
        fetchProfiles();
    }, [selectedCompany, selectedHobbies, selectedTraits])

    return (
        <>
        <div className="internFinder">
            <Box className="filters">
                <Autocomplete 
                options={companies} sx={{ minWidth: 200, '& fieldset': { borderRadius: 33 }}} 
                value={selectedCompany} 
                onChange={(e, newValue) => setSelectedCompany(newValue)}
                renderInput={
                    (params) => ( <TextField {...params} label="Filter by Company" variant="outlined" />)
                } />
                <Autocomplete 
                options={hobbies} 
                sx={
                    {minWidth: 200, '& fieldset': { borderRadius: 33 }}
                } 
                multiple disableCloseOnSelect  
                value={selectedHobbies} 
                onChange={(e, newValue) => setSelectedHobbies(newValue)}
                renderInput={
                    (params) => ( <TextField {...params} label="Filter by Hobbies" variant="outlined" />)
                } />
                <Autocomplete 
                options={companies} sx={{ minWidth: 200, '& fieldset': { borderRadius: 33 }}} multiple disableCloseOnSelect 
                value={selectedTraits} 
                onChange={(e, newValue) => setSelectedTraits(newValue)}
                renderInput={
                    (params) => ( <TextField {...params} label="Filter by Traits" variant="outlined" />)
                } />
            </Box>
            <ProfileGrid profiles={profiles}/>
            <Button variant="contained" size="large">View More Profiles</Button>
        </div>

        </>
    )
}