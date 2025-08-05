import ProfileGrid from "../../features/people/ProfileGrid/ProfileGrid"

import { Box, Autocomplete, Button, TextField} from '@mui/material';
import SearchBar from "../../components/SearchBar/SearchBar";
import './InternFinder.css'
import { useState, useEffect } from "react";
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';

interface FilterState {
    companySearch: string;
    selectedHobbies: string[];
    selectedTraits: string[];
    selectedHousing: string | null;
}

export default function InternFinder() 
{
    const { getToken } = useAuth();

    const baseURL = import.meta.env.VITE_BACKEND_URL;
    const FILTER_STORAGE_KEY = 'internFinder_filters';

    const loadFiltersFromStorage = (): FilterState => {
        try {
            const stored = localStorage.getItem(FILTER_STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading filters:', error);
        }
        return {
            companySearch: "",
            selectedHobbies: [],
            selectedTraits: [],
            selectedHousing: ""
        };
    };

    const saveFiltersToStorage = (filters: FilterState): void => {
        try {
            localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
        } catch (error) {
            console.error('Error saving filters:', error);
        }
    };

    const hobbies = [ 'Reading', 'Hiking', 'Cooking', 'Gaming', 'Photography', 'Music', 'Sports', 'Travel', 'Art', 'Fitness', 'Dancing', 'Movies'];
    const traits = ['Organized', 'Creative', 'Outgoing', 'Analytical', 'Empathetic', 'Adventurous', 'Detail-oriented', 'Team player', 'Independent', 'Optimistic'];
    const housingOptions = ['Yes', 'No']

    const [companySearch, setCompanySearch] = useState<string>("");
    const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
    const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
    const [selectedHousing, setSelectedHousing] = useState<string | null>("");

    const [profiles, setProfiles] = useState<any[]>([]);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    async function fetchProfiles(newPage = 1, append = false) {
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

                if (selectedHousing !== null && selectedHousing !== '') {
                    if (selectedHousing === 'Yes') {
                        params.append("housing", "true");
                    } else if (selectedHousing === 'No') {
                        params.append("housing", "false");
                    }
                }

                params.append("page", newPage.toString());

                const url = `${baseURL}/api/profiles?${params.toString()}`;
                console.log("Fetching from:", url);

                const { data } = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
                console.log(data);
                setTotalPages(data.totalPages);
                if (append) {
                    setProfiles(prev => [...prev, ...data.results]);
                } else {
                    setProfiles(data.results);
                } 
            } catch (err) {
                console.error('Error fetching profiles')
            }
        };

    const handleViewMore = async () => {
        const nextPage = page + 1;
        setLoadingMore(true);
        await fetchProfiles(nextPage, true);
        setPage(nextPage);
        setLoadingMore(false);
};


    async function clearFilters() {
        setCompanySearch("");
        setSelectedHobbies([]);
        setSelectedTraits([]);
        setSelectedHousing("");
    }

    useEffect(() => {
        setPage(1);
        fetchProfiles(1, false);
    }, [companySearch, selectedHobbies, selectedTraits, selectedHousing])

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
                <Autocomplete 
                options={housingOptions} sx={{ minWidth: 220,'& fieldset': { borderRadius: 33 }}}
                value={selectedHousing} 
                onChange={(_, newValue) => setSelectedHousing(newValue)}
                renderInput={
                    (params) => ( <TextField {...params} label="Looking for Housing?" variant="outlined" />)
                } />
                <Button variant="contained" size="large" onClick={clearFilters}>Clear Filters</Button>
            </Box>
            {profiles.length > 0 ? (
                <>
                    <ProfileGrid profiles={profiles} />
                    {page < totalPages && (
                        <Button 
                            variant="contained" 
                            size="large" 
                            onClick={handleViewMore}
                            disabled={loadingMore}
                        >
                            {loadingMore ? "Loading..." : "View More Profiles"}
                        </Button>
                    )}
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