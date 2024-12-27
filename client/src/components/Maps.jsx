import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import "./css/Maps.css";
import { ZoomControl, MapContainer } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import Basemap from './maps/Basemap';
import Raster from './maps/Raster';
import Vector from './maps/Vector';
import Drawers from "./maps/Drawers";
import Navdrawers from "./maps/Navdrawers";
import customcolorscales from './colorscales/colorscales';
import dayjs from 'dayjs';
import { CircularProgress, Alert, AlertTitle, Snackbar, Backdrop } from '@mui/material';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {colorscales} from 'plotty/src/colorscales';
const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
});

export default function Maps(){
    // Params
    /**
     * 1.  data : data is the data to be visualized
     */
    const { data } = useParams();
    // **********************************Init Data Setting********************************** //
    const { state } = useLocation();
    const allData = state.dataInfo;
    const dataInfo = allData[data];
    
    // Contrrol Data Options
    const initDataOptions = {
        date: dayjs('20231001'),
        time: dayjs().set('hour', 0),
        variable: dataInfo['vars'][0],
        layer: dataInfo['layer'][0],
    }
    const [DataOptions, setDataOptions] = useState(initDataOptions);
    const handleDataOptions = (key, value) => {
        setDataOptions((prev) => {
            const newOptions = {
                ...prev,
                [key]: value,
            };

            handleControlList('dataOptions', newOptions);

            return newOptions;
        });
    }


    // **********************************Loading********************************** //
    const [loading, setLoading] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);

    // **********************************Error********************************** //
    const [error, setError] = useState({error: false, message: ""});
    const handleError = () =>{
        setError({error: false, message: ""});
        setDataOptions(initDataOptions);
        setLoading(false);
    }

    // **********************************Map Setting********************************** //
    const position = [36,128];
    /**
     * 0: Shape
     * 1: cartoDB
     * 2: cartoDB Dark
     * 3: cartoDB Light
     * 4: OpenStreetMap
     */
    const [mapType, setMapType] = useState(2);

    // **********************************Colorbar********************************** //
    const [normDataRange, setNormDataRange] = useState(null);
    const getNormDataRange = (min, max) =>{
        // Get the normalized data range 0~1
        const range = max - min;
        const dataRange = [];
        // for(let i=0; i<11; i++){
        //     dataRange.push((min + range * i / 10).toFixed(1));
        // }
        for(let i=0; i<7; i++){
            dataRange.push(((min + range * i / 6)).toFixed(1));
        }
        return dataRange;
    }
    const handleNormDataRange = (min, max) =>{
        setNormDataRange(getNormDataRange(min, max));
    };
    const [colorScaleList, setColorScaleList] = useState([]);
    const getColorScaleList = () =>{
        return [...new Set([...Object.keys(colorscales), ...Object.keys(customcolorscales)])];
    }
    const [selectedColorScale, setSelectedColorScale] = useState('turbo');
    const handleSelectedColorScale = (colorScale) =>{
        setSelectedColorScale(colorScale);
        setRasterOptions((prev) => ({
            ...prev,
            colorScale: colorScale,
            colors: customcolorscales[colorScale],
        }));
        setVRasterOptions((prev) => ({
            ...prev,
            colorScale: colorScale,
            colors: customcolorscales[colorScale],
        }));
        handleControlList('selectedColorScale', colorScale);
    }
    console.log(selectedColorScale);

    // **********************************handle Data********************************** //
    // 1. Data Options
    const [IsRaster, setIsRaster] = useState(true);
    const [IsVector, setIsVector] = useState(false);

    // 2. Data API Path
    const [rasterData, setRasterData] = useState(`/api/tiff/${data}/${DataOptions.date.format('YYYYMMDD')}/${DataOptions.time.format('HH')}/${DataOptions.variable}/${DataOptions.layer}`);
    const [vectorData, setVectorData] = useState(`/api/tiff/${data}/${DataOptions.date.format('YYYYMMDD')}/${DataOptions.time.format('HH')}/${DataOptions.variable}/${DataOptions.layer}`);
    
    // 3. Raster Options
    const [RasterOptions, setRasterOptions] = useState({
        /**
         * Raster Options
         */
        band: 0,
        name: "Raster Data",
        colorScale: selectedColorScale,
        colors: customcolorscales[selectedColorScale],
        clampLow: false,
        useWebGL: true,
        noDataValue: 361,
        blockSize: 1048576,
    });

    // 4. Vector Raster Options
    const [VRasterOptions, setVRasterOptions] = useState({
        /**
         * Vector's Raster Options
         */
        band: 0,
        colorScale: selectedColorScale,
        clampLow: false,
        useWebGL: true,
        noDataValue: 361,
        colors: customcolorscales[selectedColorScale],
        dataRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        blockSize: 1048576,
    });

    // 5. Vector Options
    const [VectorOptions, setVectorOptions] = useState({
        /**
         * Vector Options
         */
        // samples: [0,1],
        arrowSize: 10,
        colors: ['#ffffff','#ffffff'],
        colorStep: 11,
        noDataValue: 361,
        blockSize: 1048576,
    });

    // 6. Fetch Data
    const handleFetchData = () => {
        setLoading(true);
        try{
            fetch(`/api/percentile/${data}/${DataOptions.date.format('YYYYMMDD')}/${DataOptions.time.format('HH')}/${DataOptions.variable}/${DataOptions.layer}`)
            .then((res)=>res.json())
            .then((rasterPercentile) => {
                if(rasterPercentile.error){
                    setError({error: rasterPercentile.error, message: rasterPercentile.message});
                    return;
                }
                setRasterOptions((prev) => ({
                    ...prev,
                    displayMin: rasterPercentile.min_val,
                    displayMax: rasterPercentile.max_val,
                }));
                setVectorOptions((prev) => ({
                    ...prev,
                    displayMin: rasterPercentile.min_val,
                    displayMax: rasterPercentile.max_val,
                }));
                setVRasterOptions((prev) => ({
                    ...prev,
                    displayMin: rasterPercentile.min_val,
                    displayMax: rasterPercentile.max_val,
                }));
                handleNormDataRange(rasterPercentile.bar_min, rasterPercentile.bar_max);
                // handleNormDataRange(rasterPercentile.min, rasterPercentile.max);
                setRasterData(`/api/tiff/${data}/${DataOptions.date.format('YYYYMMDD')}/${DataOptions.time.format('HH')}/${DataOptions.variable}/${DataOptions.layer}`);
                setVectorData(`/api/tiff/${data}/${DataOptions.date.format('YYYYMMDD')}/${DataOptions.time.format('HH')}/${DataOptions.variable}/${DataOptions.layer}`);
                setLoading(false);
            })
            .catch((err) => {
                if(err){
                    setError({error: true, message: `데이터 불러오기에 실패했습니다, ${err}`});
                }
            })
        } catch (err) {
            setError({error: true, message: `데이터 불러오기에 실패했습니다, ${err}`});
        }
    }


    // **********************************Control List********************************** //
    const handleControlList = (key, value) => {
        setControlList((prev) => ({
            ...prev,
            [key]: value,
        }));
    }
    const [controlList, setControlList] = useState({
        /**
         * To Drawers, control List
         */
        handleControlList: handleControlList,
        mapType: mapType,
        handleMapType: setMapType,
        dataInfo: dataInfo,
        dataOptions: DataOptions,
        handleDataOptions: handleDataOptions,
        colorScaleList: colorScaleList,
        selectedColorScale: selectedColorScale,
        handleSelectedColorScale: handleSelectedColorScale,
    })

    // *************************useEffect************************* //
    // 1. If change data, reset data options
    useEffect(() => {
        setDataOptions(initDataOptions);
    }, [data]);
    
    // 2. Fetch Data & Setting Control List
    useEffect(() => {
        setLoading(true);
        try{
            handleFetchData();
            handleControlList('colorScaleList', getColorScaleList());
            handleControlList('dataOptions', DataOptions);
            handleControlList('dataInfo', dataInfo);
            if(dataInfo['vect'].includes(DataOptions.variable)){
                setIsVector(true);
                setIsRaster(false);
            }else {
                setIsVector(false);
                setIsRaster(true);
            }
            setLoading(false);
        } catch (err) {
            setError({error: true, message: `데이터 불러오기에 실패했습니다. ${err}`});
        }
    }, [DataOptions]);

    // 3. Loading Control
    useEffect(() => {
        if (!mapLoaded) {
            const timer = setTimeout(() => setMapLoaded(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [mapLoaded]);
    const isLoading = loading || !mapLoaded || error.error;


    return(
        <div className="map-container">  <ThemeProvider theme={darkTheme}>
            {/* <Appbar/> */}
            {isLoading && <Backdrop open={true} className='map-backdrop'><CircularProgress className="map-loading"/></Backdrop>}
            {/* Import Navdrawer */}
            <Navdrawers alldata={allData}/>
            {/* MAP */}
            <MapContainer center={position} zoom={5} scrollWheelZoom={true} minZoom={3} className='map-container-head'>
                <ZoomControl position="topright"/>
                {/* Import Colorbar */}
                <div className='map-colorbar'>
                    <div className='map-colorbar-num-wrapper'>{
                        normDataRange&&normDataRange.map((num, idx) => (
                            <p key={idx} className='map-colorbar-num'>{num}</p>
                        ))
                    }</div>
                </div>
                {/* Import Drawers */}
                <Drawers options={controlList}/>
                {/* Import Basemap */}
                <Basemap typeNum={mapType}/>
                {/* Import Raster */}
                {!isLoading&&IsRaster?<Raster options={RasterOptions} url={rasterData}/>:null}
                {/* Import Vector */}
                {!isLoading&&IsVector?<Raster options={VRasterOptions} url={vectorData}/>:null}
                {!isLoading&&IsVector?<Vector options={VectorOptions} url={vectorData}/>:null}
                {/* Error */}
                {error.error && 
                    <Snackbar open={error.error} autoHideDuration={6000} onClose={handleError} anchorOrigin={{vertical: 'top', horizontal: 'center'}} className='map-alert'>
                        <Alert severity="error" variant="filled" onClose={handleError}>
                            <AlertTitle>Error</AlertTitle>
                            {error.message}
                        </Alert>
                    </Snackbar>
                }
            </MapContainer>
            </ThemeProvider> </div>

    )
}