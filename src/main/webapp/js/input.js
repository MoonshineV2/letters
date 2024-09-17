let monthMultiSelect;
let yearMultiSelect;
let tagsMultiSelect;
let dropArea;
let fileInput;
const outputLetters = {};

// Utility function to prevent default browser behavior

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

    Promise.all([
        getOriginsData(),
        getSignersData(),
        getExecutorsData(),
        getWorkersData(),
        getDocumentTypesData(),
        getActualNumberIVC()
    ]);

    tagsMultiSelect = await getTags();
    /*await getOriginsData();
    await getSignersData();
    await getExecutorsData();
    await getWorkersData();
    await getDocumentTypesData();*/

    cutOptionText(16)

    dropArea = document.getElementById('file-drop-zone');
    fileInput = document.getElementById('file-input');
    // Preventing default browser behavior when dragging a file over the container
    dropArea.addEventListener('dragover', preventDefaults);
    dropArea.addEventListener('dragenter', preventDefaults);
    dropArea.addEventListener('dragleave', preventDefaults);

// Handling dropping files into the area
    dropArea.addEventListener('drop', handleDrop);

// We’ll discuss `handleDrop` function down the road
    function handleDrop(e) {
        e.preventDefault();
        dropArea.classList.remove('drag-over');
        // Getting the list of dragged files
        const files = e.dataTransfer.files;

        // Checking if there are any files
        if (files.length === 1) {
            // Assigning the files to the hidden input from the first step
            fileInput.files = files;

            // Processing the files for previews (next step)
            //handleFiles(files);
        }

        selectedFileShow();
    }

    dropArea.addEventListener('dragover', () => {
        dropArea.classList.add('drag-over');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('drag-over');
    });

    fileInput.onchange = selectedFileShow;
};

function cutOptionText(maxTextLength) {
    var e=document.querySelectorAll('option')
    e.forEach(x=>{
        if(x.textContent.length > maxTextLength)
            x.textContent=x.textContent.substring(0,maxTextLength)+'...';
    })
}
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
}

async function saveDocument() {
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
    const file = document.getElementById("file").files[0];
    const documentName = file !== undefined ? file.name : "";
    const outputSelect = document.getElementById("output-select");

    let binary = "";
    if (file !== undefined) {
        binary = await getBinaryFromFile(file);
    }

    if (isAnswer && outputSelect.children.length === 1 || isAnswer && outputSelect.value === "Выберите вариант") {
        const modalError = document.getElementById("modal2");
        showModalError("Ошибка", "Исходящее письмо не выбрано", modalError)
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
            documentTypeId: documentType,
            documentName: documentName,
            originId: origin,
            signerId: signer,
            executorId: executor,
            easdNumber: easdNum,
            answer: isAnswer,
            prilojenie: prilojenie,
            topic: topic,
            tagIds: tagsMultiSelect.selectedValues,
            note: note,
            targetWorkerId: target,
            reserve: reserve,
            file: arrayBufferToBase64(binary),
            outputLetterId: outputSelect.value
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

function selectFile() {
    document.getElementById("file-input").click();
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleFiles(files) {
    for (const file of files) {
        // Initializing the FileReader API and reading the file
        const reader = new FileReader();
        reader.readAsDataURL(file);

        // Once the file has been loaded, fire the processing
        reader.onloadend = function (e) {
            const preview = document.createElement('img');

            if (isValidFileType(file)) {
                preview.src = e.target.result;
            }

            // Apply styling
            preview.classList.add('preview-image');
            const previewContainer = document.getElementById('preview-container');
            previewContainer.appendChild(preview);
        };
    }
}

function isValidFileType() {
    return true;
}

function selectedFileShow() {
    if (fileInput.files.length === 1) {
        document.getElementById("selected-file-name").innerText = fileInput.files[0].name;
    }
    else {
        document.getElementById("selected-file-name").innerText = "нет";
    }
}