import { Button } from '@mui/material';
import './SearchBar.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faX } from '@fortawesome/free-solid-svg-icons'

interface SearchBarProps {
  action?: (formData: FormData) => void | Promise<void>;
  placeholder?: string;
  className?: string; 
}

export default function SearchBar({ 
    action, placeholder = "Search...", className}: SearchBarProps) 
{
    return (
        <form className={`searchBar ${className || ''}`} action={action}>
            <Button className="clearBtn" type="reset" sx={{ px: 1.5, minWidth: 'auto' }}>
                <FontAwesomeIcon icon={faX} />
            </Button>

            <input className="searchInput" name="query" placeholder={placeholder} autoComplete='off'/>

            <Button type="submit" variant='contained' sx={{ px: 1.5, minWidth: 'auto' }}>
                <FontAwesomeIcon icon={faMagnifyingGlass}/>
            </Button>
        </form>
    );
}