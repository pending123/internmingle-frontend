import ProfileGrid from "../../features/people/ProfileGrid/ProfileGrid"
import { Box, Autocomplete, Button, TextField } from '@mui/material';
import './InternFinder.css'
import { useState, useEffect } from "react";

export default function InternFinder() 
{

    const companies = ['Salesforce', 'Meta', 'Google', 'Amazon'];
    const hobbies = ['Hiking', 'Yoga', 'Video Games', 'Pilates']

    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
    const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
    const [profiles, setProfiles] = useState([]);

    //Add  a useEffect dependent on selected company, hobbies and traits here to fetch data
    //Build fetchData function

    return (
        <>
        <div className="internFinder">
            <Box className="filters">
                <Autocomplete 
                options={companies} sx={{ minWidth: 200}} 
                value={selectedCompany} 
                onChange={(e, newValue) => setSelectedCompany(newValue)}
                renderInput={
                    (params) => ( <TextField {...params} label="Filter by Company" variant="outlined" />)
                } />
                <Autocomplete 
                options={hobbies} sx={{ minWidth: 200}} multiple disableCloseOnSelect  
                value={selectedHobbies} 
                onChange={(e, newValue) => setSelectedHobbies(newValue)}
                renderInput={
                    (params) => ( <TextField {...params} label="Filter by Hobbies" variant="outlined" />)
                } />
                <Autocomplete 
                options={companies} sx={{ minWidth: 200}} multiple disableCloseOnSelect 
                value={selectedTraits} 
                onChange={(e, newValue) => setSelectedTraits(newValue)}
                renderInput={
                    (params) => ( <TextField {...params} label="Filter by Traits" variant="outlined" />)
                } />
            </Box>
            <ProfileGrid />
            <Button variant="contained" size="large">View More Profiles</Button>
        </div>
        </>
    )
}