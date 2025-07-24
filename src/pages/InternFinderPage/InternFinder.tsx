import ProfileGrid from "../../features/people/ProfileGrid/ProfileGrid"

import { Box, Autocomplete, Button, TextField} from '@mui/material';
import './InternFinder.css'
import { useState, useEffect } from "react";
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';

export default function InternFinder() 
{
    const { getToken } = useAuth();

    const baseURL = import.meta.env.VITE_BACKEND_URL;

    const companies = [
        "TechCorp",
        "InnoSoft",
        "WebSolutions",
        "DataMinds",
        "SecureNet",
        "PixelCraft",
        "AlgoTech",
        "CloudWave",
        "AppVentures",
        "AIMinds",
        "DataStream",
        "BrightUI",
        "FullStackify"
];
    const hobbies = [ 'Reading', 'Hiking', 'Cooking', 'Gaming', 'Photography', 'Music', 'Sports', 'Travel', 'Art', 'Fitness', 'Dancing', 'Movies'];
    const traits = ['Organized', 'Creative', 'Outgoing', 'Analytical', 'Empathetic', 'Adventurous', 'Detail-oriented', 'Team player', 'Independent', 'Optimistic'];


    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
    const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
    const [profiles, setProfiles] = useState<any[]>([]);

    useEffect(() => {
        async function fetchProfiles() {
            try {
                const token = await getToken();

                const params = new URLSearchParams();

                if (selectedCompany) {
                    params.append("company", selectedCompany);
                }

                if (selectedHobbies.length > 0) {
                    params.append("hobbies", selectedHobbies.join(","));
                }

                if (selectedTraits.length > 0) {
                    params.append("traits", selectedTraits.join(","));
                }

                const url = `${baseURL}/api/profiles?${params.toString()}`;

                console.log("Fetching from:", url);

                const { data } = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
                console.log(data);
                setProfiles(data.results);

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
                onChange={(_, newValue) => setSelectedCompany(newValue)}
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
                onChange={(_, newValue) => setSelectedHobbies(newValue)}
                renderInput={
                    (params) => ( <TextField {...params} label="Filter by Hobbies" variant="outlined" />)
                } />
                <Autocomplete 
                options={traits} sx={{ minWidth: 200, '& fieldset': { borderRadius: 33 }}} multiple disableCloseOnSelect 
                value={selectedTraits} 
                onChange={(_, newValue) => setSelectedTraits(newValue)}
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