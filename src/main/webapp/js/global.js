// Основной файл для всех html страниц.
// В основном содержит запросы к серверу и utility-функции.


// Адрес сервера
//const BACKEND_API_URL = 'http://localhost:8080/letters';
const BACKEND_API_URL = '/letters';

// Есть ли роль администратора у пользователя
let isAdmin = false;

let globalIsLoaded = false;
const callbacksQueue = [];

// массив входящих и исходящих писем
const inputLetters = [];
const outputLetters = [];

// Вызванные запросы на сервер до того, как html страница была полностью загружена
const beforeLoadRequests = Promise.all([getIsAdminRole()]).then(responses => {
    isAdmin = responses[0];
})

// Функция, которая вызывается после полной загрузки страницы
window.addEventListener("load",async () => {
    await beforeLoadRequests;

    document.querySelector(".header-navigation").replaceWith(getHeaderNavigationHTMLInstance(isAdmin));

    globalIsLoaded = true;
    callbacksQueue.forEach((callback) => {
        callback();
    })
});

function addCallbackToQueue(callback) {
    if (globalIsLoaded) {
        callback();
    }
    else {
        callbacksQueue.push(callback);
    }
}

async function findOriginsAndAddresses(withDisabled){
    let url = BACKEND_API_URL + '/api/originsAndAddresses';
    if (withDisabled && withDisabled === true) {
        url += "/withDisabled"
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Источники и адреса не были загружены с сервера");
    }

    const data = await response.json()
    return data.map(el => new OriginAndAddress(el));
}

function setOriginsAndAddressesOptions(selectHTML, originsAndAddresses, addDefaultOption) {
    selectHTML.innerHTML = "";

    if (addDefaultOption) {
        let first = document.createElement("option");
        first.value = "";
        first.disabled = true;
        first.selected = true;
        first.hidden = true;
        first.innerText = "Выберите вариант";
        selectHTML.appendChild(first);
    }

    originsAndAddresses.forEach(element => {
        const option = document.createElement("option");
        option.innerText = element.shortName
        option.value = element.id
        selectHTML.appendChild(option)
    })

    const option = document.createElement("option");
    option.innerText = "другое"
    option.value = "other"
    selectHTML.appendChild(option)

    selectHTML.onchange = () => {
        if (selectHTML.value === 'other') {
            selectHTML.options[0].selected = true;
            OriginAndAddress.createFormInstance();
        }
    }
}

async function getIsAdminRole() {
    const response = await fetch(BACKEND_API_URL + '/api/security/isAdmin');

    if (!response.ok) {
        throw new Error("Не удалось получить роль с сервера");
    }

    const data = await response.json();

    return data.isAdmin;
}

async function findParticipantSigners() {
    const response = await fetch(BACKEND_API_URL + '/api/participants/signers');

    if (!response.ok) {
        throw new Error("Подписанты не были загружены с сервера");
    }

    const data = await response.json();

    return data.map(el => new Participant(el));
}

async function findWorkerSigners() {
    const response = await fetch(BACKEND_API_URL + '/api/workers/signers');

    if (!response.ok) {
        throw new Error("Подписанты(сотрудники отдела) не были загружены с сервера");
    }

    const data = await response.json();

    return data.map(el => new Worker(el));
}

function setParticipantSignersOptions(selectHTML, signers, addDefaultOption) {
    selectHTML.innerHTML = "";

    if (addDefaultOption) {
        const firstOption = document.createElement("option");
        firstOption.value = "";
        firstOption.innerText = "Выберите вариант";
        firstOption.disabled = true;
        firstOption.selected = true;
        firstOption.hidden = true;
        selectHTML.appendChild(firstOption);
    }

    signers.forEach(element => {
        const option = document.createElement("option");
        option.innerText = element.initials
        option.value = element.id
        selectHTML.appendChild(option)
    })

    const option = document.createElement("option");
    option.innerText = "другое"
    option.value = "other"
    selectHTML.appendChild(option)

    selectHTML.onchange = () => {
        if (selectHTML.value === 'other') {
            selectHTML.options[0].selected = true;
            Participant.createFormInstance(true);
        }
    }

}

