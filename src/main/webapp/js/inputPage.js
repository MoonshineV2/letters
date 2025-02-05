const form = {};

let monthMultiSelect;
let yearMultiSelect;
let tagsMultiSelect;
let fileUploader;
let saveButton;

let originsAndAddresses;
let signers;
let executors;
let workers;
let documentTypes;
let actualNumberIVC;
let tags;

let requests = Promise.all([
    findOriginsAndAddresses(),
    findParticipantSigners(),
    findParticipants(),
    findWorkers(),
    findDocumentTypes(),
    getActualInputNumberIVC(),
    findTags()
]).then((data) => {
    originsAndAddresses = data[0];
    signers = data[1];
    executors = data[2];
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

document.addEventListener("participantSignersChanged", async() => {
    participantSigners = await findParticipantSigners();
    setParticipantSignersOptions(document.querySelector("#signer-select"), participantSigners, true);
});

document.addEventListener("WorkersChanged", async() => {
    workers = await findWorkers();
    setWorkersOptions(document.querySelector("#target-select"), workers, true);
});*/

window.addEventListener("load", async () => {
    fileUploader = new FileUploader(document.getElementById("file-uploader"), {onChange: () => {
            form.fileUploader.element.removeAttribute("empty", "");
            saveButton.removeAttribute("empty");
            saveButton.classList.remove("btn-validation-failed");
        }});
    saveButton = document.querySelector("#save-letter");

    generateYears(document.querySelector("#years"), 2017);

    monthMultiSelect = new MultiSelect(document.getElementById("months"), {
        onChange: function(value, text, element) {
            onOutputYearOrMonthChange(document.querySelector("#output-select"), yearMultiSelect, monthMultiSelect);
        }
    })
    yearMultiSelect = new SingleSelect(document.querySelector("#years"),  {
        onChange: function(value, text, element) {
            onOutputYearOrMonthChange(document.querySelector("#output-select"), yearMultiSelect, monthMultiSelect);
        }
    })

    document.querySelector("#is-answer").onchange = (e) => {
        if (e.target.checked) {
            monthMultiSelect.disabled = false;
            yearMultiSelect.disabled = false;
            if (document.querySelector("#output-select").children.length > 1) {
                document.querySelector("#output-select").disabled = false;
            }
        }
        else {
            monthMultiSelect.disabled = true;
            yearMultiSelect.disabled = true;
            document.querySelector("#output-select").disabled = true;
        }
    }

    addCallbackToQueue(() => document.getElementById("input-ref").classList.add("li-selected"));

    await requests;

    tagsMultiSelect = await getTagsMultiselectInstance();

    const docTypesSelect = getSingleSelectInstance(document.querySelector("#doc-type-select"), documentTypes, "id", "name");
    const originsAndAddressesSelect = getSingleSelectInstance(document.querySelector("#origin-select"), originsAndAddresses, "id", "shortName");
    const participantSignersSelect = getSingleSelectInstance(document.querySelector("#signer-select"), signers, "id", "initials");
    const participantsSelect = getSingleSelectInstance(document.querySelector("#executor-select"), executors, "id", "initials");
    const workersSelect = getSingleSelectInstance(document.querySelector("#target-select"), workers, "id", "initials");
    setActualNumberIVC();
    autoInsertRegistrationDate();
    autoInsertDocumentDate();
    autoInsertPostuplenieDate();

    document.querySelectorAll("textarea").forEach((el) => {
        auto_grow(el);
        el.oninput = () => {
            auto_grow(el);
        };
    })

    form.numberIVC = document.querySelector("#ivc-num");
    form.registrationDate = document.querySelector("#registration-date");
    form.postuplenieDate = document.querySelector("#postuplenie-date");
    form.documentDate = document.querySelector("#date-doc");
    form.documentNumber = document.querySelector("#doc-num");
    form.documentType = docTypesSelect;
    form.origin = originsAndAddressesSelect;
    form.signer =participantSignersSelect;
    form.executor = participantsSelect;
    form.easdNumber = document.querySelector("#easd-num");
    form.answer = document.querySelector("#is-answer");
    form.prilojenie = document.querySelector("#prilojenie");
    form.topic = document.querySelector("#topic");
    form.tags = tagsMultiSelect;
    form.note = document.querySelector("#note");
    form.targetWorker = workersSelect;
    form.reserve = document.querySelector("#reserve");
    form.fileUploader = fileUploader;
    form.outputLetter = document.querySelector("#output-select");
})

function getTagsMultiselectInstance() {
    const data = [];
    tags.forEach(element => {
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

function setActualNumberIVC() {
    document.getElementById("ivc-num").value = actualNumberIVC;
    document.getElementById("ivc-num-auto-insert-info").hidden = false;
    document.getElementById("ivc-num").oninput = () => {
        document.getElementById("ivc-num-auto-insert-info").hidden = true;
    }
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

    if (!form.postuplenieDate.value) {
        form.postuplenieDate.setAttribute("empty", "");

        form.postuplenieDate.oninput = () => {
            form.postuplenieDate.removeAttribute("empty");
            saveButton.removeAttribute("empty");
            saveButton.classList.remove("btn-validation-failed");
        }

        hasAttentions = true;
    }

    if (form.answer.checked && form.outputLetter.children.length === 1 || form.answer.checked && form.outputLetter.value === "Выберите вариант") {
        form.outputLetter.setAttribute("empty", "");

        form.outputLetter.oninput = () => {
            form.outputLetter.removeAttribute("empty");
            saveButton.removeAttribute("empty");
            saveButton.classList.remove("btn-validation-failed");
        }

        form.answer.oninput = () => {
            form.outputLetter.removeAttribute("empty");
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

    if (!form.origin.selectedValue) {
        form.origin.element.setAttribute("empty", "");

        form.origin.onChange = () => {
            form.origin.element.removeAttribute("empty");
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

    if (!form.targetWorker.selectedValue) {
        form.targetWorker.element.setAttribute("empty", "");

        form.targetWorker.onChange = () => {
            form.targetWorker.element.removeAttribute("empty");
            saveButton.removeAttribute("empty");
            saveButton.classList.remove("btn-validation-failed");
        }

        hasAttentions = true;
    }

    if (form.tags.selectedValues.length === 0) {
        form.tags.element.setAttribute("empty", "");

        form.tags.onChange = () => {
            form.tags.element.removeAttribute("empty");
            saveButton.removeAttribute("empty");
            saveButton.classList.remove("btn-validation-failed");
        }

        hasAttentions = true;
    }

    if (!form.topic.value) {
        form.topic.setAttribute("empty", "");

        form.topic.oninput = () => {
            form.topic.removeAttribute("empty");
            saveButton.removeAttribute("empty");
            saveButton.classList.remove("btn-validation-failed");
            auto_grow(form.topic);
        }

        hasAttentions = true;
    }

    if (!form.note.value) {
        form.note.setAttribute("empty", "");

        form.note.oninput = () => {
            form.note.removeAttribute("empty");
            saveButton.removeAttribute("empty");
            saveButton.classList.remove("btn-validation-failed");
            auto_grow(form.topic);
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

    const inputLetter = new InputLetter({
        id: 0,
        numberIVC: form.numberIVC.value,
        registrationDate: form.registrationDate.value,
        postuplenieDate: form.postuplenieDate.value,
        documentDate: form.documentDate.value,
        documentNumber: form.documentNumber.value,
        documentType: {id:form.documentType.selectedValue},
        documentName: form.fileUploader.file ? form.fileUploader.file.name : "",
        origin: {id:form.origin.selectedValue},
        signer: {id:form.signer.selectedValue},
        executor: {id:form.executor.selectedValue},
        easdNumber: form.easdNumber.value,
        answer: form.answer.checked,
        prilojenie: form.prilojenie.checked,
        topic: form.topic.value,
        tags: form.tags.selectedValues,
        note: form.note.value,
        targetWorker: {id:form.targetWorker.selectedValue},
        reserve: form.reserve.checked,
        file: form.fileUploader.file,
        outputLetter: {id: form.answer.checked ? form.outputLetter.value : 0}
    });

    try {
        await saveOrUpdateInputLetter(inputLetter);
        informerStatus200Instance(5, "Письмо было успешно сохранено");
        blockButton(document.querySelector("button[onclick=\"saveDocument()\"]"), 5);
        actualNumberIVC = await getActualInputNumberIVC();
        setActualNumberIVC();
    }
    catch (e) {
        informerStatusNot200Instance(30, "Письмо не было сохранено", e.message);
        console.error(e.stack);
    }
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

function autoInsertPostuplenieDate() {
    document.querySelector("#postuplenie-date").value = new Date(Date.now()).toISOString().split('T')[0];
    document.querySelector("#postuplenie-date-auto-insert-info").hidden = false;
    document.querySelector("#postuplenie-date").oninput = () => {
        document.querySelector("#postuplenie-date-auto-insert-info").hidden = true;
    }
}