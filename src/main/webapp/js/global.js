const BACKEND_API_URL = 'http://localhost:8080/letters';

const outputLetters = {};

window.addEventListener("load",() => {
    document.querySelector(".header-navigation").replaceWith(getHeaderNavigationHTMLInstance());
});

async function getOriginsAndAddressesData(){
    const response = await fetch(BACKEND_API_URL + '/api/originsAndAddresses');

    if (!response.ok) {
        throw new Error("Источники и адреса не были загружены с сервера");
    }

    return await response.json();
}

async function getSignersData() {
    const response = await fetch(BACKEND_API_URL + '/api/participants/signers');

    if (!response.ok) {
        throw new Error("Подписанты не были загружены с сервера");
    }

    return await response.json();
}

async function getExecutorsData() {
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

    return await response.json();
}

async function getWorkersData() {
    const response = await fetch(BACKEND_API_URL + '/api/workers');

    if (!response.ok) {
        throw new Error("Сотрудники отдела не были загружены с сервера");
    }

    return await response.json();
}

async function getDocumentTypesData() {
    const response = await fetch(BACKEND_API_URL + '/api/documentTypes');

    if (!response.ok) {
        throw new Error("Типы письма не были загружены с сервера");
    }

    return await response.json();
}

async function getTagsData() {
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

async function getActualNumberIVC() {
    const response =  await fetch(BACKEND_API_URL + '/api/inputLetters/actualNumberIVC');

    if (!response.ok) {
        throw new Error("Номер ИВЦ ЖА для автоматической вставки не был загружен с сервера");
    }

    return (await response.json()).numberIVC;
}

function getHeaderNavigationHTMLInstance() {
    let ul = `
        <ul>
            <li id="input-ref">
                <a href="${BACKEND_API_URL}/api/pages/input">Входящие</a>
            </li>
            <li id="output-ref">
                <a href="${BACKEND_API_URL}/api/pages/output">Исходящие</a>
            </li>
            <li id="search-ref">
                <a href='${BACKEND_API_URL}/api/pages/search'">Поиск</a>
            </li>
        </ul>
    `;

    const nav = document.createElement("nav");
    nav.innerHTML = ul;
    return nav;
}

async function findInputLetters() {
    let response = await fetch('/letters/api/inputLetters');

    if (!response.ok) {
        throw new Error(await response.text());
    }

    let data = await response.json();

    return data.map(el => new InputLetter(el));
}

async function findOutputLetters() {
    let response = await fetch('/letters/api/outputLetters');

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

    const json = JSON.stringify({
        id: inputLetter.id,
        year: inputLetter.year,
        numberIVC: inputLetter.numberIVC,
        createDate: inputLetter.createDate,
        registrationDate: inputLetter.registrationDate,
        postuplenieDate: inputLetter.postuplenieDate,
        documentDate: inputLetter.documentDate,
        documentNumber: inputLetter.documentNumber,
        documentType: inputLetter.documentType,
        documentName: inputLetter.documentName,
        origin: inputLetter.origin,
        signer: inputLetter.signer,
        executor: inputLetter.executor,
        easdNumber: inputLetter.easdNumber,
        answer: inputLetter.answer,
        prilojenie: inputLetter.prilojenie,
        topic: inputLetter.topic,
        tags: inputLetter.tags.array,
        note: inputLetter.note,
        targetWorker: inputLetter.targetWorker,
        reserve: inputLetter.reserve,
        file: arrayBufferToBase64(binary),
        outputLetter: inputLetter.outputLetter
    });

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
        body: json,
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
    const response = await fetch("/letters/api/originsAndAddresses", {
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

    /*const filename = response.headers.get('Content-Disposition')

    console.log(filename);*/

    if (blob.size === 0) {
        return null;
    }

   return new File([blob], filename);
}

async function findOutputLettersByYears(neededYears) {
    const response = await fetch("/letters/api/outputLetters/findByYears", {
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
    const response = await fetch("/letters/api/inputLetters/findByYears", {
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
        const data = await findOutputLettersByYears(neededYears);

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