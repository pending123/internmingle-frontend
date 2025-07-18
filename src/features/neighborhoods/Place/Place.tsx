import './Place.css'

interface PlaceProps {
    name: string;
    address: string;
}

export default function Place({ name, address } : PlaceProps) 
{
    return (
        <>
        <div className='place'>
            <div>
                <p>{name}</p>
                <p>{address}</p>
            </div>
            <p className='placeCategory'>Groceries</p>
        </div>

        </>
    )
}