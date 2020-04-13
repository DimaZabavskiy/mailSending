const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var fs = require('fs');

const multer = require('multer'); // для обработки тел запроса в формате multipart/form-data
const progress = require('progress-stream'); // для отслеживания прогресса приёма файла (вариант №1)

let {htmlCode, sendEmail, sendEmail2, deleteFiles} = require('./sendEmail');


const webserver = express(); // создаём веб-сервер

// миддлварь для работы с multipart/form-data; если потребуется сохранение загруженных файлов - то в папку uploads
const upload = multer( { dest: path.join(__dirname,"uploads") } );

const port = 8080;

// webserver.use(express.urlencoded({extended:true}));

webserver.use("/components", express.static(path.resolve(__dirname,"../components")));
webserver.use(express.json());
webserver.use(bodyParser.text());

//  загрузка файлов
const uploadFilesMulter = multer( { /*dest: "upload_temp",*/ storage: multer.diskStorage(getMulterStorageConfig_Files()) } );
const uploadFilesMW = uploadFilesMulter.fields( [ {name:'uploadfile', maxCount:1} ] );


webserver.options("/upload-file", function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-fp-sid");
    res.send("");
});
webserver.post("/upload-file", uploadFilesMW, async function (req, res) {
    try {
        res.setHeader("Access-Control-Allow-Origin","*");
        let fileInfo=req.files.uploadfile[0];
        res.send(fileInfo.originalname);
    }
    catch ( err ) {
        res.setHeader("Content-Type","application/json");
        res.send(JSON.stringify({err}));
    }
});

webserver.post('/letterSending', (req,res) => {
    let attachments = [];
    let uploadFiles = [];
    req.body.imgs.forEach( item => {
        let imgPath = path.resolve((__dirname, item.dir + item.imgNames));
        if (item.dir.indexOf('uploads') !== -1) uploadFiles.push(imgPath.split('\\').join('/'));
        attachments.push({
            filename: item.imgNames,
            cid: item.cid,
            content: fs.createReadStream(imgPath),
        })
    });

    sendEmail2(req.body.identification,req.body.theme, req.body.text, attachments)
        .then( () => {
            // deleteFiles(uploadFiles);
            res.send(JSON.stringify({
                errorCode: 0
            }));
        } )
        .catch( err => {
            console.error(err);
            res.send(JSON.stringify({
                errorCode: 1,
                errorMessage: err
            }));
        } )
    ;
});



webserver.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../index.html'));
});


// webserver.get('/send/', (req, res) => {
//     sendEmail('dmitriy.zabavskiy@service-it.by','тестовое письмо',htmlCode)
//         .then( () => {
//             console.log("Письмо отправлено!");
//             res.send("/send/ ok!");
//         } )
//         .catch( err => {
//             console.error(err);
//             res.send("error: " + err);
//         } )
//     ;
// });


// const service5file = upload.single('photo');
// webserver.post('/sendForm/', (req, res) => {
//     var fileProgress = progress();
//     const fileLength = +req.headers['content-length']; // берём длину всего тела запроса
//
//     req.pipe(fileProgress); // поток с телом запроса направляем в progress
//     fileProgress.headers = req.headers; // и ставим в progress те же заголовки что были у req
//
//     fileProgress.on('progress', info => {
//         console.log('loaded '+info.transferred+' bytes of '+fileLength);
//     });
//
//     service5file(fileProgress, res, async (err) => {
//         if (err) return res.status(500);
//
//         sendEmail('dmitriy.zabavskiy@service-it.by','тестовое письмо',htmlCode, fileProgress.file.filename, fileProgress.file.path)
//             .then( () => {
//                 console.log("Письмо отправлено!");
//                 res.send("/sendForm/ ok!");
//             } )
//             .catch( err => {
//                 console.error(err);
//                 res.send("error: " + err);
//             } )
//         ;
//
//     });
//
// });



function getMulterStorageConfig_Files() {
    return {
        destination: function (req, file, cb) {
            cb(null, 'uploads')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    };
}

webserver.listen(port,()=>{
    console.log("web server running " + new Date()+ " on port "+port);
});