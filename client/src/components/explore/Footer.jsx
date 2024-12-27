import '../css/Footer.css';
import { Link } from '@mui/material';

export default function Footer(){
    return(
        <div className="FT">
            <p>© 2024 <Link href="https://www.geosr.com" underline='always' color="inherit" target="_blank" rel="noopener noreferrer">GeoSR</Link>. All rights reserved.</p>
            <p>Contact: ympark@geosr.com</p>
        </div>

    )
}