import '../css/Description.css';
import { Paper, Divider, Table, TableContainer, TableBody,TableRow, TableCell, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Description({selectedData, dataInfo}){
    const navigate = useNavigate();

    const modelNameForm = (model) => {
        return model.toUpperCase().replace('_',' ').replace('RE','Reanalysis').replace('FC','Forecast');
    }


    return(
        <Paper className='DC'>
            <div className='DC-header-wrapper'>
                <h2 className='DC-header'>{modelNameForm(selectedData)}</h2>
                <button className='DC-header-btn' variant='contained' onClick={()=>{navigate(`/maps/${selectedData}`, {state:{dataInfo:dataInfo}})}}>Explore Data</button>
            </div>
            <Divider/>
            <div className='DC-overview'>
                <h3 className='DC-contents-header'>Overview</h3>
                <Divider/>
                <div className='DC-overview-wrapper'>
                    <div className='DC-overview-description'>
                        <img className='DC-overview-img' src={`/signview/${selectedData}.png`} alt='ocean'/>
                        <p>{
                            dataInfo[selectedData]?.description
                            .replace(/\|/g, '\\n')
                            .split('\\n')
                            .map((line) => 
                            (
                                <>{
                                    line.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
                                        part.match(/https?:\/\/[^\s]+/) ? (
                                            <Link key={i} href={part} target="_blank" rel="noopener noreferrer" color='warning'>
                                                {part}
                                            </Link>
                                        ) : (
                                            part
                                        )
                                    )
                                }<br /></>
                            )
                            )
                        }</p>
                    </div>
                </div>
            </div>
            <div className='DC-contents'>
                <h3 className='DC-contents-header'>Classification</h3>
                <Divider/>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className='DC-contents-table-header'>Name</TableCell>
                                <TableCell>{modelNameForm(selectedData)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='DC-contents-table-header'>Data Inception</TableCell>
                                <TableCell>{dataInfo[selectedData]?.dstart}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='DC-contents-table-header'>Time resolution</TableCell>
                                <TableCell>{dataInfo[selectedData]?.tunit}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='DC-contents-table-header'>Elevation(depth) levels</TableCell>
                                <TableCell>{dataInfo[selectedData]?.depth?.map(t=>t===0?'surface':t).join(', ')}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div className='DC-contents'>
            <h3 className='DC-contents-header'>Variables</h3>
                <Divider/>
                <TableContainer>
                    <Table>
                        <TableBody>
                            {
                                dataInfo[selectedData]?.vars.map((varname, index) => {
                                    const var_des = dataInfo[selectedData]?.variable_info.find(
                                        (info) => info[varname] !== undefined
                                    )
                                    return (
                                        <TableRow key={index}>
                                            <TableCell className='DC-contents-table-header'>{varname}</TableCell>
                                            <TableCell>{var_des ? var_des[varname] : 'No description available'}</TableCell>
                                        </TableRow>
                                    );
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </Paper>

    )
}