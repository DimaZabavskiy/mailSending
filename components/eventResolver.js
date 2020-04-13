'use strict';

let newFiles = '';  //  скачанный файл при workMode === 1
let theme = '';    // тема письма
let textHeader = '';    // заголовок письма
let maintext = '';    // основной текст письма
let sign = '';    // подпись письма
let newPersText = '';   //  текст сверху в блоке с новыми сотрудниками
let newPersDescr = [];   //  массив с описанием новых сотрудников
let workMode = 0;   //  тип письма
let imgs = [];  //  массив, в который будут складываться данные изображений (название, путь, cid) для отправки письма
let addFiles = [];  //  массив, в который будут складываться вложенные вайлы
let imgFlag = ['news.png', 'holiday.png', 'newPerson.png'];   //  вид флага (на письме вверху справа): новость, праздник, пополнение

// function showMessageExample() {
//     fetch('/send/')
//         .then(response => response.text() )
//         .then(text => console.log('received answer: ', text) )
//         .catch(error => console.error('sendMessage error: ', error) )
// }

let loadFile = function(event, block) {
    let imgBlock = document.getElementById(block);
    const imgSrc = URL.createObjectURL(event.target.files[0]);
    if (workMode === 2) {
        newPersDescr[choosenArrayId].imgSrc = imgSrc;
        choosenArrayId = null;
    }
    imgBlock.src = imgSrc;
};

function setWorkMode (num) {
    if (num === workMode) return;
    workMode = num;
    const workMode01 = document.getElementById('workMode01');
    const workMode1 = document.getElementById('workMode1');
    const workMode2 = document.getElementById('workMode2');

    const preMainImgBlock = document.getElementById('preMainImgBlock');
    const preMainText = document.getElementById('preMainText');
    const preNewPersons = document.getElementById('preNewPersons');
    const preNewPersText = document.getElementById('preNewPersText');
    switch (workMode) {
        case 0:
            workMode01.style.display = 'block';
            workMode1.style.display = 'none';
            workMode2.style.display = 'none';
            preNewPersons.style.display = 'none';
            preNewPersText.style.display = 'none';
            preMainImgBlock.style.display = 'none';
            preMainText.style.display = 'block';
            break;
        case 1:
            workMode01.style.display = 'block';
            workMode1.style.display = 'block';
            workMode2.style.display = 'none';
            preNewPersons.style.display = 'none';
            preNewPersText.style.display = 'none';
            preMainImgBlock.style.display = 'block';
            preMainText.style.display = 'block';
            break;
        case 2:
            workMode01.style.display = 'none';
            workMode2.style.display = 'block';
            preNewPersons.style.display = 'block';
            preNewPersText.style.display = 'block';
            preMainImgBlock.style.display = 'none';
            preMainText.style.display = 'none';
            if (!newPersDescr.length) addNewPerson();
            break;
    }
    let preHeaderImg = document.getElementById('preHeaderImg');
    preHeaderImg.setAttribute('src', 'components/' + imgFlag[num]);
    setActiveWorkModeStyle();
}

function setActiveWorkModeStyle(){
    let allWorkModes = document.getElementsByClassName('workModeItems');
    for (let i = 0; i < allWorkModes.length; i++) {
        if (i === workMode) allWorkModes[i].className = 'workModeItems chosenWorkMode';
        else allWorkModes[i].className = 'workModeItems';
    }
}

