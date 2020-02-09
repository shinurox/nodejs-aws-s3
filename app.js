const express = require('express');
const bodyParser = require('body-parser');
const multiparty = require('multiparty');
const services = require('./services');
const port = 9999;

/* Initialize express module. */
const app = express();

/* Initialize body parser */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Public directory */
app.use(express.static(__dirname + '/views'));

/* Routes */
app.post('/createObject', function(req, res) {
    const form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        filePath = files.dataFile ? files.dataFile[0].path : '';
        services.createObject(filePath);
    });
    res.send('');
});

app.get('/getObjects', async function(req, res) {
    const objects = await services.listAllObjects();
    res.json(objects);
});

app.post('/deleteObject', function(req, res) {
    const key = req.body.key;
    services.deleteSingleObject(key);
    res.send('');
});

app.post('/deleteAllObject', function(req, res) {
    const keys = req.body.keys;
    services.deleteMultipleObjects(keys);
    res.send('');
});

app.listen(port);
console.log(`Server running at http://127.0.0.1:${port}/`);
