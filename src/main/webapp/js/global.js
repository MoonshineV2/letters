const BACKEND_API_URL = 'http://localhost:8080/letters';

let isAdmin = false;

const outputLetters = [];
const inputLetters = [];
let workgroups;

const beforeLoadRequests = Promise.all([getIsAdminRole()]).then(responses => {
    isAdmin = responses[0];
})

window.addEventListener("load",async () => {
    await beforeLoadRequests;

    document.querySelector(".header-navigation").replaceWith(getHeaderNavigationHTMLInstance(isAdmin));

    document.querySelectorAll(".table-customization-btn").forEach(el =>
        el.onclick = (e) => e.currentTarget.classList.toggle("table-customization-btn-active")
    )
});

async function findOriginsAndAddresses(){
    const response = await fetch(BACKEND_API_URL + '/api/originsAndAddresses');

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
async function findParticipants() {
    let response;
    try {
        response = await fetch(BACKEND_API_URL + '/api/participants');
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

async function findWorkers() {
    const response = await fetch(BACKEND_API_URL + '/api/workers');

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

async function findDocumentTypes() {
    const response = await fetch(BACKEND_API_URL + '/api/documentTypes');

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

async function findTags() {
    let response;
    try {
        response = await fetch(BACKEND_API_URL + '/api/tags');
    }
    catch (error) {
        alert(error.message);
    }

    if (!response.ok) {
        throw new Error("Тэги не были загружены с сервера");
    }

    return await response.json();
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
            ${isAdmin ? 
                `<li id="bd-ref">
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

    const getMethodRequest = () => {
        if (inputLetter.id) {
            if (inputLetter.id !== 0 || inputLetter.id !== '0') {
                return "PUT";
            }
        }

        return "POST";
    }

    const response = await fetch(BACKEND_API_URL + "/api/inputLetters", {
        method: getMethodRequest() ,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(cloned),
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    if (getMethodRequest() === "PUT") {
        const returned = await response.json();
        return new InputLetter(returned);
    }
}

async function saveOrUpdateOutputLetter(outputLetter) {

    let binary = "";
    if (outputLetter.file) {
        binary = await getBinaryFromFile(outputLetter.file);
    }

    const cloned = {...outputLetter};
    cloned.tags = outputLetter.tags.array;
    cloned.file = arrayBufferToBase64(binary);

    const getMethodRequest = () => {
        if (outputLetter.id) {
            if (outputLetter.id !== 0 || outputLetter.id !== '0') {
                return "PUT";
            }
        }

        return "POST";
    }

    //console.log(JSON.stringify(cloned));

    const response = await fetch(BACKEND_API_URL + "/api/outputLetters", {
        method: getMethodRequest() ,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(cloned),
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    if (getMethodRequest() === "PUT") {
        const returned = await response.json();
        return new InputLetter(returned);
    }
}

async function saveOriginAndAddress(originAndAddress) {
    const response = await fetch(BACKEND_API_URL + "/api/originsAndAddresses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: originAndAddress.name,
            shortName: originAndAddress.shortName,
            kodADM: originAndAddress.kodADM
        }),
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return new OriginAndAddress(await response.json());

}

async function saveParticipant(participant) {
    const response = await fetch(BACKEND_API_URL + "/api/participants", {
        method: "POST",
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

async function saveWorker(worker) {
    const response = await fetch(BACKEND_API_URL + "/api/workers", {
        method: "POST",
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

async function getInputLetterFileById(id, filename) {
    const response = await fetch(BACKEND_API_URL + `/api/inputLetters/${id}/file`, {
        method: "GET",
        headers: {
            "Content-Type": "application/octet-stream"
        }
    });

    if (!response.ok) {
        throw new Error(await response.text());
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
        throw new Error(await response.text());
    }

    let blob =  await response.blob();

    if (blob.size === 0) {
        return null;
    }

    return new File([blob], filename);
}

async function findOutputLettersByYears(neededYears) {
    const response = await fetch(BACKEND_API_URL + `/api/outputLetters/findByYears`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            years: neededYears
        }),
    });

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();
    return data.map(el => new OutputLetter(el))
}

async function findInputLettersByYears(neededYears) {
    const response = await fetch(BACKEND_API_URL + `/api/inputLetters/findByYears`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            years: neededYears
        }),
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

async function onOutputYearOrMonthChange(outputSelect, yearMultiSelect, monthMultiSelect) {

    outputSelect.innerHTML = "";
    outputSelect.disabled = false;
    const option = document.createElement("option");
    option.innerText = "Выберите вариант";
    option.disabled = true;
    option.selected = true;
    option.hidden = true;
    outputSelect.appendChild(option)

    if (yearMultiSelect.selectedItems.length === 0) {
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

    keys = Object.keys(outputLetters);
    neededYears = [];

    yearMultiSelect.selectedValues.forEach(el => {
        if (!keys.includes(el)) {
            neededYears.push(el);
        }
    })

    neededYears.forEach(el => {
        outputLetters[el] = [];
    })

    if (neededYears.length > 0) {
        const data = await findOutputLettersByYears(neededYears);

        data.forEach(el => {
            outputLetters[el.year].push(el);
        })
    }

    let outputLettersFiltered = Object.values(outputLetters)
        .flat()
        .filter(el => yearMultiSelect.selectedValues.includes(el.year.toString()))
        .filter(el => monthMultiSelect.selectedValues.includes((new Date(el.documentDate).getMonth() + 1).toString()))


    if(outputLettersFiltered.length === 0) {
        option.innerText = "Нет писем";
        option.value = "0";
        outputSelect.disabled = true;
    }

    outputLettersFiltered.forEach(element => {
        const option = document.createElement("option");
        option.innerText = element.numberIVC;
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

    if (yearMultiSelect.selectedItems.length === 0) {
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

    keys = Object.keys(inputLetters);
    neededYears = [];

    yearMultiSelect.selectedValues.forEach(el => {
        if (!keys.includes(el)) {
            neededYears.push(el);
        }
    })

    neededYears.forEach(el => {
        inputLetters[el] = [];
    })

    if (neededYears.length > 0) {
        const data = await findInputLettersByYears(neededYears);

        data.forEach(el => {
            inputLetters[el.year].push(el);
        })
    }

    let inputLettersFiltered = Object.values(inputLetters)
        .flat()
        .filter(el => yearMultiSelect.selectedValues.includes(el.year.toString()))
        .filter(el => monthMultiSelect.selectedValues.includes((new Date(el.documentDate).getMonth() + 1).toString()))


    if(inputLettersFiltered.length === 0) {
        option.innerText = "Нет писем";
        option.value = "0";
        inputSelect.disabled = true;
    }

    inputLettersFiltered.forEach(element => {
        const option = document.createElement("option");
        option.innerText = element.numberIVC;
        option.value = element.id;
        inputSelect.appendChild(option);
    })
}

async function findWorkgroups() {
    const response = await fetch(BACKEND_API_URL + `/api/workgroups`);

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }

    return response.json();
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

function exportToExcel() {

    const excelFilename = document.querySelector("#excel-filename");
    if (!excelFilename.value) {
        excelFilename.setAttribute("empty", "");

        excelFilename.oninput = () => {
            excelFilename.removeAttribute("empty");
        }

        return;
    }

    const columns = Array.from(table.header.firstChild.children).map(th =>
        th.firstChild.innerText
    );
    const rows = [];
    Array.from(table.body.children).forEach(tr => {
        const row = [];
        Array.from(tr.children).forEach(td => {
            if (td.querySelector("a")) {
                row.push(td.querySelector("a").href);
            }
            else {
                row.push(td.innerText);
            }
        });

        rows.push(row);
    })

    tableToExcel({
        filename:excelFilename.value,
        headerRow:columns,
        dataRows:rows
    })
}