function addNewPerson() {
    const newId = newPersDescr.length;
    const workMode2 = document.getElementById('workMode2');
    const addNewPerson = document.getElementById('addNewPerson');
    let commonDiv = document.createElement('div');
    commonDiv.setAttribute('id', 'commonDiv' + newId);
    let uploadDiv = document.createElement('div');
    uploadDiv.innerHTML = `
        <div style="display: flex; align-items: center">
            <div class="label">Редактировать фото:</div>
            <svg style="margin-left: 16px; cursor: pointer"  width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" onclick="clickUlpoadFile(${newId})">
                <rect x="0.5" y="0.5" width="31" height="31" rx="3.5" stroke="#CED4D8"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M17.5057 10.5437L18.9512 11.947L12.5423 18.3628C12.2207 18.6863 12.2207 19.2071 12.5423 19.5307C12.8475 19.8378 13.3573 19.8364 13.6592 19.529L20.7103 12.4674C21.7397 11.4318 21.7397 9.76857 20.7103 8.73294C19.7282 7.74484 17.9904 7.76682 17.0279 8.73482L9.33168 16.437C7.59409 18.1844 7.59409 20.9904 9.33168 22.7378C11.019 24.4346 13.9175 24.407 15.5784 22.7362L24.5544 13.749L26 15.1522L17.0256 24.1378C14.5771 26.6008 10.3719 26.6409 7.88297 24.1379C5.37205 21.6127 5.37205 17.562 7.8847 15.0352L15.5809 7.33301C17.3291 5.57494 20.3735 5.53644 22.1593 7.33316C23.9617 9.14642 23.9617 12.0539 22.1577 13.8688L15.1108 20.9262C14.0207 22.0361 12.197 22.0411 11.0932 20.9304C9.99882 19.8292 9.99882 18.0643 11.095 16.9612L17.5057 10.5437Z" fill="#0C273E" fill-opacity="0.5"/>
            </svg>
        </div>
    `;

    let nameInput = createInput('newPersName', newId, 'name', 'ФИО');
    let statusInput = createInput('newPersStatus', newId, 'status', 'Должность');

    let commonDescrDiv = document.createElement('div');
    let textDescrDiv = document.createElement('div');
    textDescrDiv.innerText = 'Описание';
    textDescrDiv.className = 'label';
    let descrArea = document.createElement('textarea');
    descrArea.setAttribute('id', 'newPersDescr' + newId);
    descrArea.className = 'newPersDescr';
    descrArea.onblur = ()=> setNewPersDescr('newPersDescr' + newId, newId, 'descr');
    commonDescrDiv.appendChild(textDescrDiv);
    commonDescrDiv.appendChild(descrArea);

    commonDiv.appendChild(nameInput);
    commonDiv.appendChild(statusInput);
    commonDiv.appendChild(uploadDiv);
    commonDiv.appendChild(commonDescrDiv);

    if (newPersDescr.length) {
        let deleteDiv = document.createElement('div');
        deleteDiv.innerText = "Удалить блок";
        deleteDiv.className = 'deleteNewPers';
        deleteDiv.onclick = ()=>deleteNewPerson(newId,'commonDiv' + newId);
        commonDiv.appendChild(deleteDiv);
    };

    workMode2.insertBefore(commonDiv, addNewPerson);

    newPersDescr.push({
        img: '',
        descr: '',
        name: '',
        status: ''
    });
    createPreNewPersonBlock();
}

function createPreNewPersonBlock() {
    let content = '';
    newPersDescr.forEach( (item, idx) => {
        if (item !== null) {
            content += `
                    <div style="margin-top: 30px;">
                        <div style="width: 150px; float: left; margin-right: 20px">
                            <img id=${'preNewPersonImg' + idx} style="width: 100%; border-radius: 4px;" src="${item.imgSrc || ''}">
                        </div>
                        <div>
                            <div style="font-family: sans-serif; font-size: 16px; line-height: 28px; color: #000000;">${item.name}</div>
                            <div style="margin: 4px 0 24px; font-family: sans-serif; font-size: 14px; line-height: 20px; color: rgba(0,0,0,0.4);">${item.status}</div>
                            <div style="font-family: sans-serif; font-size: 16px; line-height: 24px; color: #595858;">${item.descr}</div>
                        </div>
                    </div>
                `;
        }
    });
    let preNewPersons = document.getElementById('preNewPersons');
    preNewPersons.innerHTML = content;
}

function createInput (uniId,id,type, text) {
    let commonDiv = document.createElement('div');
    let textDiv = document.createElement('div');
    textDiv.innerText = text;
    textDiv.className = 'label';
    let newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.id = (uniId + id);
    newInput.className = 'input';
    newInput.onblur = ()=> setNewPersDescr(uniId + id, id, type);
    commonDiv.appendChild(textDiv);
    commonDiv.appendChild(newInput);
    return commonDiv;
}

let choosenArrayId = null;
let choosenArrayIdImg = null;
function clickUlpoadFile (id) {
    choosenArrayId = id;
    choosenArrayIdImg = 'preNewPersonImg' + id;
    document.getElementById('supportUpload').click();
}

let isSupportFile = false;
function addSupportFiles () {
    isSupportFile = true;
    document.getElementById('supportUpload').click();
}

