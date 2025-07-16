import SearchBar from "../../components/SearchBar/SearchBar"
import { useEffect, useState } from "react";
import './NeighborhoodsPage.css'
import axios from "axios";
import { APIProvider, Map} from "@vis.gl/react-google-maps";

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


export default function NeighborhoodsPage() 
{
    const [info, setInfo] = useState<any>(null);
    const mapsKey: string = import.meta.env.VITE_MAPS_API_KEY;

    async function search(formData: FormData): Promise<void>{
        const query = formData.get("query");
        try {
            const {data: neighborhoodData} = await axios.get(`http://localhost:3000/api/neighborhoods?query=${query}`)
            console.log("Neighborhood data:", neighborhoodData); 
            setInfo(neighborhoodData);
        } catch (err) 
        {
            console.error("Failed to search for neighborhood")
        }
    }

    return (
        <>
        <div className="neighborhoodContainer">
            <h2>Enter an address, zip code or neighborhood to get started</h2>
            <SearchBar action={search}/>
            {info && <h3>Showing results for {info.neighborhood}</h3>}

            <div className="infoDisplay">
                <div className="mapPanel">
                    {info ? (
                        <APIProvider apiKey={mapsKey}>
                        <Map
                            defaultZoom={15}
                            center={{ lat: info.latitude, lng: info.longitude }}
                        >
                        </Map>
                        </APIProvider>
                    ) : (
                        null
                    )}
                </div>

                <div className="infoPanel">
                    {info && (
                        <>
                        <div style={{ width: 110, height: 100 }}>
                            <CircularProgressbar value={info.walkScore} text={`${info.walkScore}`} />
                            <h3>{info.walkDescription}</h3>
                        </div>

                        <div style={{ width: 110, height: 100 }}>
                            <CircularProgressbar value={info.bikeScore} text={`${info.bikeScore}`} />
                            <h3>{info.bikeDescription}</h3>
                        </div>

                        <div style={{ width: 110, height: 100 }}>
                            <CircularProgressbar value={info.transitScore} text={`${info.transitScore}`} />
                            <h3>{info.transitDescription}</h3>
                        </div>
                        </>
                    )}
                </div>
            </div>
        </div>
        </>
    )
}