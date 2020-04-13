const nodemailer = require("nodemailer");
var fs = require('fs');

// function sendEmail(recipientEmail,subject,body, filename, path) {
//
//     return new Promise( (resolve,reject) => {
//
//         let mailer_transportConfig = {
//             host: "mail.service-it.by", // почтовый сервер
//             port: 587, // порт
//             secure: false,
//             auth: {
//                 user: "dmitriy.zabavskiy@service-it.by", // логин-пароль к почтовому ящику, откуда идёт отправка
//                 pass: "11111111cC"
//             }
//         };
//
//         let transporter = nodemailer.createTransport(mailer_transportConfig);
//
//         let text=body;
//         let html=undefined;
//         let textWOTags=removeTags(text);
//         if ( textWOTags!==text ) { // если теги есть - отправляем две разных версии письма, HTML и текстовую; если тегов нет - только текстовую
//             text=textWOTags;
//             html=body;
//         }
//
//         let message = {
//             from: 'dmitriy.zabavskiy@service-it.by', // с какого ящика идёт отправка (емейл отправителя), может не совпадать с mailer_transportConfig.auth
//             to: recipientEmail,
//             subject: subject,
//             text: text, // текстовая версия письма
//             html: html, // HTML-версия письма
//             attachments: [
//                 {
//                     filename: 'example1.docx',
//                     content: fs.createReadStream('../doc/example1.docx'),
//                 },
//                 {
//                     filename: filename || 'alesya.png',
//                     // path: "../img/",
//                     cid: 'qwerty@qwerty@qwerty',
//                     content: fs.createReadStream(path ||'../img/alesya.png'),
//                 },
//                 {
//                     filename: filename || 'alesya.png',
//                     // path: "../img/",
//                     cid: 'zzzzzzzzzzzzzzzzzzzzzzzzz',
//                     content: fs.createReadStream(path ||'../img/alesya.png'),
//                 },
//             ]
//         };
//
//         console.log('message: ', message);
//
//         transporter.sendMail(message, (err,info) => {
//             if ( err ) {
//                 console.error("sendEmail - error",err);
//                 reject(err);
//             }
//             else {
//                 resolve(info);
//             }
//         } );
//
//     } );
//
// }
//
// var htmlCode = '<div>' +
//                     '<table>' +
//                         '<tr>' +
//                             '<td><img src="cid:qwerty@qwerty@qwerty" /></td>' +
//                             '<td style="vertical-align: top; padding-top: 10px; width: 100%; text-align: center; font-size: 40px; font-weight: bold">ЗАГОЛОВОК</td>' +
//                         '</tr>' +
//                         '<tr>' +
//                             '<td><img src="cid:zzzzzzzzzzzzzzzzzzzzzzzzz" /></td>' +
//                             '<td style="vertical-align: top; padding-top: 10px; width: 100%; text-align: center; font-size: 40px; font-weight: bold">ЗАГОЛОВОК 2</td>' +
//                         '</tr>' +
//                     '</table>' +
//                     '<div style="margin-top: 20px; background-color: beige; text-align: justify">' +
//                         'Очень много текста Очень много текста Очень много текста Очень много текста <br/>' +
//                         'Очень много текста Очень много текста Очень много текста Очень много текста <br/>' +
//                         'Очень много текста Очень много текста Очень много текста Очень много текста <br/>' +
//                         'Очень много текста Очень много текста Очень много текста Очень много текста <br/>' +
//                         'Очень много текста Очень много текста Очень много текста Очень много текста <br/>' +
//                     '</div>' +
//                 '</div>';

// sendEmail('dmitriy.zabavskiy@service-it.by','тестовое письмо',htmlCode)
//     .then( () => { console.log("Письмо отправлено!"); } )
//     .catch( err => { console.error(err); } )
// ;



// удаляет из строки все теги
function removeTags(str,replaceStr="") {
    let dividerRES="[ \n\r]";
    let tagNameRES="[a-zA-Z0-9]+";
    let attrNameRES="[a-zA-Z]+";
    let attrValueRES="(?:\".+?\"|'.+?'|[^ >]+)";
    let attrRES="("+attrNameRES+")(?:"+dividerRES+"*="+dividerRES+"*("+attrValueRES+"))?";
    let openingTagRES="<("+tagNameRES+")((?:"+dividerRES+"+"+attrRES+")*)"+dividerRES+"*/?>"; // включает и самозакрытый вариант
    let closingTagRES="</("+tagNameRES+")"+dividerRES+"*>";

    let openingTagRE=new RegExp(openingTagRES,"g");
    let closingTagRE=new RegExp(closingTagRES,"g");

    if ( typeof(str)=="string" && str.indexOf("<")!=-1 ) {
        str=str.replace(openingTagRE,replaceStr);
        str=str.replace(closingTagRE,replaceStr);
    }
    return str;
}



function sendEmail2(identification,theme,body, attachments) {

    return new Promise( (resolve,reject) => {
        let mailer_transportConfig = {
            host: "mail.service-it.by", // почтовый сервер
            port: 587, // порт
            secure: false,
            auth: {
                user: identification.ident.name, // логин-пароль к почтовому ящику, откуда идёт отправка
                pass: identification.ident.pass
            }
        };
        let transporter = nodemailer.createTransport(mailer_transportConfig);

        let text=body;
        let html=undefined;
        let textWOTags=removeTags(text);
        if ( textWOTags!==text ) { // если теги есть - отправляем две разных версии письма, HTML и текстовую; если тегов нет - только текстовую
            text=textWOTags;
            html=body;
        }

        let message = {
            from: identification.sender, // с какого ящика идёт отправка (емейл отправителя), может не совпадать с mailer_transportConfig.auth
            // from: "dmitriy.zabavskiy@service-it.by", // с какого ящика идёт отправка (емейл отправителя), может не совпадать с mailer_transportConfig.auth
            to: identification.receiver,
            // to: "dmitriy.zabavskiy@service-it.by",
            subject: theme,
            text: text, // текстовая версия письма
            html: html, // HTML-версия письма
            attachments
        };

        transporter.sendMail(message, (err,info) => {
            if ( err ) {
                console.error("sendEmail2 - error",err);
                reject(err);
            }
            else {
                resolve(info);
            }
        } );

    } );

}

async function deleteFiles(files) {
    for (let i = 0; i < files.length; i++) {
        await fs.unlink(files[i], (err) => {
            if (err) console.log(err); // если возникла ошибка
        });
    }
}



module.exports = {
    /*htmlCode, sendEmail,*/sendEmail2, deleteFiles
}