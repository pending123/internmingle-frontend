import SearchBar from "../../components/SearchBar/SearchBar"
import Place from "../../features/neighborhoods/Place/Place";
import { useEffect, useState } from "react";
import './NeighborhoodsPage.css'
import axios from "axios";
import { APIProvider, Map} from "@vis.gl/react-google-maps";
import { CircularProgressbar, buildStyles} from 'react-circular-progressbar';
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
                        <div className="metrics">
                            <div style={{width: 150, height: 'fit-content'}}>
                                <div style={{ width: 120}}>
                                    <CircularProgressbar 
                                    value={info.walkScore} 
                                    text={`${info.walkScore}`}
                                    styles={buildStyles({
                                        pathColor: '#FD7654',
                                        textColor: 'black',
                                        strokeLinecap: 'butt'
                                    })} />
                                </div>
                                <h3>{info.walkDescription}</h3>
                                <h4>WALK SCORE</h4>
                            </div>

                            <div style={{width: 150, height: 'fit-content'}}>
                                <div style={{ width: 120}}>
                                    <CircularProgressbar 
                                    value={info.bikeScore} 
                                    text={`${info.bikeScore}`}
                                    styles={buildStyles({
                                        pathColor: '#FD7654',
                                        textColor: 'black',
                                        strokeLinecap: 'butt'
                                    })} />
                                </div>
                                <h3>{info.bikeDescription}</h3>
                                <h4>BIKE SCORE</h4>
                            </div>

                            <div style={{width: 150, height: 'fit-content'}}>
                                <div style={{ width: 120 }}>
                                    <CircularProgressbar 
                                    value={info.transitScore} 
                                    text={`${info.transitScore}`}
                                    styles={buildStyles({
                                        pathColor: '#FD7654',
                                        textColor: 'black',
                                        strokeLinecap: 'butt'
                                    })} />
                                </div>
                                <h3>{info.transitDescription}</h3>
                                <h4>TRANSIT SCORE</h4>
                            </div>
                        </div>
                        </>
                    )}
                    
                    {info && 
                    (<div className="places">
                        <h2>Points of Interest </h2>
                        {/*Place Component*/}
                        <div className="placeList">
                            <Place />
                            <Place />
                            <Place />
                        </div>
                    </div>
                    )} 
                </div>
            </div>
        </div>
        </>
    )
}