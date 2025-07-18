import React, { useState, useEffect } from "react";


const eventGrid =  ({events}) =>{
    
    return(
        <>
        {events.map((event)=>(
            <event
                location={event.location}
                category ={event.category}
                dateTime ={event.dateTime}
                description = {event.description}

                />
        ))}
        </>
    )
}