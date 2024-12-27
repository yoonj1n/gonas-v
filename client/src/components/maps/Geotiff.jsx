import "leaflet-geotiff-2";
import "leaflet-geotiff-2/dist/leaflet-geotiff-rgb";
import "leaflet-geotiff-2/dist/leaflet-geotiff-plotty"; // requires plotty
import L from "leaflet";
import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";

export default function Geotiff({ url, options,Types }){
    const map = useMap();
    const layerRef = useRef(null);

    useEffect(() => {
      try{
        const leafletElement = L.leafletGeotiff(url, options);
      
        Types==='plotty'?leafletElement.setZIndex(100):leafletElement.setZIndex(200);
        layerRef.current = leafletElement;
        leafletElement.addTo(map);
  
        const onMapClicks = (e)=>{
          const latlng = e.latlng;
          const value = leafletElement.getValueAtLatLng(latlng.lat,latlng.lng);
          const fullValue = leafletElement.getRasterArray();
          if(value !== null && value !== undefined){
            
            console.log('Value at latlng : ',value);
            console.log('Full Value : ',fullValue);
          }
        }
  
        map.on("click", onMapClicks);
        return () => {
          if (leafletElement) {
            leafletElement.remove();
          }
        map.off("click",onMapClicks);
        };

      } catch(e){
        console.log('error in Geotiff : ',e);
      }
  
      }, [map, url, options,Types]);

    return null;
}