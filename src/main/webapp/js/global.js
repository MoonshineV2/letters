const BACKEND_API_URL = 'http://localhost:8080/letters';

window.addEventListener("load", async () => {
    console.log(document.querySelector(".header-navigation"))
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
    const response = await fetch(BACKEND_API_URL + '/api/participants');

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
    let response = await fetch(BACKEND_API_URL + '/api/tags');

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