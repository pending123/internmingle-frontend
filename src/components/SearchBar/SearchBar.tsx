import { Button } from '@mui/material';
import './SearchBar.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faX } from '@fortawesome/free-solid-svg-icons'

interface SearchBarProps {
    action?: (formData: FormData) => void | Promise<void>;
    placeholder?: string;
}

export default function SearchBar({ 
    action, placeholder = "Search..."}: SearchBarProps) 
{
    return (
        <form className="searchBar" action={action}>
            <Button className="clearBtn" type="reset">
                <FontAwesomeIcon icon={faX} />
            </Button>

            <input className="searchInput" name="query" placeholder={placeholder}/>

            <Button type="submit" variant='contained'>
                <FontAwesomeIcon icon={faMagnifyingGlass}/>
            </Button>
        </form>
    );
}