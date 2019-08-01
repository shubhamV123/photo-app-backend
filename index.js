const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const cloudinary = require('./config/cloudinary');


//Middlewares
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());

const port = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('Hello World!'))


//Code
app.post('/upload', function (req, res) {
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }
    let getFileFromClient = req.files.file;
    let fileName = req.files.file.name;
    //Move file and upload it to cloudinary
    getFileFromClient.mv(__dirname + '/images/' + fileName, function (err) {
        if (err)
            return res.status(500).send(err);

        cloudinary.uploader.upload(__dirname + '/images/' + fileName, function (err, result) {
            if (err) {
                return res.status(500).send(err);
            }
            let { width, height, url } = result;
            res.json({
                width, height, url
            });
        });
    });

});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))