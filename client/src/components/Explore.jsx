import './css/Explore.css';
import { useState, useEffect } from 'react';
import { IconButton, Divider, List, ListItem, ListItemButton, ListItemText, Collapse } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import models from './models/models.js';
import ModelList from './explore/ModelList.jsx';
import Description from './explore/Description.jsx';
import Footer from './explore/Footer.jsx';

export default function Explore() {

    const [selectedModel, setSelectedModel] = useState(0);
    // const [opens, setOpens] = useState(Array(models.length).fill(false));
    const [modelList, setModelList] = useState([]);
    const [isDescription, setIsDescription] = useState(false);
    const [selectedData, setSelectedData] = useState('');
    const [dataInfo, setDataInfo] = useState({});

    const modelNameForm = (model) => {
        return model.toUpperCase().replace('_',' ').replace('RE','Reanalysis').replace('FC','Forecast');
    }

    useEffect(() => {
        async function fetchModelData() {
            const fetchedData = await Promise.all(
                models.map(async (model, idx) => {
                    const response = await fetch(`/api/modelList/${model.model}`);
                    const data = await response.json();
                    return { name: model.name, model: model.model, data: data.result };
                })
            );
            setModelList(fetchedData);
        }
    
        if (modelList.length === 0) {
            fetchModelData();
        }
    }, [modelList]);

    useEffect(()=>{
        async function fetchData(){
            const response = await fetch(`/api/datainfo`);
            const data = await response.json();
            setDataInfo(data);
        }
        fetchData();
    },[]);

    // useEffect(() => {
    //     if(selectedModel !== null){
    //         setOpens(opens.map((open, index) => index === selectedModel ? !open : open));
    //     }
    // }, [selectedModel]);

    return(
        <div className="EP">
            <div className='EP-header'>
                <div className='EP-width-fixer'>
                <div className='EP-header-wrapper'>
                    <img className='EP-header-logo' src='/logo.png' alt='logo'/>
                    <div className='EP-header-title-wrapper'>
                        <p className='EP-header-title'>GONAS-V</p>
                        <p className='EP-header-subtitle'>Geosr Ocean Numerical Analysis System - Visualization</p>
                    </div>
                </div>
                <IconButton className='EP-header-home-btn' onClick={()=>{window.location.href = '/'}}>
                    <HomeIcon/>
                </IconButton>
                </div>                
            </div>
            <div className='EP-subheader'>
                {/* <img className='EP-subheader-bg' src={process.env.PUBLIC_URL + '/background.png'} alt='explore-bg'/> */}
                <div className='EP-width-fixer'>
                <div className='EP-subheader-overlay'/>
                <p className='EP-subheader-title'>GeoSR Data Store</p>
                </div>
            </div>
            <div className='EP-contents'>
                <div className='EP-width-fixer'>
                <div className='EP-contents-list'>
                    <List
                        className='EP-contents-list-wrapper'
                    >
                        {
                            modelList.length > 0 && modelList.map((model, index) =>( 
                                <>
                                <ListItem
                                    key={index}
                                    className={`EP-contents-list-item${selectedModel === index ? '-selected' : ''}`}
                                >
                                    <ListItemButton
                                        className='EP-contents-list-item-button'
                                        // onClick={()=>{setSelectedModel(index); setIsDescription(false); setSelectedData(''); setOpens(opens.map((open, idx) => idx === index ? !open : open));}}
                                        onClick={()=>{setSelectedModel(index); setIsDescription(false); setSelectedData('');}}
                                    >
                                        <ListItemText primary={model.name} /> 
                                        <p className='EP-contents-list-item-count'>{model.data.length}</p>
                                    </ListItemButton>
                                </ListItem>
                                <Collapse in={true} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {
                                            model.data.map((data, idx) => (
                                                <ListItem
                                                    key={`${index}-${idx}`}
                                                    className={`EP-contents-list-collapse-item${selectedData === data ? '-selected' : ''}`}
                                                >
                                                    <ListItemButton
                                                        className='EP-contents-list-collapse-item-button'
                                                        onClick={()=>{setIsDescription(true); setSelectedData(data);}}
                                                    >
                                                        <ListItemText primary={`- ${modelNameForm(data)}`} />
                                                    </ListItemButton>
                                                </ListItem>
                                            ))
                                        }
                                    </List>
                                </Collapse>
                                </>
                            ))
                        }
                    </List>
                </div>
                <Divider orientation='vertical' flexItem
                    sx={{margin: '0 0.5rem',}}
                />
                {
                    !isDescription? <ModelList modelList={modelList} selectedModel={selectedModel} setIsDescription={setIsDescription} setSelectedData={setSelectedData} dataInfo={dataInfo}/>:<Description selectedData={selectedData} dataInfo={dataInfo}/>
                }
                </div>
            </div>
            <Footer/>
        </div>
    )
}