function setWorkerSignersOptions(selectHTML, signers, addDefaultOption) {
    selectHTML.innerHTML = "";

    if (addDefaultOption) {
        const firstOption = document.createElement("option");
        firstOption.value = "";
        firstOption.innerText = "Выберите вариант";
        firstOption.disabled = true;
        firstOption.selected = true;
        firstOption.hidden = true;
        selectHTML.appendChild(firstOption);
    }

    signers.forEach(element => {
        const option = document.createElement("option");
        option.innerText = element.initials
        option.value = element.id
        selectHTML.appendChild(option)
    })

    const option = document.createElement("option");
    option.innerText = "другое"
    option.value = "other"
    selectHTML.appendChild(option)

    selectHTML.onchange = () => {
        if (selectHTML.value === 'other') {
            Worker.createFormInstance(true);
        }
    }

}
async function findParticipants(withDisabled) {
    let url = BACKEND_API_URL + '/api/participants';
    if (withDisabled && withDisabled === true) {
        url += "/withDisabled"
    }

    let response;
    try {
        response = await fetch(url);
    }
    catch (error) {
        alert(error.message);
    }

    if (!response.ok) {
        throw new Error("Исполнители не были загружены с сервера");
    }

    const data = await response.json();
    return data.map(el => new Participant(el));
}

function setParticipantsOptions(selectHTML, executors, addDefaultOption) {
    selectHTML.innerHTML = "";

    if (addDefaultOption) {
        const firstOption = document.createElement("option");
        firstOption.value = "";
        firstOption.innerText = "Выберите вариант";
        firstOption.disabled = true;
        firstOption.selected = true;
        firstOption.hidden = true;
        selectHTML.appendChild(firstOption);
    }

    executors.forEach(element => {
        const option = document.createElement("option");
        option.innerText = element.initials
        option.value = element.id
        selectHTML.appendChild(option)
    })

    const option = document.createElement("option");
    option.innerText = "другое"
    option.value = "other"
    selectHTML.appendChild(option)

    selectHTML.onchange = () => {
        if (selectHTML.value === 'other') {
            selectHTML.options[0].selected = true;
            Participant.createFormInstance(false);
        }
    }
}

function setWorkerExecutorsOptions(selectHTML, executors) {

    executors.forEach(element => {
        const option = document.createElement("option");
        option.innerText = element.initials
        option.value = element.id
        selectHTML.appendChild(option)
    })

    const option = document.createElement("option");
    option.innerText = "другое"
    option.value = "other"
    selectHTML.appendChild(option)

    selectHTML.onchange = () => {
        if (selectHTML.value === 'other') {
            const otherSelects = [];
            otherSelects.push({
                signFlag: true,
                selectNode: document.getElementById("signer-select")
            })

        }
    }
}

async function findWorkers(withDisabled) {
    let url = BACKEND_API_URL + '/api/workers';
    if (withDisabled && withDisabled === true) {
        url += "/withDisabled"
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Сотрудники отдела не были загружены с сервера");
    }

    const data = await response.json()
    return data.map(el => new Worker(el));
}

function setWorkersOptions(selectHTML, workers, addDefaultOption) {
    selectHTML.innerHTML = "";

    let firstOption;
    if (addDefaultOption) {
        firstOption = document.createElement("option");
        firstOption.value = "";
        firstOption.innerText = "Выберите вариант";
        firstOption.disabled = true;
        firstOption.selected = true;
        firstOption.hidden = true;
        selectHTML.appendChild(firstOption);
    }

    workers.forEach(element => {
        const option = document.createElement("option");
        option.innerText = element.initials
        option.value = element.id
        selectHTML.appendChild(option)
    })

    const option = document.createElement("option");
    option.innerText = "другое"
    option.value = "other"
    selectHTML.appendChild(option)

    selectHTML.onchange = () => {
        if (selectHTML.value === 'other') {
            if (firstOption) {
                selectHTML.getElementsByTagName("option")[0].selected = true;
            }
            Worker.createFormInstance(false);
        }
    }
}

