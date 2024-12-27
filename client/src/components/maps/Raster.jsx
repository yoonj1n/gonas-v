import "leaflet-geotiff-2";
import "leaflet-geotiff-2/dist/leaflet-geotiff-rgb";
import "leaflet-geotiff-2/dist/leaflet-geotiff-plotty"; // requires plotty
import L from "leaflet";
import { useEffect, useState } from "react";
import Geotiff from "./Geotiff";

export default function Raster({ options, ...props }) {
    const renderer = new L.LeafletGeotiff.Plotty(options);
    // Color bar
    const [colorbar, setColorbar] = useState(null);


    useEffect(() => {
        const colorBar = renderer.getColorbarDataUrl(options.colorScale);
        setColorbar(colorBar);
    }, [options.colorScale]);

    useEffect(()=>{
        if(colorbar){
            const img = document.getElementById('colorbarImg');
            if(img) document.getElementsByClassName('map-colorbar')[0].removeChild(img);
            const newImg = document.createElement('img');
            newImg.id = 'colorbarImg';
            newImg.classList.add('colorbarImg');
            newImg.src = colorbar;

            document.getElementsByClassName('map-colorbar')[0].appendChild(newImg);
        }
    },[colorbar]);

    return <Geotiff {...props} options={{ ...options, renderer }} Types='plotty' />;
}