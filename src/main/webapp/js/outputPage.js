const form = {};

let monthMultiSelect;
let yearMultiSelect;
let tagsMultiSelect;
let fileUploader;
let saveButton;

let originsAndAddresses;
let participants;
let workerSigners;
let workers;
let documentTypes;
let actualNumberIVC;
let tags;

let requests = Promise.all([
    findOriginsAndAddresses(),
    findParticipants(),
    findWorkerSigners(),
    findWorkers(),
    findDocumentTypes(),
    getActualOutputNumberIVC(),
    findTags()
]).then((data) => {
    originsAndAddresses = data[0];
    participants = data[1];
    workerSigners = data[2];
    workers = data[3];
    documentTypes = data[4];
    actualNumberIVC = data[5];
    tags = data[6];
})

/*document.addEventListener("originsAndAddressesChanged", async() => {
    originsAndAddresses = await findOriginsAndAddresses();
    setOriginsAndAddressesOptions(document.querySelector("#origin-select"), originsAndAddresses, true);
});

document.addEventListener("participantsChanged", async() => {
    participants = await findParticipants();
    setParticipantsOptions(document.querySelector("#executor-select"), participants, true);
});

document.addEventListener("WorkersChanged", async() => {
    workers = await findWorkers();
});

document.addEventListener("WorkerSignersChanged", async() => {
    workerSigners = await findWorkerSigners()
    setWorkerSignersOptions(document.querySelector("#signer-select"), workerSigners, true);
});*/

window.addEventListener("load", async () => {
    document.getElementById("registration-date").value = new Date(Date.now()).toISOString().split('T')[0];

    fileUploader = new FileUploader(document.getElementById("file-uploader"), {onChange: () => {
            form.fileUploader.element.removeAttribute("empty", "");
            saveButton.removeAttribute("empty");
            saveButton.classList.remove("btn-validation-failed");
        }});
    saveButton = document.querySelector("#save-letter");

    addCallbackToQueue(() => document.getElementById("output-ref").classList.add("li-selected"));

    generateYears(document.querySelector("#years"), 2017);

    document.querySelector("#is-answer").onchange = (e) => {
        if (e.target.checked) {
            monthMultiSelect.disabled = false;
            yearMultiSelect.disabled = false;
            if (document.querySelector("#input-select").children.length > 1) {
                document.querySelector("#input-select").disabled = false;
            }
        }
        else {
            monthMultiSelect.disabled = true;
            yearMultiSelect.disabled = true;
            document.querySelector("#input-select").disabled = true;
        }
    }

    monthMultiSelect = new MultiSelect(document.getElementById("months"), {
        onChange: function(value, text, element) {
            onInputYearOrMonthChange(document.querySelector("#input-select"), yearMultiSelect, monthMultiSelect);
        }
    })
    yearMultiSelect = new SingleSelect(document.getElementById("years"), {
        onChange: function(value, text, element) {
            onInputYearOrMonthChange(document.querySelector("#input-select"), yearMultiSelect, monthMultiSelect);
        }
    })

    await requests;

    tagsMultiSelect = await getTags();

    const docTypesSelect = getSingleSelectInstance(document.querySelector("#doc-type-select"), documentTypes, "id", "name");
    const originsAndAddressesSelect = getSingleSelectInstance(document.querySelector("#address-select"), originsAndAddresses, "id", "shortName");
    const executorsSelect = getSingleSelectInstance(document.querySelector("#executor-select"), participants, "id", "initials");
    const targetParticipantsSelect = getSingleSelectInstance(document.querySelector("#participant-select"), participants, "id", "initials");
    const signersSelect = getSingleSelectInstance(document.querySelector("#signer-select"), workerSigners, "id", "initials");

    setActualNumberIVC();
    autoInsertDocumentDate();
    autoInsertRegistrationDate();

    document.querySelectorAll("textarea").forEach((el) => {
        auto_grow(el);
        el.oninput = () => {
            auto_grow(el);
        };
    })

    form.numberIVC = document.querySelector("#ivc-num");
    form.registrationDate = document.querySelector("#registration-date");
    form.documentDate = document.querySelector("#date-doc");
    form.documentNumber = document.querySelector("#doc-num");
    form.documentType = docTypesSelect;
    form.address = originsAndAddressesSelect;
    form.signer = signersSelect;
    form.executor = executorsSelect;
    form.easdNumber = document.querySelector("#easd-num");
    form.answer = document.querySelector("#is-answer");
    form.prilojenie = document.querySelector("#prilojenie");
    form.topic = document.querySelector("#topic");
    form.tags = tagsMultiSelect;
    form.note = document.querySelector("#note");
    form.targetParticipant = targetParticipantsSelect;
    form.reserve = document.querySelector("#reserve");
    form.fileUploader = fileUploader;
    form.inputLetter = document.querySelector("#input-select");
})