async function findDocumentTypes(withDisabled) {
    let url = BACKEND_API_URL + '/api/documentTypes';
    if (withDisabled && withDisabled === true) {
        url += "/withDisabled"
    }
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Типы письма не были загружены с сервера");
    }

    data = await response.json()
    return data.map(el => new DocumentType(el));
}

function setDocumentTypesOptions(selectHTML, types, addDefaultOption) {
    selectHTML.innerHTML = "";

    if (addDefaultOption) {
        const firstOption = document.createElement("option");
        firstOption.value = "";
        firstOption.innerText = "Выберите вариант";
        firstOption.disabled = true;
        firstOption.selected = true;
        firstOption.hidden = true;
        selectHTML.appendChild(firstOption);
    }

    types.forEach(element => {
        const option = document.createElement("option");
        option.innerText = element.name
        option.value = element.id
        selectHTML.appendChild(option)
    })
}

async function findTags(withDisabled) {
    let url = BACKEND_API_URL + '/api/tags';
    if (withDisabled && withDisabled === true) {
        url += "/withDisabled"
    }

    let response;
    try {
        response = await fetch(url);
    }
    catch (error) {
        alert(error.message);
    }

    if (!response.ok) {
        throw new Error("Тэги не были загружены с сервера");
    }

    data = await response.json()
    return data.map(el => new Tag(el));
}

async function getActualInputNumberIVC() {
    const response =  await fetch(BACKEND_API_URL + '/api/inputLetters/actualNumberIVC');

    if (!response.ok) {
        throw new Error("Номер ИВЦ ЖА для автоматической вставки не был загружен с сервера");
    }

    return (await response.json()).numberIVC;
}

async function getActualOutputNumberIVC() {
    const response =  await fetch(BACKEND_API_URL + '/api/outputLetters/actualNumberIVC');

    if (!response.ok) {
        throw new Error("Номер ИВЦ ЖА для автоматической вставки не был загружен с сервера");
    }

    return (await response.json()).numberIVC;
}

function getHeaderNavigationHTMLInstance(isAdmin) {
    let ul = `
        <ul>
            <li id="input-ref">
                <a href="${BACKEND_API_URL}/api/pages/input">Входящие</a>
            </li>
            <li id="output-ref">
                <a href="${BACKEND_API_URL}/api/pages/output">Исходящие</a>
            </li>
            <li id="search-ref">
                <a href="${BACKEND_API_URL}/api/pages/search">Поиск</a>
            </li>
            <li id="answers-ref">
                <a href="${BACKEND_API_URL}/api/pages/answers">Ответы</a>
            </li>
            ${isAdmin ? 
                `<li id="administration-ref">
                    <a href="${BACKEND_API_URL}/api/pages/administrating">Администрирование</a>
                </li>`
                : ``
            }
        </ul>
    `;

    const nav = document.createElement("nav");
    nav.innerHTML = ul;
    return nav;
}

