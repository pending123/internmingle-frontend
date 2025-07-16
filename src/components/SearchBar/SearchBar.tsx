import Button from "../Button/Button";
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
            <button className="clearBtn" type="reset">
                <FontAwesomeIcon icon={faX} />
            </button>

            <input className="searchInput" name="query" placeholder={placeholder}/>

            <Button type="submit" variant="primary" size="medium">
                <FontAwesomeIcon color="black" icon={faMagnifyingGlass}/>
            </Button>
        </form>
    );
}