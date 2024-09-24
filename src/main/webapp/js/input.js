let monthMultiSelect;
let yearMultiSelect;
let tagsMultiSelect;
let fileUploader;
const outputLetters = {};

let attentionContainer;
window.addEventListener("load", async () => {
    autoInsertRegistrationDate();

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

    Promise.all([
        getOriginsData(),
        getSignersData(),
        getExecutorsData(),
        getWorkersData(),
        getDocumentTypesData(),
        getActualNumberIVC()
    ]);

    tagsMultiSelect = await getTags();

    attentionContainer = document.getElementById("attentions-container");
})

async function getOriginsData() {
    let response = await fetch('/letters/api/originsAndAddresses');
    const originsAndAddresses = await response.json();

    const modal = document.getElementById("modal");
    const select = document.getElementById("origin-select");
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

async function getSignersData() {
    let response = await (await fetch('/letters/api/participants/signers')).json();

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
            openModalCreateParticipant(modal, select, true, modalError ,"Создание подписанта", otherSelects);
        }
    }

}

async function getDocumentTypesData() {
    let response = await (await fetch('/letters/api/documentTypes')).json();

    const select = document.getElementById("doc-type-select");

    response.forEach(element => {
        const option = document.createElement("option");
        option.innerText = element.name
        option.value = element.id
        select.appendChild(option)
    })
}

async function getExecutorsData() {
    let response = await (await fetch('/letters/api/participants')).json();

    const modal = document.getElementById("modal")
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
            openModalCreateParticipant(modal, select, false, modalError,"Создание исполнителя", otherSelects);
        }
    }
}

async function getWorkersData() {
    let response = await (await fetch('/letters/api/workers')).json();

    const modal = document.getElementById("modal");
    const select = document.getElementById("target-select");
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
            openModalCreateWorker(modal, select, modalError, "Создание сотрудника отдела");
        }
    }
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

async function getActualNumberIVC() {
    let response = await (await fetch('/letters/api/inputLetters/actualNumberIVC')).json();
    document.getElementById("ivc-num").value = response.numberIVC;
    document.getElementById("ivc-num-auto-insert-info").hidden = false;
    document.getElementById("ivc-num").oninput = () => {
        document.getElementById("ivc-num-auto-insert-info").hidden = true;
    }
}

async function saveDocument() {

    attentionContainer.innerHTML = "";

    const numIVC = document.getElementById("ivc-num").value;
    const isAnswer = document.getElementById("is-answer").checked;
    const registrationDate = document.getElementById("registration-date").value;
    const postuplenieDate = document.getElementById("postuplenie-date").value;
    const documentDate = document.getElementById("date-doc").value;
    const easdNum = document.getElementById("easd-num").value;
    const documentNum = document.getElementById("doc-num").value;
    const documentType = document.getElementById("doc-type-select").value;
    const origin = document.getElementById("origin-select").value;
    const prilojenie = document.getElementById("prilojenie").checked;
    const signer = document.getElementById("signer-select").value;
    const target = document.getElementById("target-select").value;
    const executor = document.getElementById("executor-select").value;
    const topic = document.getElementById("topic").value;
    const note = document.getElementById("note").value;
    const reserve = document.getElementById("reserve").checked;
    const file = fileUploader.file;
    const documentName = file !== undefined ? file.name : "";
    const outputSelect = document.getElementById("output-select");

    let hasAttentions = false;

    let binary = "";
    if (file !== undefined) {
        binary = await getBinaryFromFile(file);
    }

    if (!documentNum) {
        attentionContainer.appendChild(generateAttentionHTML("Номер документа не задан"));
        hasAttentions = true;
    }

    if (isAnswer && outputSelect.children.length === 1 || isAnswer && outputSelect.value === "Выберите вариант") {
        attentionContainer.appendChild(generateAttentionHTML("Исходящее письмо не выбрано"));
        hasAttentions = true;
    }

    if (!origin) {
        attentionContainer.appendChild(generateAttentionHTML("Источник письма не выбран"));
        hasAttentions = true;
    }

    if (!signer) {
        attentionContainer.appendChild(generateAttentionHTML("Подписант не выбран"));
        hasAttentions = true;
    }

    if (!executor) {
        attentionContainer.appendChild(generateAttentionHTML("Исполнитель не выбран"));
        hasAttentions = true;
    }

    if (!target) {
        attentionContainer.appendChild(generateAttentionHTML("Кому расписано не выбрано"));
        hasAttentions = true;
    }

    if (hasAttentions) {
        return;
    }

    const response = await fetch("/letters/api/inputLetters", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            numberIVC: numIVC,
            registrationDate: registrationDate,
            postuplenieDate: postuplenieDate,
            documentDate: documentDate,
            documentNumber: documentNum,
            documentType: {id:documentType},
            documentName: documentName,
            origin: {id:origin},
            signer: {id:signer},
            executor: {id:executor},
            easdNumber: easdNum,
            answer: isAnswer,
            prilojenie: prilojenie,
            topic: topic,
            tags: tagsMultiSelect.selectedValues,
            note: note,
            targetWorker: {id:target},
            reserve: reserve,
            file: arrayBufferToBase64(binary),
            outputLetterId: outputSelect.value
        }),
    });

    console.log(JSON.stringify({
        numberIVC: numIVC,
        registrationDate: registrationDate,
        postuplenieDate: postuplenieDate,
        documentDate: documentDate,
        documentNumber: documentNum,
        documentType: {id:documentType},
        documentName: documentName,
        origin: {id:origin},
        signer: {id:signer},
        executor: {id:executor},
        easdNumber: easdNum,
        answer: isAnswer,
        prilojenie: prilojenie,
        topic: topic,
        tags: tagsMultiSelect.selectedValues,
        note: note,
        targetWorker: {id:target},
        reserve: reserve,
        file: arrayBufferToBase64(binary),
        outputLetterId: outputSelect.value
    }));

    if (!response.ok) {
        throw new Error(`Response status: ${response.status}, Response text: ${await response.text()}`);
    }

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

async function onOutputYearOrMonthChange() {

    const select = document.getElementById("output-select");
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
        select.disabled = true;
    }
    
    outputLettersFiltered.forEach(element => {
        const option = document.createElement("option");
        option.innerText = element.numberIVC;
        option.value = element.id;
        select.appendChild(option);
    })
}
function autoInsertRegistrationDate() {
    document.getElementById("registration-date").value = new Date(Date.now()).toISOString().split('T')[0];
    document.getElementById("registration-date-auto-insert-info").hidden = false;
    document.getElementById("registration-date").oninput = () => {
        document.getElementById("registration-date-auto-insert-info").hidden = true;
    }
}

function generateAttentionHTML(text) {
    const attention = document.createElement("div");
    attention.classList.add("attention-on-submit");

    const icon = document.createElement("div");
    icon.classList.add("attention-icon");

    const p = document.createElement("p");
    icon.classList.add("attention-text");
    p.innerText = text;

    attention.appendChild(icon);
    attention.appendChild(p);

    return attention;
}