async function findInputLettersByFilters(filters) {
    let response = await fetch(BACKEND_API_URL + "/api/inputLetters/findByFilters", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(filters)
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    let data = await response.json();

    return data.map(el => new InputLetter(el));
}

async function findOutputLettersByFilters(filters) {
    let response = await fetch(BACKEND_API_URL + "/api/outputLetters/findByFilters", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(filters)
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    let data = await response.json();

    return data.map(el => new OutputLetter(el));
}

async function saveOrUpdateInputLetter(inputLetter) {

    let binary = "";
    if (inputLetter.file) {
        binary = await getBinaryFromFile(inputLetter.file);
    }

    const cloned = {...inputLetter};
    cloned.tags = inputLetter.tags.array;
    cloned.file = arrayBufferToBase64(binary);

    const response = await fetch(BACKEND_API_URL + "/api/inputLetters", {
        method: getMethodRequest(inputLetter) ,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(cloned),
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    const returned = await response.json();
    return new InputLetter(returned);
}

async function saveOrUpdateOutputLetter(outputLetter) {

    let binary = "";
    if (outputLetter.file) {
        binary = await getBinaryFromFile(outputLetter.file);
    }

    const cloned = {...outputLetter};
    cloned.tags = outputLetter.tags.array;
    cloned.file = arrayBufferToBase64(binary);

    //console.log(JSON.stringify(cloned));

    const response = await fetch(BACKEND_API_URL + "/api/outputLetters", {
        method: getMethodRequest(outputLetter) ,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(cloned),
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    const returned = await response.json();
    return new OutputLetter(returned);
}

async function saveOrUpdateDocumentType(documentType) {

    const response = await fetch(BACKEND_API_URL + "/api/documentTypes", {
        method: getMethodRequest(documentType),
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(documentType),
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    const returned = await response.json();
    return new DocumentType(returned);
}

async function saveOrUpdateWorkgroup(workgroup) {

    const response = await fetch(BACKEND_API_URL + "/api/workgroups", {
        method: getMethodRequest(workgroup) ,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(workgroup),
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    const returned = await response.json();
    return new Workgroup(returned);
}

async function saveOrUpdateOriginAndAddress(originAndAddress) {
    const response = await fetch(BACKEND_API_URL + "/api/originsAndAddresses", {
        method: getMethodRequest(originAndAddress),
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(originAndAddress)
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return new OriginAndAddress(await response.json());

}

async function saveOrUpdateParticipant(participant) {
    const response = await fetch(BACKEND_API_URL + "/api/participants", {
        method: getMethodRequest(participant),
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(participant),
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return new Participant(await response.json());

}

async function saveOrUpdateWorker(worker) {
    const response = await fetch(BACKEND_API_URL + "/api/workers", {
        method: getMethodRequest(worker),
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(worker),
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return new Worker(await response.json());
}

async function saveOrUpdateTag(tag) {
    const response = await fetch(BACKEND_API_URL + "/api/tags", {
        method: getMethodRequest(tag),
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tag),
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return new Tag(await response.json());

}

async function getInputLetterFileById(id, filename) {
    const response = await fetch(BACKEND_API_URL + `/api/inputLetters/${id}/file`, {
        method: "GET",
        headers: {
            "Content-Type": "application/octet-stream"
        }
    });

    if (!response.ok) {
        console.error(await response.text());
        //throw new Error(await response.text());
        return null;
    }

    let blob =  await response.blob();

    if (blob.size === 0) {
        return null;
    }

   return new File([blob], filename);
}

async function getOutputLetterFileById(id, filename) {
    const response = await fetch(BACKEND_API_URL + `/api/outputLetters/${id}/file`, {
        method: "GET",
        headers: {
            "Content-Type": "application/octet-stream"
        }
    });

    if (!response.ok) {
        console.error(await response.text());
        //throw new Error(await response.text());
        return null;
    }

    let blob =  await response.blob();

    if (blob.size === 0) {
        return null;
    }

    return new File([blob], filename);
}

async function findOutputLettersByDates(dates) {
    const response = await fetch(BACKEND_API_URL + `/api/outputLetters/getByDates`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dates),
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    return data.map(el => new OutputLetter(el))
}

async function findInputLettersDates(dates) {
    const response = await fetch(BACKEND_API_URL + `/api/inputLetters/getByDates`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dates),
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    return data.map(el => new InputLetter(el))
}

async function tableToExcel(tableData) {
    const response = await fetch(BACKEND_API_URL + `/api/excel/tableToExcel`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(tableData),
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.blob();

    const a = document.createElement('a');
    a.download = tableData.filename + '.xlsx';
    a.href = window.URL.createObjectURL(data);
    a.click();
}

async function findWorkgroups(withDisabled) {
    let url = BACKEND_API_URL + `/api/workgroups`;
    if (withDisabled && withDisabled === true) {
        url += "/withDisabled"
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    return data.map(el => new Workgroup(el))
}

async function getAnswerChainByInputLetterId(id) {
    let url = BACKEND_API_URL + `/api/answers/inputLetter/${id}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();
}

async function getAnswerChainByOutputLetterId(id) {
    let url = BACKEND_API_URL + `/api/answers/outputLetter/${id}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();
}

function arrayBufferToBase64( buffer ) {
    let binary = '';
    let bytes = new Uint8Array( buffer );
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

async function getBinaryFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.addEventListener('load', () => resolve(reader.result))
        reader.addEventListener('error', (err) => reject(err))
        reader.readAsArrayBuffer(file)
    })
}

function blockButton(button, timeInSeconds) {
    if (typeof timeInSeconds !== "number") {
        return;
    }
    const copiedText = button.innerText;
    const copiedOnclick = button.onclick;

    button.innerText = timeInSeconds;
    button.onclick = null;
    button.classList.add("btn-blocked");
    let timerId = setInterval(() => {timeInSeconds -= 1; button.innerText = timeInSeconds;}, 1000);
    setTimeout(() => { clearInterval(timerId); button.innerText = copiedText; button.onclick = copiedOnclick; button.classList.remove("btn-blocked");}, timeInSeconds * 1000);
}

function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight) + "px";
}

function getDateFormat_dd_mm_yy(intValue) {
    const today = new Date(intValue);
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return  dd + '-' + mm + '-' + yyyy;
}

function getDateFormat_yy_mm_dd(intValue) {
    const today = new Date(intValue);
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return  yyyy + '-' + mm + '-' + dd;
}

const getMethodRequest = (object) => {
    if (object.id) {
        if (object.id !== 0 || object.id !== '0') {
            return "PUT";
        }
    }

    return "POST";
}

function getSingleSelectInstance(root, data, idName, textName, onChange, placeholder) {
    const selectData = [];
    data.forEach(element => {
        selectData.push({
            value: element[idName],
            text: element[textName]
        })
    })

    return  new SingleSelect(root, {
        data: selectData,
        placeholder: placeholder ? placeholder : "Выберите вариант",
        search: true,
        listAll: true,
        onChange: onChange ? onChange : () => {}
    })
}

function generateYears(select, since) {
    if (typeof since !== "number" && Number.isInteger(since)) {
        throw new Error("Параметр \"since\" не является целым числом");
    }

    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= since; i--) {
        const option = document.createElement("option");
        option.value = i;
        option.innerText = i;
        select.appendChild(option);
    }
}

async function onOutputYearOrMonthChange(outputSelect, yearMultiSelect, monthMultiSelect) {

    outputSelect.innerHTML = "";
    outputSelect.disabled = false;
    const option = document.createElement("option");
    option.innerText = "Выберите вариант";
    option.disabled = true;
    option.selected = true;
    option.hidden = true;
    outputSelect.appendChild(option)

    if (!yearMultiSelect.selectedValue) {
        option.innerText = "Нет писем";
        option.value = "0";
        outputSelect.disabled = true;
        return;
    }
    if (monthMultiSelect.selectedItems.length === 0) {
        option.innerText = "Нет писем";
        option.value = "0";
        outputSelect.disabled = true;
        return;
    }

    const data = await findOutputLettersByDates({
        year: yearMultiSelect.selectedValue,
        months: monthMultiSelect.selectedValues,
    });

    if(data.length === 0) {
        option.innerText = "Нет писем";
        option.value = "0";
        outputSelect.disabled = true;
    }

    data.forEach(element => {
        const option = document.createElement("option");
        option.innerText = element.documentNumber;
        option.value = element.id;
        outputSelect.appendChild(option);
    })
}

async function onInputYearOrMonthChange(inputSelect, yearMultiSelect, monthMultiSelect) {

    inputSelect.innerHTML = "";
    inputSelect.disabled = false;
    const option = document.createElement("option");
    option.innerText = "Выберите вариант";
    option.disabled = true;
    option.selected = true;
    option.hidden = true;
    inputSelect.appendChild(option)

    if (yearMultiSelect.selectedValue === null) {
        option.innerText = "Нет писем";
        option.value = "0";
        inputSelect.disabled = true;
        return;
    }
    if (monthMultiSelect.selectedItems.length === 0) {
        option.innerText = "Нет писем";
        option.value = "0";
        inputSelect.disabled = true;
        return;
    }

    const data = await findInputLettersDates({
        year:yearMultiSelect.selectedValue,
        months:monthMultiSelect.selectedValues,
    });

    if(data.length === 0) {
        option.innerText = "Нет писем";
        option.value = "0";
        inputSelect.disabled = true;
    }

    data.forEach(element => {
        const option = document.createElement("option");
        option.innerText = element.numberIVC;
        option.value = element.id;
        inputSelect.appendChild(option);
    })
}
