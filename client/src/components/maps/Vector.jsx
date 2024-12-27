import "leaflet-geotiff-2";
import "leaflet-geotiff-2/dist/leaflet-geotiff-rgb";
import "leaflet-geotiff-2/src/leaflet-geotiff-vector-arrows";
import L from "leaflet";
import Geotiff from "./Geotiff";

export default function Vector({ options, ...props }){
    const renderer = new L.LeafletGeotiff.VectorArrows(options);

    return(
        <Geotiff {...props} options={{ ...options, renderer}} Types='vector'/>

    )
}