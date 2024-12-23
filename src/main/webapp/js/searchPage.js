let table;
let tagsMultiSelect;
let originsAndAddressesMultiSelect;
let signerMultiSelect;
let executorMultiSelect;

let filterSection;
let headerFilters;

let originsAndAddresses;
let participantSigners;
let participants;
let workers;
let workersSigners;
let documentTypes;
let tags;

let originsAndAddressesFilter;
let participantSignersFilter;
let participantsFilter;
let workersFilter;
let workersSignersFilter;

let requests = Promise.all([
    findOriginsAndAddresses(true),
    findParticipantSigners(),
    findParticipants(true),
    findWorkers(true),
    findWorkerSigners(),
    findDocumentTypes(true),
    findTags(true)
]).then((data) => {
    originsAndAddresses = data[0];
    participantSigners = data[1];
    participants = data[2];
    workers = data[3];
    workersSigners = data[4];
    documentTypes = data[5];
    tags = data[6];

    originsAndAddressesFilter = {...originsAndAddresses};
    participantSignersFilter = {...participantSigners};
    participantsFilter = {...participants};
    workersFilter = {...workers};
    workersSignersFilter = {...workersSigners};

    originsAndAddresses = originsAndAddresses.filter(el => el.disabled === false);
    participants = participants.filter(el => el.disabled === false);
    participantSigners = participantSigners.filter(el => el.disabled === false);
    workers = workers.filter(el => el.disabled === false);
    workersSigners = workersSigners.filter(el => el.disabled === false);
    documentTypes = documentTypes.filter(el => el.disabled === false);
    tags = tags.filter(el => el.disabled === false);
})

window.onload = async function () {

    const dateNow = new Date(Date.now());
    const dateOneYearAgo = new Date(new Date().setFullYear(dateNow.getFullYear() - 1))
    document.getElementById("registration-date").value = dateOneYearAgo.toISOString().split('T')[0];
    document.getElementById("registration-date-2").value = dateNow.toISOString().split('T')[0];

    filterSection = document.getElementById("filter-section");
    headerFilters = document.getElementById('header-filters');

    addCallbackToQueue(() => document.getElementById("search-ref").classList.add("li-selected"));

    await requests;

    originsAndAddressesMultiSelect = getOriginsMultiselectInstance();
    signerMultiSelect = getParticipantSignersMultiselectInstance("#signer-select");
    tagsMultiSelect = getTagsMultiselectInstance();
    executorMultiSelect = getParticipantExecutorsMultiselectInstance();

    let dragSrcEl;

    function handleDragStart(e) {
        //console.log("parent dragstart");
        e.target.style.opacity = '0.4';

        dragSrcEl = this;
    }

    function handleDragEnd(e) {
        //console.log("parent dragend");
        e.target.style.opacity = '1';

        items.forEach(function (item) {
            item.classList.remove('over');
        });

        e.target.classList.remove('over');
    }

    function handleDragOver(e) {
        e.preventDefault();
        return false;
    }

    function handleDragEnter(e) {
        //console.log("parent dragenter");
        this.classList.add('events-disabled');
        this.classList.add('over');
    }

    function handleDragLeave(e) {
        //console.log("parent dragleave");
        this.classList.remove('events-disabled');
        this.classList.remove('over');
    }

    function handleDrop(e) {
        e.stopPropagation(); // stops the browser from redirecting.
        this.classList.remove('events-disabled');
        if (this === dragSrcEl) {
            return ;
        }
        swapElements(this, dragSrcEl)

        return false;
    }

    let items = document.querySelectorAll('.table-customization-options .table-customization-option');
    items.forEach(function(item) {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('dragenter', handleDragEnter);
        item.addEventListener('dragleave', handleDragLeave);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('drop', handleDrop);
    });

    /*const options = document.querySelectorAll(".table-customization-option:has(.table-customization-option-checkbox)");
    options.forEach(el => el.onclick = () => {
        e.classList.toggle("table-customization-option-selected");
    })*/

    const letterType = document.querySelector("#letterType-select");
    letterType.onchange = () => {
        if (letterType.value === "input") {
            document.querySelector("label[for='originAndAddress-select']").innerText = "Источники";
            signerMultiSelect = getParticipantSignersMultiselectInstance(signerMultiSelect.element);
            executorMultiSelect = getParticipantExecutorsMultiselectInstance();
        }
        else {
            document.querySelector("label[for='originAndAddress-select']").innerText = "Адреса";
            signerMultiSelect = getWorkerSignersMultiselectInstance(signerMultiSelect.element);
            executorMultiSelect = getWorkerExecutorsMultiselectInstance();
        }
    }
}

function swapElements(node1, node2) {
    const afterNode2 = node2.nextElementSibling;
    const parent = node2.parentNode;

    node1.replaceWith(node2);
    if (node1 === afterNode2) {
        parent.insertBefore(node1, node2);
    }
    else {
        parent.insertBefore(node1, afterNode2);
    }
}

