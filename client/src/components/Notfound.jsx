import './css/Mainpage.css'
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Notfound(){
    const navigate = useNavigate();

    return(
        <div className="MP">
            <div className="MP-video-wrapper">
                <video autoPlay loop muted playsInline>
                    <source src='background.mp4' type='video/mp4' />
                </video>
            </div>

            <div className='MP-notfound'>
                    <p className='MP-notfound-header'>404 Not Found</p>
                    <Button
                        variant='contained'
                        className='MP-header-button'
                        onClick={()=>{navigate('/')}}
                    >MainPage</Button>
            </div>
        </div>

    )
}