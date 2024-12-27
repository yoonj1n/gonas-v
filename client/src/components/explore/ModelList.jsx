import '../css/ModelList.css';
import { Card, CardContent, CardMedia, CardActionArea, Paper} from '@mui/material';

export default function ModelList({modelList, selectedModel, setIsDescription, setSelectedData, dataInfo}){

    const modelNameForm = (model) => {
        return model.toUpperCase().replace('_',' ').replace('RE','Reanalysis').replace('FC','Forecast');
    }

    return(
        <Paper className='ML-contents-datalist' elevation={3}>
        {
            modelList.length > 0 && modelList[selectedModel].data.map((model, index) => (
                <Card 
                    key={index} 
                    className='ML-contents-card'
                    onClick={()=>{setIsDescription(true); setSelectedData(model);}}    
                >
                    <CardActionArea>
                        <CardMedia
                            component='img'
                            image={`/signview/${model}.png`}
                            height='150rem'
                        />
                        <CardContent>
                            <p className='ML-contents-card-title'>{modelNameForm(model)}</p>
                            <p className='ML-contents-card-description'>{dataInfo[model]?.description}</p>
                        </CardContent>
                    </CardActionArea>
                </Card>
            ))
        }
    </Paper>

    )
}