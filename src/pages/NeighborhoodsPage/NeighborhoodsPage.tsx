import SearchBar from "../../components/SearchBar/SearchBar"
import { useEffect, useState } from "react";
import './NeighborhoodsPage.css'
import axios from "axios";
import { APIProvider, Map} from "@vis.gl/react-google-maps";

export default function NeighborhoodsPage() 
{
    const [info, setInfo] = useState<any>([]);
    const mapsKey: string = import.meta.env.VITE_MAPS_API_KEY;

    async function search(formData: FormData): Promise<void>{
        const query = formData.get("query");
        alert(`You searched for '${query}'`);
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
            <h3>Showing results for Mission District, SF</h3>

            <div className="infoDisplay">
                <div className="mapPanel">
                    {info.latitude && info.longitude ? (
                        <APIProvider apiKey={mapsKey}>
                        <Map
                            defaultZoom={16}
                            center={{ lat: info.latitude, lng: info.longitude }}
                        >
                        </Map>
                        </APIProvider>
                    ) : (
                        <p>Loading map...</p>
                    )}
                </div>

                <div className="infoPanel">
                    {info && (
                        <>
                        <h3>{info.neighborhood}</h3>
                        <h3>Walk Score: {info.walkScore}</h3>
                        <h3>Bike Score: {info.bikeScore}</h3>
                        <h3>Transit Score: {info.transitScore}</h3>
                        </>
                    )}
                </div>
            </div>
        </div>
        </>
    )
}