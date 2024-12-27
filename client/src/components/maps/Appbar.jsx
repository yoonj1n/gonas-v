import { AppBar, Toolbar } from "@mui/material"
import './css/Appbar.css';

export default function Appbar(){
    return(
        <AppBar position="absolute">
            <Toolbar
                className="appbar"
            >
                {/* <img src="/logo.png" alt="logo" className="appbar-logo"/> */}
                <h2 className="appbar-header">GONAS-V</h2>
            </Toolbar>
        </AppBar>

    )
}