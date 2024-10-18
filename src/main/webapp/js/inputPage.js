const form = {};

let monthMultiSelect;
let yearMultiSelect;
let tagsMultiSelect;
let fileUploader;
let attentionContainer;

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
    getTagsData()
]).then((data) => {
    originsAndAddresses = data[0];
    signers = data[1];
    executors = data[2];
    workers = data[3];
    documentTypes = data[4];
    actualNumberIVC = data[5];
    tags = data[6];
})

document.addEventListener("originsAndAddressesChanged", async() => {
    originsAndAddresses = await findOriginsAndAddresses();
    setOriginsAndAddressesOptions();
});

window.addEventListener("load", async () => {
    fileUploader = new FileUploader(document.getElementById("file-uploader"));
    attentionContainer = document.getElementById("attentions-container");

    await requests;

    monthMultiSelect = new MultiSelect(document.getElementById("months"), {
        onChange: function(value, text, element) {
            onOutputYearOrMonthChange(document.querySelector("#output-select"), yearMultiSelect, monthMultiSelect);
        }
    })
    yearMultiSelect = new MultiSelect(document.getElementById("years"), {
        onChange: function(value, text, element) {
            onOutputYearOrMonthChange(document.querySelector("#output-select"), yearMultiSelect, monthMultiSelect);
        }
    })

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

    document.getElementById("input-ref").classList.add("li-selected");

    tagsMultiSelect = await getTagsMultiselectInstance();

    setOriginsAndAddressesOptions(document.querySelector("#origin-select"), originsAndAddresses);
    setParticipantSignersOptions(document.querySelector("#signer-select"), signers);
    setParticipantsOptions(document.querySelector("#executor-select"), executors)
    setWorkersOptions(document.querySelector("#target-select"), workers);
    setDocumentTypesOptions(document.querySelector("#doc-type-select"), documentTypes);
    setActualNumberIVC();
    autoInsertRegistrationDate();

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
    form.documentType = document.querySelector("#doc-type-select");
    form.origin = document.querySelector("#origin-select");
    form.signer = document.querySelector("#signer-select");
    form.executor = document.querySelector("#executor-select");
    form.easdNumber = document.querySelector("#easd-num");
    form.answer = document.querySelector("#is-answer");
    form.prilojenie = document.querySelector("#prilojenie");
    form.topic = document.querySelector("#topic");
    form.tags = tagsMultiSelect;
    form.note = document.querySelector("#note");
    form.targetWorker = document.querySelector("#target-select");
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
        listAll: false
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
    attentionContainer.innerHTML = "";

    let hasAttentions = false;

    if (!form.documentNumber.value) {
        attentionContainer.appendChild(generateAttentionHTML("Номер документа не задан"));
        hasAttentions = true;
    }

    if (form.answer.checked && form.outputLetter.children.length === 1 || form.answer.checked && form.outputLetter.value === "Выберите вариант") {
        attentionContainer.appendChild(generateAttentionHTML("Исходящее письмо не выбрано"));
        hasAttentions = true;
    }

    if (!form.origin.value) {
        attentionContainer.appendChild(generateAttentionHTML("Источник письма не выбран"));
        hasAttentions = true;
    }

    if (!form.signer.value) {
        attentionContainer.appendChild(generateAttentionHTML("Подписант не выбран"));
        hasAttentions = true;
    }

    if (!form.executor.value) {
        attentionContainer.appendChild(generateAttentionHTML("Исполнитель не выбран"));
        hasAttentions = true;
    }

    if (!form.targetWorker.value) {
        attentionContainer.appendChild(generateAttentionHTML("Кому расписано не выбрано"));
        hasAttentions = true;
    }

    if (hasAttentions) {
        return;
    }

    const inputLetter = new InputLetter({
        id: 0,
        numberIVC: form.numberIVC.value,
        registrationDate: form.registrationDate.value,
        postuplenieDate: form.postuplenieDate.value,
        documentDate: form.documentDate.value,
        documentNumber: form.documentNumber.value,
        documentType: {id:form.documentType.value},
        documentName: form.fileUploader.file ? form.fileUploader.file.name : "",
        origin: {id:form.origin.value},
        signer: {id:form.signer.value},
        executor: {id:form.executor.value},
        easdNumber: form.easdNumber.value,
        answer: form.answer.checked,
        prilojenie: form.prilojenie.checked,
        topic: form.topic.value,
        tags: form.tags.selectedValues,
        note: form.note.value,
        targetWorker: {id:form.targetWorker.value},
        reserve: form.reserve.checked,
        file: form.fileUploader.file,
        outputLetter: {id:form.outputLetter.value}
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