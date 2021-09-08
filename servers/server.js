const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { PythonShell } = require("python-shell");
const port = process.env.PORT || 3000;
const cors = require('cors');
const logger = require('morgan');

const corsOptions = {
  origin: ["https://vouchercorp.com","https://m.vouchercorp.com"],
  credentials: true
}
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(logger('dev'));

app.get('/test',(req, res) =>{
    res.send('OK')
});

//https://github.com/extrabacon/python-shell
app.post('/api/python', (req, res)=> {

    console.log(req.body)
    const time = parseInt(req.body.time)*1000;
    const username = req.body.username
    const auth = req.body.auth; 
    const document1 = req.body.vaccination1
    const document2 = req.body.vaccination2
    const document3 = req.body.vaccination3
    const document4 = req.body.vaccination4

    

