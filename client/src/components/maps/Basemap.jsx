import { TileLayer, GeoJSON } from 'react-leaflet'
import maplists from './maplist';
import { useEffect, useState } from 'react';

export default function Basemap(attr){
    const typeN = attr.typeNum;
    const [shapes, setShapes] = useState(null);

    useEffect(() => {
        if (typeN === 0) {
            fetch(maplists[typeN].url)
                .then(res => res.json())
                .then(data => {
                    setShapes(data.result);
                })
                .catch(err => {
                    console.error("Error fetching GeoJSON data:", err);
                });
        }
    }, [typeN]);
    

    const mapStyle = ()=>({
        fillColor: "#262626",
        fillOpacity: 1,
        color:'#504f4f',
        // color:'#262626',
        weight: 0.5,
    });

    return(
        typeN !== 0 ? (
            <TileLayer
                attribution={maplists[typeN].attr}
                url={maplists[typeN].url}
            />
        ) : (
            shapes && shapes.map((shape, index) => (
                <GeoJSON key={index} data={shape} style={mapStyle} />
            ))
        )

    )
}