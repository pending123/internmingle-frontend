import './Place.css'

interface PlaceProps {
    name: string;
    address: string;
    category: string;
}

export default function Place({ name, address, category } : PlaceProps) 
{
    return (
        <>
        <div className='place'>
            <div>
                <p>{name}</p>
                <p>{address}</p>
            </div>
            <p className='placeCategory'>{category}</p>
        </div>

        </>
    )
}