async function uploadFiles(event, block) {
    const uploadElem=document.getElementById("supportUpload");
    uploadElem.style.disabled="disabled";

    let formData=new FormData();
    formData.append("uploadfile",uploadElem.files[0]);

    try {
        const fetchOptions = {
            method: "post",
            body: formData,
        };
        let sendFileFetch = await fetch('/upload-file', fetchOptions);
        let sendFile = await sendFileFetch.text();
        if (!isSupportFile) {
            if (workMode === 1) newFiles = sendFile;
            else if (workMode === 2) {
                newPersDescr[choosenArrayId].img = sendFile;
                block = choosenArrayIdImg;
                choosenArrayIdImg = null
            }
            loadFile(event, block);
        } else {
            addFiles.push(sendFile);
            createAddFilesInfo();
            isSupportFile = false;
        }
    }
    catch ( er ) {
        showErrorBlock(er);
        alert("ошибка загрузки файла на сервер!\n"+er);
    }

    uploadElem.style.disabled="";
}

function createAddFilesInfo() {
    const newId = addFiles.length - 1;
    const newIdName = 'addedFile' + newId;
    let divAddedFile = document.createElement('div');
    divAddedFile.id= newIdName;
    divAddedFile.innerHTML = `${addFiles[newId]} <span class="deleteAddedFile" onclick=deleteAddedFile(${newId},${newIdName})>Удалить</span>`;
    let addedFiles = document.getElementById('addedFiles');
    addedFiles.appendChild(divAddedFile)
}

function deleteAddedFile(id, block) {
    addFiles[id] = null;
    let addedFiles = document.getElementById('addedFiles');
    addedFiles.removeChild(block);
}

function lineBreaking(text) {
    return text.split('###').join("<br/><br/>").split('@@@').join("<br/>")
}

function setHeader() {
    const value = lineBreaking(document.getElementById('header').value);
    textHeader = value;
    document.getElementById('preTextHeader').innerHTML = value;
}

function setTheme() {
    theme = lineBreaking(document.getElementById('theme').value);
}
function setSign() {
    const value = lineBreaking(document.getElementById('sign').value);
    sign = value;
    document.getElementById('preFooterHTML').innerHTML = value;
}

function setMainText() {
    const value = lineBreaking(document.getElementById('maintext').value);
    maintext = value;
    document.getElementById('preMainText').innerHTML = value;
}

function setNewPersText() {
    const value = lineBreaking(document.getElementById('newPersText').value);
    newPersText = value;
    document.getElementById('preNewPersText').innerHTML = value;
}

function setNewPersDescr(uniId, id, type) {
    newPersDescr[id][type] = lineBreaking(document.getElementById(uniId).value);
    createPreNewPersonBlock();
}

function deleteNewPerson(id, block) {
    newPersDescr[id] = null;
    const workMode2 = document.getElementById('workMode2');
    let deleteBlock = document.getElementById(block);
    workMode2.removeChild(deleteBlock);
    createPreNewPersonBlock();
}

// function qqqq(type) {
//     let area = document.getElementById('content');
//     let {anchorNode, anchorOffset, focusNode, focusOffset} = document.getSelection();
//     let aaa = document.getSelection().toString();
//     // console.log('aaa: ', aaa);
//     // console.log('anchorNode: ', anchorNode);
//     // console.log('anchorOffset: ', anchorOffset);
//     // console.log('focusNode: ', focusNode);
//     // console.log('focusOffset: ', focusOffset);
//     // console.log('focusOffset: ', focusOffset);
//     let newStr = anchorNode.data.slice(0, anchorOffset < focusOffset ? anchorOffset : focusOffset) + "<strong>" +
//         "" + aaa + "</strong>" + anchorNode.data.slice(anchorOffset < focusOffset ? focusOffset : anchorOffset);
//     newStr = area.innerHTML.replace(anchorNode.data, newStr);
//     area.innerHTML = newStr;
// }

/*b[0].onclick = function() { c.innerText = '<font color=red>Font</font>'; }
b[1].onclick = function() {
    c.innerHTML = c.innerText;
};
b[2].onclick = function() { c.innerText = c.innerHTML; }
document.getElementById('button').onclick = () => {
    let input = document.getElementById('input');
    if (input.selectionStart == input.selectionEnd) {
        return; // ничего не выделено
    }

    let selected = input.value.slice(input.selectionStart, input.selectionEnd);
    input.setRangeText(`*${selected}*`);
};*/

