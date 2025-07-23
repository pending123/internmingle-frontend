import ProfileGrid from "../../features/people/ProfileGrid/ProfileGrid"

import { Box, Autocomplete, Button, TextField} from '@mui/material';
import SearchBar from "../../components/SearchBar/SearchBar";
import './InternFinder.css'
import { useState, useEffect } from "react";
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';

export default function InternFinder() 
{
    const { getToken } = useAuth();

    const baseURL = import.meta.env.VITE_BACKEND_URL;

    const hobbies = [ 'Reading', 'Hiking', 'Cooking', 'Gaming', 'Photography', 'Music', 'Sports', 'Travel', 'Art', 'Fitness', 'Dancing', 'Movies'];
    const traits = ['Organized', 'Creative', 'Outgoing', 'Analytical', 'Empathetic', 'Adventurous', 'Detail-oriented', 'Team player', 'Independent', 'Optimistic'];


    const [companySearch, setCompanySearch] = useState<string>("");
    const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
    const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
    const [profiles, setProfiles] = useState<any[]>([]);

    async function clearFilters() {
        setCompanySearch("");
        setSelectedHobbies([]);
        setSelectedTraits([]);
    }

    useEffect(() => {
        async function fetchProfiles() {
            try {
                const token = await getToken();

                const params = new URLSearchParams();

                if (companySearch.trim() !== "") {
                    params.append("company", companySearch.trim());
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
    }, [companySearch, selectedHobbies, selectedTraits])

    return (
        <>
        <div className="internFinder">
            <Box className="filters">
                <Box sx={{ maxWidth: 300}}>
                    <SearchBar
                        placeholder="Search by Company"
                        className="customSearch"
                        action={(formData) => {
                            const query = formData.get("query")?.toString() || "";
                            setCompanySearch(query);
                        }}
                    />
                </Box>
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
                options={traits} sx={{ minWidth: 200,'& fieldset': { borderRadius: 33 }}} multiple disableCloseOnSelect 
                value={selectedTraits} 
                onChange={(_, newValue) => setSelectedTraits(newValue)}
                renderInput={
                    (params) => ( <TextField {...params} label="Filter by Traits" variant="outlined" />)
                } />
                <Button variant="contained" size="large" onClick={clearFilters}>Clear Filters</Button>
            </Box>
            {profiles.length > 0 ? (
                <>
                    <ProfileGrid profiles={profiles} />
                    {/* <Button variant="contained" size="large">View More Profiles</Button> */}
                </>
            ) : (
                <Box sx={{ textAlign: 'center', padding: '2rem', color: '#0073EA' }}>
                    No profiles found. Try narrowing your selected filters.
                </Box>
            )}
        </div>
        </>
    )
}