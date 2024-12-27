const express = require('express');
const app = express();
const fs = require('fs');
const util = require('util');
const path = require('path');
const yaml = require('js-yaml');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

const data_path = path.join(__dirname, '../vdatas');

const loadYaml = (filePath) =>{
    try {
        return yaml.load(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        console.log(e);
    }
}

/*-------------------- API -------------------*/
app.listen(3001, () => {
    console.log('Server is running at 3001');
});

app.get('/mapList',async (req,res)=>{
    /**
     * API to get the list of maps
     * @returns {Array} List of maps
     */
    // get map list
    const mapDirectory = path.join(data_path ,'/map/crop');
    const mapFiles = await readdir(mapDirectory);

    // Read and parse JSON files asynchronously
    const mapJson = await Promise.all(
        mapFiles
            .filter((map) => map.endsWith('.json'))
            .map(async (map) => {
            const mapPath = path.join(mapDirectory, map);
            const jsonContent = await readFile(mapPath, 'utf8');
            return JSON.parse(jsonContent);
            })
        );

    res.json({ result: mapJson });
})

app.get('/modelList/:data',async (req,res)=>{
    /**
     * API to get the list of models
     * @returns {Array} List of models
     */
    // get model list
    // const target_data = req.params.data === 'model'? 'NMOD': req.params.data === 'ai'? 'AI': 'OBS';
    const target_data = req.params.data;
    const modelDirectory = path.join(data_path, target_data);
    const modelFiles = (await readdir(modelDirectory)).filter((model) => !model.startsWith('.'));

    res.json({ result: modelFiles });
});

app.get('/tiff/:data/:date/:time/:var/:layer', (req,res)=>{
    /**
     * API to get the tiff file
     * data : model
     * date : date (YYYYMMDD)
     * time : time (HH)
     * var : variable
     * layer : layer
     * @returns {Array} Tiff file
     */
    const dataInfo = getDataInfo()[req.params.data];
    const targetVar = dataInfo['vect'].includes(req.params.var)? `${req.params.var}_cur`: req.params.var;
    const layer = req.params.layer;
    const date = req.params.date;
    const dateY = date.slice(0,4);
    const time = dataInfo['tunit'].includes('d')? '00': req.params.time;

    const filePath = path.join(dataInfo['save'],targetVar,layer,dateY,`${date}${time}.tif`);

    if(!fs.existsSync(filePath)){
        res.status(404).send('File not found');
        return;
    }

    res.sendFile(filePath);
});

app.get('/percentile/:data/:date/:time/:var/:layer', (req,res)=>{
    /**
     * API to get the percentile tiff file
     * data : model
     * date : date (YYYYMMDD)
     * time : time (HH)
     * var : variable
     * layer : layer
     * @returns {Array} Percentile tiff file
     */
    const dataInfo = getDataInfo()[req.params.data];
    const targetVar = dataInfo['vect'].includes(req.params.var)? `${req.params.var}_cur`: req.params.var;
    const layer = req.params.layer;
    const date = req.params.date;
    const dateY = date.slice(0,4);
    const time = dataInfo['tunit'].includes('d')? '00': req.params.time;

    const filePath = path.join(dataInfo['save'],targetVar,layer,dateY,`${date}${time}.json`);

    if(!fs.existsSync(filePath)){
        res.json({error: true, message: '데이터가 존재하지 않습니다.'});
        return;
    }

    const jsonContent = fs.readFileSync(filePath, 'utf8');
    res.json(JSON.parse(jsonContent));
});


const getDataInfo = () => {
    const dataInfo = loadYaml(path.join(data_path, 'vdata_src/libs', 'modelinfo.yml'));
    return dataInfo;
}
app.get('/datainfo', (req,res)=>{
    /**
     * API to get the data information
     * @returns {Array} Data information
     */
    const dataInfo = getDataInfo();
    res.json(dataInfo);
})
