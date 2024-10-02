const BACKEND_API_URL = 'http://localhost:8080/letters';

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
        outputLetterId: inputLetter.outputLetterId
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