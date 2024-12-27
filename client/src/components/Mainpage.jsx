import './css/Mainpage.css'
import { useSpring, animated } from '@react-spring/web';
import {Button} from '@mui/material';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Mainpage(){

    const navigate = useNavigate();

    const slideDown = useSpring({
        from: {opacity: 0, y: -30},
        to: {opacity: 1, y:0},
        config: { tension: 100, friction: 80 }
    })

    
    const [modalOpen, setModalOpen] = useState(false);

    return(
        <div className='MP'>
            <div className="MP-video-wrapper">
                <video autoPlay loop muted playsInline>
                    <source src={process.env.PUBLIC_URL + '/background.mp4'} type='video/mp4' />
                </video>
            </div>
            <div className='MP-bg-overlay'/>
            <div className={`MP-contents-wrapper${modalOpen?'-shrink':''}`}>
                <animated.div style={slideDown} className="MP-header-wrapper">
                    <p className='MP-header'>GONAS-V</p>
                    <p className='MP-subheader'>Geosr Ocean Numerical Analysis System - Visualization</p>
                    <Button
                        variant='contained'
                        className='MP-header-button'
                        endIcon={<DoubleArrowIcon />}
                        onClick={()=>{navigate('/explore')}}
                    >GO VIEWER</Button>
                </animated.div>
            </div>
        </div>
    )
}