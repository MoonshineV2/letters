let monthMultiSelect;
let yearMultiSelect;
let tagsMultiSelect;
let fileUploader;

const inputLetters = {};

window.onload = async function() {
    document.getElementById("registration-date").value = new Date(Date.now()).toISOString().split('T')[0];

    document.getElementById("is-answer").onchange = function (ev) {
        if (ev.target.checked) {
            document.getElementById("answer-row").style.display = "";
        }
        else {
            document.getElementById("answer-row").style.display = "none";
        }
    }

    monthMultiSelect = new MultiSelect(document.getElementById("months"), {
        onChange: function(value, text, element) {
            onOutputYearOrMonthChange();
        }
    })
    yearMultiSelect = new MultiSelect(document.getElementById("years"), {
        onChange: function(value, text, element) {
            onOutputYearOrMonthChange();
        }
    })

    fileUploader = new FileUploader(document.getElementById("file-uploader"));

    tagsMultiSelect = await getTags();
    await getOriginsData();
    await getParticipantsData();
    await getSignersData();
    await getExecutorsData();
    getActualNumberIVC();
}

async function getActualNumberIVC() {
    let response = await (await fetch('/letters/api/outputLetters/actualNumberIVC')).json();
    document.getElementById("ivc-num").value = response.numberIVC;
    document.getElementById("ivc-num-auto-insert-info").hidden = false;
    document.getElementById("ivc-num").oninput = () => {
        document.getElementById("ivc-num-auto-insert-info").hidden = true;
    }
}

async function getOriginsData() {
    let response = await fetch('/letters/api/originsAndAddresses');
    const originsAndAddresses = await response.json();

    const modal = document.getElementById("modal");
    const select = document.getElementById("address-select");
    const modalError = document.getElementById('modal2');


    originsAndAddresses.forEach(element => {
        const option = document.createElement("option");
        option.innerText = element.name
        option.value = element.id
        select.appendChild(option)
    })

    const option = document.createElement("option");
    option.innerText = "другое"
    option.value = "other"
    select.appendChild(option)

    select.onchange = () => {
        if (select.value === 'other') {
            openModalCreateOrigin(modal, select, modalError);
        }
    }
}

async function getParticipantsData() {
    let response = await (await fetch('/letters/api/participants')).json();

    const modal = document.getElementById("modal")
    const select = document.getElementById("participant-select");
    const modalError = document.getElementById("modal2");

    response.forEach(element => {
        const option = document.createElement("option");
        option.innerText = element.initials
        option.value = element.id
        select.appendChild(option)
    })

    const option = document.createElement("option");
    option.innerText = "другое"
    option.value = "other"
    select.appendChild(option)

    select.onchange = () => {
        if (select.value === 'other') {
            openModalCreateParticipant(modal, select, false, modalError, "Создание исполнителя/адресата/подписанта");
        }
    }
}

function changeTopic() {
    const modal = document.getElementById("modal");
    const input = document.getElementById("topic");

    openModalTopic(modal, input, "Редактирование темы");
}
function changeNote() {
    const modal = document.getElementById("modal");
    const input = document.getElementById("note");

    openModalNote(modal, input, "Редактирование примечания");
}

async function getTags() {
    let response = await (await fetch('/letters/api/tags')).json();
    const data = [];
    response.forEach(element => {
        data.push({
            value: element.id,
            text: element.text
        })
    })

    return  new MultiSelect("#tags", {
        data: data,
        placeholder: "Выберите теги",
        search: true,
        selectAll: false,
        listAll: false
    })
}

async function getSignersData() {
    let response = await (await fetch('/letters/api/workers/signers')).json();

    const modal = document.getElementById("modal");
    const select = document.getElementById("signer-select");
    const modalError = document.getElementById("modal2");

    response.forEach(element => {
        const option = document.createElement("option");
        option.innerText = element.initials
        option.value = element.id
        select.appendChild(option)
    })

    const option = document.createElement("option");
    option.innerText = "другое"
    option.value = "other"
    select.appendChild(option)

    select.onchange = () => {
        if (select.value === 'other') {
            const otherSelects = [];
            otherSelects.push({
                signFlag: false,
                selectNode: document.getElementById("executor-select")
            })
            openModalCreateWorker(modal, select, modalError,"Создание подписанта", otherSelects);
        }
    }

}

