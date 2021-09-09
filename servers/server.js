const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { PythonShell } = require("python-shell");
const port = process.env.PORT || 3000;
const cors = require('cors');
const logger = require('morgan');

app.use(cors());

app.use(bodyParser.json());
app.use(logger('dev'));

app.get('/test',(req, res) =>{
    res.send('OK')
});

//https://github.com/extrabacon/python-shell
app.post('/api/python', (req, res)=> {

    const time = parseInt(req.body.time)*1000;
    const username = req.body.username
    const auth = req.body.auth; 
    const document1 = req.body.vaccination1
    const document2 = req.body.vaccination2
    const document3 = req.body.vaccination3
    const document4 = req.body.vaccination4

    if(username == ""){
        res.json({'result' : 'NameError'}).end();
    }
    if(auth == "gov"){   
        if(username == "" || document1.length != 4 || document2.length != 4 || document3.length != 4 || document4.length != 4){
            res.json({'result' : 'BlankError'}).end();
        }
    }else if(auth == "kdca"){
        if(username == "" || document1.length != 6 || document2.length != 6 || document3.length != 5){
            res.json({'result' : 'BlankError'}).end();
        }
    }

    let options = {
        mode: 'text',
        pythonPath: 'C:/Users/mbm/Anaconda3/envs/cert/python.exe', // Python의 경로를 나타낸다
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: './servers/python/',
        args:[username,document1,document2,document3,document4]
        };

    var checkVaccine = new PythonShell('main.py',options);

    checkVaccine.on('message',(result) => {
        console.log(result)
        if(result == "True"){
            res.json({'result' : 'Complete'}).end();
        }else if(result =="False"){
            res.json({'result' : 'Error'}).end();
        }else if(result =="NotFoundDocument"){
            res.json({'result' : 'NotFoundDocument'}).end();
        }
    });

    let pythonKiller = setTimeout(() => {
        checkVaccine.childProcess.kill();
        res.json({'result' : 'TimeOutError'}).end();
    }, time);
    
    checkVaccine.end((err,code,signal) => {
        clearTimeout(pythonKiller);
    }); 


});

app.listen(port, ()=>{
    console.log(`express is running on ${port}`);
})