function getOriginsMultiselectInstance() {
    const data = [];
    originsAndAddressesFilter = Object.values(originsAndAddressesFilter).sort((a,b) => a.id - b.id);
    originsAndAddressesFilter.forEach(element => {
        data.push({
            value: element.id,
            text: element.shortName
        })
    })

    return  new MultiSelect("#originAndAddress-select", {
        data: data,
        placeholder: "Без фильтра",
        selectAll: true,
        listAll: false
    })
}

function getParticipantSignersMultiselectInstance(selector) {
    const data = [];
    participantSignersFilter = Object.values(participantSignersFilter).sort((a,b) => a.id - b.id);
    participantSignersFilter.forEach(element => {
        data.push({
            value: element.id,
            text: element.initials
        })
    })

    return  new MultiSelect(selector, {
        data: data,
        placeholder: "Без фильтра",
        search: true,
        selectAll: true,
        listAll: false
    })
}

function getWorkerSignersMultiselectInstance(selector) {
    const data = [];
    workersSignersFilter = Object.values(workersSignersFilter).sort((a,b) => a.id - b.id);
    workersSignersFilter.forEach(element => {
        data.push({
            value: element.id,
            text: element.initials
        })
    })

    return  new MultiSelect(selector, {
        data: data,
        placeholder: "Без фильтра",
        search: true,
        selectAll: true,
        listAll: false
    })
}
function getParticipantExecutorsMultiselectInstance() {
    const data = [];
    participantsFilter = Object.values(participantsFilter).sort((a,b) => a.id - b.id);
    participantsFilter.forEach(element => {
        data.push({
            value: element.id,
            text: element.initials
        })
    })

    return  new MultiSelect("#executor-select", {
        data: data,
        placeholder: "Без фильтра",
        search: true,
        selectAll: true,
        listAll: false
    })
}

function getWorkerExecutorsMultiselectInstance() {
    const data = [];
    workersFilter = Object.values(workersFilter).sort((a,b) => a.id - b.id);
    workersFilter.forEach(element => {
        data.push({
            value: element.id,
            text: element.initials
        })
    })

    return  new MultiSelect("#executor-select", {
        data: data,
        placeholder: "Без фильтра",
        search: true,
        selectAll: true,
        listAll: false
    })
}

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
        placeholder: "Без фильтра",
        search: true,
        selectAll: true,
        listAll: false
    })
}

function showFilterSection() {
    filterSection.classList.remove("hidden");
    headerFilters.classList.add("hidden");
}

async function findLetters() {
    const letterType = document.getElementById("letterType-select").value;
    const ivcNum = document.getElementById("ivc-num").value;
    const docNum = document.getElementById("doc-num").value;
    const easdNum = document.getElementById("easd-num").value;
    const registrationDate = document.getElementById("registration-date").value;
    const registrationDate2 = document.getElementById("registration-date-2").value;

    const filters = {
        numberIVC: ivcNum ? ivcNum : 0,
        documentNumber: docNum ? docNum : null,
        easdNumber: easdNum ? easdNum : 0,
        registrationDateBegin: registrationDate,
        registrationDateEnd: registrationDate2,
        originAndAddressIds: originsAndAddressesMultiSelect.selectedValues,
        signerIds: signerMultiSelect.selectedValues,
        executorIds: executorMultiSelect.selectedValues,
        tagIds: tagsMultiSelect.selectedValues
    }

    if (letterType === "input") {

        let data = await findInputLettersByFilters(filters);

        //document.getElementById("table").innerHTML = "";
        document.querySelector("#table-section").classList.remove("hidden");
        table = new Table(document.querySelector("#table-section"), data, {columns: Object.keys(InputLetter.locale), locale:InputLetter.locale});
    }
    else if (letterType === "output") {
        let data = await findOutputLettersByFilters(filters);

        //document.getElementById("table").innerHTML = "";
        document.querySelector("#table-section").classList.remove("hidden");
        table = new Table(document.querySelector("#table-section"), data, {columns: Object.keys(OutputLetter.locale), locale:OutputLetter.locale});
    }

    filterSection.classList.add("hidden");
    document.querySelector("#header-filters .filters-text").innerText = serializeFilters();
    headerFilters.classList.remove("hidden");

    const a = document.createElement("a");
    a.href = "#table-section";
    a.click();
    a.remove();
}

function serializeFilters() {
    const section = document.querySelector("#filter-section");

    const selects = section.querySelectorAll(".custom-select");
    const inputs = section.querySelectorAll(".custom-input");
    const dates = section.querySelectorAll(".custom-date");

    let serialized = "";

    selects.forEach(el => {
        serialized += el.querySelector("label").innerText;
        const sel = el.querySelector("select");
        serialized += ":\"" + sel.options[sel.selectedIndex].text + "\"";
    })

    inputs.forEach(el => {
        if (el.querySelector("input").value) {
            serialized += "; " + el.querySelector("label").innerText;
            serialized += ":\"" + el.querySelector("input").value + "\"";
        }
    })

    return serialized;
}