async function getExecutorsData() {
    let response = await (await fetch('/letters/api/workers')).json();

    const modal = document.getElementById("modal");
    const select = document.getElementById("executor-select");
    const modalError = document.getElementById("modal2");

    response.forEach(element => {
        const option = document.createElement("option");
        option.innerText = element.initials
        option.value = element.id
        select.appendChild(option)
    })

    const option = document.createElement("option");
    option.innerText = "другое"
    option.value = "other"
    select.appendChild(option)

    select.onchange = () => {
        if (select.value === 'other') {
            const otherSelects = [];
            otherSelects.push({
                signFlag: true,
                selectNode: document.getElementById("signer-select")
            })
            openModalCreateWorker(modal, select, modalError ,"Создание исполнителя", otherSelects);
        }
    }
}

async function onOutputYearOrMonthChange() {

    const select = document.getElementById("input-select");
    select.innerHTML = "";
    select.disabled = false;
    const option = document.createElement("option");
    option.innerText = "Выберите вариант";
    option.disabled = true;
    option.selected = true;
    option.hidden = true;
    select.appendChild(option)

    if (yearMultiSelect.selectedItems.length === 0) {
        option.innerText = "Нет писем";
        select.disabled = true;
        return;
    }
    if (monthMultiSelect.selectedItems.length === 0) {
        option.innerText = "Нет писем";
        select.disabled = true;
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
        select.disabled = true;
    }

    inputLettersFiltered.forEach(element => {
        const option = document.createElement("option");
        option.innerText = element.documentNumber;
        option.value = element.id
        select.appendChild(option)
    })
}

async function saveDocument() {
    const numIVC = document.getElementById("ivc-num").value;
    const isAnswer = document.getElementById("is-answer").checked;
    const inputSelect = document.getElementById("input-select");
    const registrationDate = document.getElementById("registration-date").value;
    const adress = document.getElementById("address-select").value;
    const easdNum = document.getElementById("easd-num").value;
    const participant = document.getElementById("participant-select").value;
    const prilojenie = document.getElementById("prilojenie").checked;
    const signer = document.getElementById("signer-select").value;
    const executor = document.getElementById("executor-select").value;
    const topic = document.getElementById("topic").value;
    const reserve = document.getElementById("reserve").checked;
    const note = document.getElementById("note").value;
    const file = document.getElementById("file").files[0];
    const documentName = file !== undefined ? file.name : "";

    //const documentDate = document.getElementById("date-doc").value;

    let binary = "";
    if (file !== undefined) {
        binary = await getBinaryFromFile(file);
    }

    if (!isNumeric(adress)) {
        const modalError = document.getElementById("modal2");
        showModalError("Ошибка", "\"Куда направлено письмо\" не выбрано", modalError)
        return;
    }

    /*if (!isNumeric(participant)) {
        const modalError = document.getElementById("modal2");
        showModalError("Ошибка", "\"Кому направлено письмо\" не выбрано", modalError)
        return;
    }*/

    if (isAnswer && inputSelect.children.length === 1 || isAnswer && inputSelect.value === "Выберите вариант") {
        const modalError = document.getElementById("modal2");
        showModalError("Ошибка", "Входящее письмо не выбрано", modalError)
        return;
    }

    const response = await fetch("/letters/api/outputLetters", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            numberIVC: numIVC,
            registrationDate: registrationDate,
            //documentDate: documentDate,
            documentName: documentName,
            addressId: parseInt(adress),
            signerId: signer,
            targetParticipantId: participant,
            executorId: executor,
            easdNumber: easdNum,
            answer: isAnswer,
            prilojenie: prilojenie,
            topic: topic,
            tagIds: tagsMultiSelect.selectedValues,
            note: note,
            reserve: reserve,
            file: arrayBufferToBase64(binary),
            inputLetterId: inputSelect.value
        }),
    });

    const modal = new bootstrap.Modal(document.getElementById('modal2'));
    const element = document.getElementById('modal2');
    const header = element.children[0].children[0].children[0].children[0];
    const body = element.children[0].children[0].children[1].children[0];

    if (!response.ok) {
        body.innerHTML = await response.text();
        header.innerHTML = "Ошибка"

        modal.toggle();
        throw new Error(`Response status: ${response.status}`);
    }

    header.innerHTML = "Успешно";
    body.innerHTML = "Документ был сохранён"
    modal.toggle();

    getActualNumberIVC();
}

async function getBinaryFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.addEventListener('load', () => resolve(reader.result))
        reader.addEventListener('error', (err) => reject(err))
        reader.readAsArrayBuffer(file)
    })
}

function arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}
