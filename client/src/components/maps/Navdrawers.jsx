import '../css/Navdrawers.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, IconButton, CardActionArea, CardContent, CardMedia } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function Navdrawers({alldata}){
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const modelNameForm = (model) => {
        return model.toUpperCase().replace('_',' ').replace('RE','Reanalysis').replace('FC','Forecast');
    }

    return(
        <>
        <IconButton
            className='nav-drawer-button'
            onClick={() => setOpen(!open)}
            sx={{
                top: open ? '15rem': '0',
            }}
        >
            {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
        </IconButton>
        {open&&<div className={`nav-drawer ${open? 'open':''}`}>
            <div className='nav-drawer-contents'>
                {Object.keys(alldata).map((model, idx) =>(
                    <Card
                        key={idx}
                        className='nav-drawer-card'
                        onClick={()=>{navigate(`/maps/${model}`, {state:{dataInfo:alldata}})}}
                    >
                        <CardActionArea>
                            <CardMedia
                                component='img'
                                image={`/signview/${model}.png`}
                                height='120rem'
                            />
                            <CardContent>
                                {modelNameForm(model)}
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
                    
            </div>
        </div>}
        </>
    )
}