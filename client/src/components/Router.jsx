import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Mainpage from './Mainpage';
import Maps from './Maps';
import Notfound from './Notfound';
import Explore from './Explore';
import Description from './explore/Description';

export default function Router(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Mainpage/>} />
                <Route path="/explore" element={<Explore/>} /> 
                <Route path="/maps/:data" element={<Maps/>}/>
                <Route path="/description/:data" element={<Description/>} />
                <Route path="*" element={<Notfound/>} />
            </Routes>
        </BrowserRouter>
    )
}