function createHTML () {
    const headerHTML = createHeaderHTML();
    const mainContent = createMainContentHTML();
    const footerHTML = createFooterHTML();

    const text = (
        "<div style='background-color: #F1F1F1; padding: 20px'>" +
            "<div style='background-color: #fff; max-width: 800px; margin: auto; position: relative'>" +
                headerHTML +
                "<div style='padding: 0 40px'>" +
                    "<div style='color: #3A3A3A; font-size: 30px; line-height: 40px; font-family: sans-serif; margin-top: 26px; margin-bottom: 30px'>" + textHeader + "</div>" +
                    mainContent +
                    footerHTML +
        "</div></div></div>"
    );

    addFiles.forEach( item => {
        if (item) {
            imgs.push(
                {
                    dir: './uploads/',
                    imgNames: item
                }
            );
        }
    });
    addFiles = [];
    return {text, imgs, theme};
}

function createHeaderHTML () {
    const flagCid = imgFlag[workMode] + Math.random();
    const logoCid = 'logo.png' + Math.random();
    const cornerCid = 'rightCorner.png' + Math.random();

    imgs.push({
        cid: flagCid,
        dir: './',
        imgNames: imgFlag[workMode],
    });
    imgs.push({
        cid: cornerCid,
        dir: './',
        imgNames: 'rightCorner.png',
    });
    imgs.push({
        cid: logoCid,
        dir: './',
        imgNames: 'logo.png',
    });
    return (
        "<table style='width: 100%; border-collapse: collapse'>" +
            "<tr style='vertical-align: top'>" +
                "<td style='width: 23px; padding: 0'><img style='margin-left: 40px' src='cid:" + flagCid + "'/></td>" +
                "<td style='text-align: center; padding: 0'><img style='width: 134px; margin-top: 29px' src='cid:" + logoCid + "'/></td>" +
                "<td style='width: 50px; padding: 0'><div style='box-shadow: -18px 18px 16px rgba(0,0,0,0.03)'><img src='cid:" + cornerCid + "'/></div></td>" +
            '</tr>' +
        '</table>'
    );
}

function createMainContentHTML () {
    let content = '';
    switch (workMode) {
        case 1:
            content += "<div style='width: 100%; margin-bottom: 30px; text-align: center'>";
            let cid = newFiles + Math.random();
            content +="<img style='max-width: 100%' src=\"cid:" + cid +"\" />";
            imgs.push(
                {
                    cid,
                    dir: './uploads/',
                    imgNames: newFiles
                }
            );
            content += "</div>";
        case 0:
            content += "<div style='color: #595858; font-size: 16px; line-height: 28px; font-family: sans-serif; text-align: justify'>" + maintext + "</div>";
            break;
        case 2:
            content += `<div style="font-family: sans-serif; font-size: 16px; line-height: 28px; color: #595858;">${newPersText}</div>
                        <div>`;
            newPersDescr.forEach( item => {
                if (item !== null) {
                    let cid = item.img + Math.random();
                    content += `
                    <div style="margin-top: 30px;">
                        <div style="width: 150px; float: left; margin-right: 20px">
                            <img style="width: 100%; border-radius: 4px;" src="cid:${cid}">
                        </div>
                        <div>
                            <div style="font-family: sans-serif; font-size: 16px; line-height: 28px; color: #000000;">${item.name}</div>
                            <div style="margin: 4px 0 24px; font-family: sans-serif; font-size: 14px; line-height: 20px; color: rgba(0,0,0,0.4);">${item.status}</div>
                            <div style="font-family: sans-serif; font-size: 16px; line-height: 24px; color: #595858;">${item.descr}</div>
                        </div>
                    </div>
                `;

                    imgs.push(
                        {
                            cid,
                            dir: './uploads/',
                            imgNames: item.img
                        }
                    );
                }
            });

            content += "</div>";
            break;
    }
    return content;
}

function createFooterHTML () {
    return (`
        <div style='height: 1px; background: #DDE9ED; width: 100%; margin: 55px auto 21px'></div>
        <div style='padding-bottom: 20px; text-align: justify; color: #595858; font-family: sans-serif; font-size: 14px; line-height: 20px'>${sign}</div>
    `)
}



async function sendLetter() {
    if (!checkIdentification()) return;
    let data = createHTML();
    data.identification = addIdentificationValues();
    const fetchOptions={
        method: "post",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };
    try {
        const response=await fetch('/letterSending',fetchOptions);
        const answer = await response.json();
        if (!answer.errorCode) showSuccessBlock();
        else showErrorBlock(answer.errorMessage)
        imgs = [];
    } catch (e) {
        showErrorBlock(e);
    }
}

function showSuccessBlock() {
    document.getElementById('letterForm').style.display = 'none';
    document.getElementById('senderReceiverBlock').style.display = 'none';
    document.getElementById('errorBlock').style.display = 'none';
    document.getElementById('resultBlock').style.display = 'block';
}