function setActualNumberIVC() {
    document.getElementById("ivc-num").value = actualNumberIVC;
    document.getElementById("ivc-num-auto-insert-info").hidden = false;
    document.getElementById("ivc-num").oninput = () => {
        document.getElementById("ivc-num-auto-insert-info").hidden = true;
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
        listAll: false,
        onChange: () => {
            form.tags.element.removeAttribute("empty", "");
            saveButton.removeAttribute("empty");
            saveButton.classList.remove("btn-validation-failed");
        }
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

    const data = await findInputLettersByYears([yearMultiSelect.selectedValue]);

    let inputLettersFiltered = data.filter(el => monthMultiSelect.selectedValues.includes((new Date(el.documentDate).getMonth() + 1).toString()))


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

async function saveDocument() {

    let hasAttentions = false;

    if (!form.numberIVC.value) {
        form.numberIVC.setAttribute("empty", "");

        form.numberIVC.oninput = () => {
            form.numberIVC.removeAttribute("empty");
            saveButton.removeAttribute("empty");
            saveButton.classList.remove("btn-validation-failed");
        }

        hasAttentions = true;
    }

    if (!form.documentNumber.value) {
        form.documentNumber.setAttribute("empty", "");

        form.documentNumber.oninput = () => {
            form.documentNumber.removeAttribute("empty");
            saveButton.removeAttribute("empty");
            saveButton.classList.remove("btn-validation-failed");
        }

        hasAttentions = true;
    }

    if (!form.easdNumber.value) {
        form.easdNumber.setAttribute("empty", "");

        form.easdNumber.oninput = () => {
            form.easdNumber.removeAttribute("empty");
            saveButton.removeAttribute("empty");
            saveButton.classList.remove("btn-validation-failed");
        }

        hasAttentions = true;
    }

    if (form.answer.checked && form.inputLetter.children.length === 1 || form.answer.checked && form.inputLetter.value === "Выберите вариант") {
        form.answer.setAttribute("empty", "");
        hasAttentions = true;
    }

    if (!form.registrationDate.value) {
        form.registrationDate.setAttribute("empty", "");

        form.registrationDate.oninput = () => {
            form.registrationDate.removeAttribute("empty");
            saveButton.removeAttribute("empty");
            saveButton.classList.remove("btn-validation-failed");
        }

        hasAttentions = true;
    }

    if (!form.documentDate.value) {
        form.documentDate.setAttribute("empty", "");

        form.documentDate.oninput = () => {
            form.documentDate.removeAttribute("empty");
            saveButton.removeAttribute("empty");
            saveButton.classList.remove("btn-validation-failed");
        }

        hasAttentions = true;
    }

    if (!form.documentType.selectedValue) {
        form.documentType.element.setAttribute("empty", "");

        form.documentType.onChange = () => {
            form.documentType.element.removeAttribute("empty");
            saveButton.removeAttribute("empty");
            saveButton.classList.remove("btn-validation-failed");
        }

        hasAttentions = true;
    }

    if (!form.address.selectedValue) {
        form.address.element.setAttribute("empty", "");

        form.address.onChange = () => {
            form.address.element.removeAttribute("empty");
            saveButton.removeAttribute("empty");
            saveButton.classList.remove("btn-validation-failed");
        }

        hasAttentions = true;
    }

    if (!form.signer.selectedValue) {
        form.signer.element.setAttribute("empty", "");

        form.signer.onChange = () => {
            form.signer.element.removeAttribute("empty");
            saveButton.removeAttribute("empty");
            saveButton.classList.remove("btn-validation-failed");
        }

        hasAttentions = true;
    }

    if (!form.executor.selectedValue) {
        form.executor.element.setAttribute("empty", "");

        form.executor.onChange = () => {
            form.executor.element.removeAttribute("empty");
            saveButton.removeAttribute("empty");
            saveButton.classList.remove("btn-validation-failed");
        }

        hasAttentions = true;
    }

    if (!form.targetParticipant.selectedValue) {
        form.targetParticipant.element.setAttribute("empty", "");

        form.targetParticipant.onChange = () => {
            form.targetParticipant.element.removeAttribute("empty");
            saveButton.removeAttribute("empty");
            saveButton.classList.remove("btn-validation-failed");
        }

        hasAttentions = true;
    }

    if (form.tags.selectedValues.length === 0) {
        form.tags.element.setAttribute("empty", "");
        hasAttentions = true;
    }

    if (!form.topic.value) {
        form.topic.setAttribute("empty", "");

        form.topic.oninput = () => {
            form.topic.removeAttribute("empty");
            saveButton.removeAttribute("empty");
            saveButton.classList.remove("btn-validation-failed");
        }

        hasAttentions = true;
    }

    if (!form.note.value) {
        form.note.setAttribute("empty", "");

        form.note.oninput = () => {
            form.note.removeAttribute("empty");
            saveButton.removeAttribute("empty");
            saveButton.classList.remove("btn-validation-failed");
        }

        hasAttentions = true;
    }

    if (!form.fileUploader.file) {
        form.fileUploader.element.setAttribute("empty", "");
        hasAttentions = true;
    }

    if (hasAttentions) {
        saveButton.setAttribute("empty", "");
        saveButton.classList.add("btn-validation-failed");
        saveButton.classList.add("horizontal-shake");
        setTimeout(() => {
            saveButton.classList.remove("horizontal-shake");
        }, 700);
        return;
    }

    const outputLetter = new OutputLetter({
        id: 0,
        numberIVC: form.numberIVC.value,
        registrationDate: form.registrationDate.value,
        documentDate: form.documentDate.value,
        documentNumber: form.documentNumber.value,
        documentType: {id:form.documentType.selectedValue},
        documentName: form.fileUploader.file ? form.fileUploader.file.name : "",
        address: {id:form.address.selectedValue},
        signer: {id:form.signer.selectedValue},
        executor: {id:form.executor.selectedValue},
        easdNumber: form.easdNumber.value,
        answer: form.answer.checked,
        prilojenie: form.prilojenie.checked,
        topic: form.topic.value,
        tags: form.tags.selectedValues,
        note: form.note.value,
        targetParticipant: {id:form.targetParticipant.selectedValue},
        reserve: form.reserve.checked,
        file: form.fileUploader.file,
        inputLetter: {id:form.inputLetter.value}
    });

    try {
        await saveOrUpdateOutputLetter(outputLetter);
        informerStatus200Instance(5, "Письмо было успешно сохранено");
        blockButton(document.querySelector("button[onclick=\"saveDocument()\"]"), 5);
        actualNumberIVC = await getActualOutputNumberIVC()
        setActualNumberIVC();
    }
    catch (e) {
        informerStatusNot200Instance(30, "Письмо не было сохранено", e.message);
        console.error(e.stack);
    }
}
function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

function autoInsertRegistrationDate() {
    document.querySelector("#registration-date").value = new Date(Date.now()).toISOString().split('T')[0];
    document.querySelector("#registration-date-auto-insert-info").hidden = false;
    document.querySelector("#registration-date").oninput = () => {
        document.querySelector("#registration-date-auto-insert-info").hidden = true;
    }
}

function autoInsertDocumentDate() {
    document.querySelector("#date-doc").value = new Date(Date.now()).toISOString().split('T')[0];
    document.querySelector("#date-doc-auto-insert-info").hidden = false;
    document.querySelector("#date-doc").oninput = () => {
        document.querySelector("#date-doc-auto-insert-info").hidden = true;
    }
}
