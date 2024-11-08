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
    getTagsData()
]).then((data) => {
    originsAndAddresses = data[0];
    participants = data[1];
    workerSigners = data[2];
    workers = data[3];
    documentTypes = data[4];
    actualNumberIVC = data[5];
    tags = data[6];
})

window.addEventListener("load", async () => {
    document.getElementById("registration-date").value = new Date(Date.now()).toISOString().split('T')[0];

    fileUploader = new FileUploader(document.getElementById("file-uploader"));
    saveButton = document.querySelector("#save-letter");

    await requests;

    document.querySelector("#is-answer").onchange = (e) => {
        if (e.target.checked) {
            monthMultiSelect.disabled = false;
            yearMultiSelect.disabled = false;
        }
        else {
            monthMultiSelect.disabled = true;
            yearMultiSelect.disabled = true;
        }
    }

    monthMultiSelect = new MultiSelect(document.getElementById("months"), {
        onChange: function(value, text, element) {
            onInputYearOrMonthChange(document.querySelector("#input-select"), yearMultiSelect, monthMultiSelect);
        }
    })
    yearMultiSelect = new MultiSelect(document.getElementById("years"), {
        onChange: function(value, text, element) {
            onInputYearOrMonthChange(document.querySelector("#input-select"), yearMultiSelect, monthMultiSelect);
        }
    })

    document.getElementById("output-ref").classList.add("li-selected");

    tagsMultiSelect = await getTags();

    setOriginsAndAddressesOptions(document.querySelector("#address-select"), originsAndAddresses, true);
    setWorkerSignersOptions(document.querySelector("#signer-select"), workerSigners, true);
    setParticipantsOptions(document.querySelector("#executor-select"), participants, true);
    setParticipantsOptions(document.querySelector("#participant-select"), participants, true);
    setDocumentTypesOptions(document.querySelector("#doc-type-select"), documentTypes, true);
    setActualNumberIVC();

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
    form.documentType = document.querySelector("#doc-type-select");
    form.address = document.querySelector("#address-select");
    form.signer = document.querySelector("#signer-select");
    form.executor = document.querySelector("#executor-select");
    form.easdNumber = document.querySelector("#easd-num");
    form.answer = document.querySelector("#is-answer");
    form.prilojenie = document.querySelector("#prilojenie");
    form.topic = document.querySelector("#topic");
    form.tags = tagsMultiSelect;
    form.note = document.querySelector("#note");
    form.targetParticipant = document.querySelector("#participant-select");
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
        listAll: false
    })
}

async function saveDocument() {

    let hasAttentions = false;

    if (!form.documentNumber.value) {
        form.documentNumber.setAttribute("empty", "");
        hasAttentions = true;
    }

    if (form.answer.checked && form.inputLetter.children.length === 1 || form.answer.checked && form.inputLetter.value === "Выберите вариант") {
        form.answer.setAttribute("empty", "");
        hasAttentions = true;
    }

    if (!form.address.value) {
        form.address.setAttribute("empty", "");
        hasAttentions = true;
    }

    if (!form.signer.value) {
        form.signer.setAttribute("empty", "");
        hasAttentions = true;
    }

    if (!form.executor.value) {
        form.executor.setAttribute("empty", "");
        hasAttentions = true;
    }

    if (!form.targetParticipant.value) {
        form.targetParticipant.setAttribute("empty", "");
        hasAttentions = true;
    }

    /*if (hasAttentions) {
        saveButton.setAttribute("empty", "");
        saveButton.classList.add("btn-validation-failed");
        saveButton.classList.add("horizontal-shake");
        setTimeout(() => {
            saveButton.classList.remove("horizontal-shake");
        }, 700);
        return;
    }*/

    const outputLetter = new OutputLetter({
        id: 0,
        numberIVC: form.numberIVC.value,
        registrationDate: form.registrationDate.value,
        documentDate: form.documentDate.value,
        documentNumber: form.documentNumber.value,
        documentType: {id:form.documentType.value},
        documentName: form.fileUploader.file ? form.fileUploader.file.name : "",
        address: {id:form.address.value},
        signer: {id:form.signer.value},
        executor: {id:form.executor.value},
        easdNumber: form.easdNumber.value,
        answer: form.answer.checked,
        prilojenie: form.prilojenie.checked,
        topic: form.topic.value,
        tags: form.tags.selectedValues,
        note: form.note.value,
        targetParticipant: {id:form.targetParticipant.value},
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