function reSending() {
    document.getElementById('senderReceiverBlock').style.display = 'block';
    document.getElementById('resultBlock').style.display = 'none';
}
function showErrorBlock(error) {
    document.getElementById('letterForm').style.display = 'none';
    document.getElementById('senderReceiverBlock').style.display = 'none';
    document.getElementById('resultBlock').style.display = 'none';

    let errorBlock = document.getElementById('errorBlock');
    errorBlock.style.display = 'block';
    errorBlock.innerHTML = `<div class="label">${error}<br/>Попробуйте сделать все заново</div>`
}

function getSender() {
    return localStorage.sender ?
        `<div class="label"><i>Отправитель</i><br/>${localStorage.sender} <span class="deleteAddedFile" onclick="deleteIdentification('sender')">Удалить</span></div>` :
        `<input style="margin-top: 8px"  class="input" type="text" id="senderName" placeholder="Отправитель">
        <span class="rememberInfo" onclick="setIdentification('sender')">Запомнить</span>`;
}
function getReceiver() {
    return localStorage.receiver ?
        `<div class="label"><i>Получатель</i><br/>${localStorage.receiver} <span class="deleteAddedFile" onclick="deleteIdentification('receiver')">Удалить</span></div>` :
        `<input style="margin-top: 8px"  class="input" type="text" id="receiverName" placeholder="Получатель">
        <span class="rememberInfo" onclick="setIdentification('receiver')">Запомнить</span>`;
}
function getIdentification() {
    return localStorage.identification ?
        `<div class="label">${JSON.parse(localStorage.identification).name}</div>
        <div class="label">${JSON.parse(localStorage.identification).pass}</div>
         <span class="deleteAddedFile" onclick="deleteIdentification('identification')">Удалить</span>` :
        `<input style="margin-top: 16px" class="input" type="text" id="identificationName" placeholder="Почтовый ящик отправителя">
        <input style="margin-top: 8px"  class="input" type="text" id="identificationPass" placeholder="Пароль">
        <span class="rememberInfo" onclick="setIdentification('identification')">Запомнить</span>`;
}

function addSenderReceiver() {
    document.getElementById('letterForm').style.display = 'none';

    document.getElementById('senderBlock').innerHTML = getSender();
    document.getElementById('receiverBlock').innerHTML = getReceiver();
    document.getElementById('identificationBlock').innerHTML = getIdentification();

    document.getElementById('senderReceiverBlock').style.display = 'block';
}

function setIdentification(type) {
    switch (type) {
        case 'sender':
            localStorage['sender'] = document.getElementById('senderName').value;
            document.getElementById('senderBlock').innerHTML = getSender();
            break;
        case 'receiver':
            localStorage['receiver'] = document.getElementById('receiverName').value;
            document.getElementById('receiverBlock').innerHTML = getReceiver();
            break;
        case 'identification':
            localStorage['identification'] = JSON.stringify({
                name: document.getElementById('identificationName').value,
                pass: document.getElementById('identificationPass').value
            });
            document.getElementById('identificationBlock').innerHTML = getIdentification();
            break;
    }
}

function deleteIdentification(type) {
    localStorage.removeItem(type);
    switch (type) {
        case 'sender':
            document.getElementById('senderBlock').innerHTML = getSender();
            break;
        case 'receiver':
            document.getElementById('receiverBlock').innerHTML = getReceiver();
            break;
        case 'identification':
            document.getElementById('identificationBlock').innerHTML = getIdentification();
            break;
    }
}

function checkIdentification() {
    if(!localStorage['sender'] && !document.getElementById('senderName').value) {
        alert('Поле "Отправитель" не заполнено');
        return false;
    }
    if(!localStorage['receiver'] && !document.getElementById('receiverName').value) {
        alert('Поле "Получатель" не заполнено');
        return false;
    }
    if(!localStorage['identification'] && !document.getElementById('identificationName').value) {
        alert('Поле "Почтовый ящик отправителя" не заполнено');
        return false;
    }
    if(!localStorage['identification'] && !document.getElementById('identificationPass').value) {
        alert('Поле "Пароль" не заполнено');
        return false;
    }
    return true;
}

function addIdentificationValues() {
    let result = {};
    result.sender = localStorage['sender'] || document.getElementById('senderName').value;
    result.receiver = localStorage['receiver'] || document.getElementById('receiverName').value;
    result.ident = localStorage['identification'] || {
        name: document.getElementById('identificationName').value,
        pass: document.getElementById('identificationPass').value
    };
    return result;
}