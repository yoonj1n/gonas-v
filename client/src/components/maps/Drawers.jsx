import { useState, useEffect } from 'react';
import '../css/Drawers.css';
import { Drawer, IconButton, Select, MenuItem } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, StaticDatePicker, DatePicker, TimePicker } from '@mui/x-date-pickers';

export default function Drawers({options}){
    const [open, setOpen] = useState(window.innerWidth > 768);
    const [sharedDate, setSharedDate] = useState(options.dataOptions.date);

    useEffect(()=>{
        setSharedDate(options.dataOptions.date);
    }, [options.dataOptions.date]);

    const handleSharedDate = (newValue)=>{
        // setSharedDate(newValue);
        options.handleDataOptions('date', newValue);
    }

    console.log('Drawers', options);

    return(
        <div className='drawer-wrapper'>
        <Drawer
            className='drawer'
            anchor='left'
            open={open}
            variant='persistent'
        >
            <div className='drawer-open-wrapper'>
                <IconButton onClick={()=>setOpen(false)} className='drawer-open-btn'>
                    <ArrowBackIosIcon/>
                </IconButton>
            </div>
            <div className='drawer-component-wrapper'>
                <div className='drawer-header'>
                    Date
                </div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StaticDatePicker
                        displayStaticWrapperAs='desktop'
                        value={sharedDate}
                        onChange={handleSharedDate}
                        // renderInput={(params)=><input {...params}/>}
                    />
                    <DatePicker
                        className='drawer-date-picker'
                        value={sharedDate}
                        onChange={handleSharedDate}
                        // renderInput={(params)=><input {...params}/>}
                    />
                    <TimePicker
                        className='drawer-time-picker'
                        value={options.dataInfo['tunit'].includes('d')?null:options.dataOptions.time}
                        onChange={(newValue) => {
                            const isDisabled = newValue?.$H % Number(options.dataInfo['tunit'][0]) !== 0;
                            if (!isDisabled) {
                                options.handleDataOptions('time', newValue);
                            }
                        }}
                        disabled={options.dataInfo['tunit'].includes('d')}
                        views={['hours']}
                        shouldDisableTime={(timeValue, view) => {
                            if (view === 'hours') {
                              return timeValue.$H % Number(options.dataInfo['tunit'][0]) !== 0;
                            }
                            return false;
                          }}
                        ampm={false}
                    />
                </LocalizationProvider>
            </div>
            <div className='drawer-component-wrapper'>
                <div className='drawer-header'>
                    Variable
                </div>
                <Select
                    className='drawer-select'
                    value={options.dataOptions.variable}
                    onChange={(e)=>{
                        if (!options.dataInfo['varz'][options.dataInfo['vars'].indexOf(e.target.value)]){
                            options.handleDataOptions('layer', options.dataInfo['layer'][0]);
                            options.handleDataOptions('variable', e.target.value);
                        }
                        else options.handleDataOptions('variable', e.target.value)
                    }}
                >
                    {[...(options.dataInfo['vars']||[]), ...(options.dataInfo['vect']||[])].map((variable, index) => (
                        <MenuItem key={index} value={variable}>{variable}</MenuItem>
                    ))}
                </Select>
            </div>
            <div className='drawer-component-wrapper'>
                <div className='drawer-header'>
                    Depth
                </div>
                <Select
                    className='drawer-select'
                    value={options.dataOptions.layer}
                    onChange={(e)=>options.handleDataOptions('layer', e.target.value)}
                    disabled={options.dataInfo['layer'].length === 1 || !options.dataInfo['varz'][options.dataInfo['vars'].indexOf(options.dataOptions.variable)]}
                >
                    {options.dataInfo['layer'].map((layer, index) => (
                        <MenuItem 
                            key={index}
                            value={layer}
                        >{layer === 'l00'? 'surface':options.dataInfo['depth'][index]}</MenuItem>
                    ))}
                </Select>
            </div>
            <div className='drawer-component-wrapper'>
                <div className='drawer-header'>
                    Color Scale
                </div>
                <Select
                    className='drawer-select'
                    value={options.selectedColorScale}
                    onChange={(e)=>{options.handleSelectedColorScale(e.target.value);} }
                >
                    {
                        options.colorScaleList.map((colorScale, index) => (
                            <MenuItem key={index} value={colorScale}>{colorScale}</MenuItem>
                        ))
                    }
                </Select>
            </div>
        </Drawer>
        <IconButton className="drawer-open-btn-open" onClick={()=>setOpen(true)}
            sx={{...(open && {display:'none'})}}>
            <ArrowForwardIosIcon/>
        </IconButton>
        </div>
)
}