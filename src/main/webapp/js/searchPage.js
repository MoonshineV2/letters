let table;
let tagsMultiSelect;
let originsMultiSelect;
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

let requests = Promise.all([
    findOriginsAndAddresses(),
    findParticipantSigners(),
    findParticipants(),
    findWorkers(),
    findWorkerSigners(),
    findDocumentTypes(),
    getTagsData()
]).then((data) => {
    originsAndAddresses = data[0];
    participantSigners = data[1];
    participants = data[2];
    workers = data[3];
    workersSigners = data[4];
    documentTypes = data[5];
    tags = data[6];
})

window.onload = async function () {

    document.getElementById("registration-date").value = new Date("2017-01-01").toISOString().split('T')[0];
    document.getElementById("registration-date-2").value = new Date(Date.now()).toISOString().split('T')[0];

    filterSection = document.getElementById("filter-section");
    headerFilters = document.getElementById('header-filters');

    await requests;

    document.getElementById("search-ref").classList.add("li-selected");

    originsMultiSelect = getOriginsMultiselectInstance();
    signerMultiSelect = getSignersMultiselectInstance();
    tagsMultiSelect = getTagsMultiselectInstance();
    executorMultiSelect = getExecutorsMultiselectInstance();

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


    document.querySelectorAll(".table-customization-btn").forEach(el =>
    el.onclick = (e) => e.currentTarget.classList.toggle("table-customization-btn-active")
    )

    /*const options = document.querySelectorAll(".table-customization-option:has(.table-customization-option-checkbox)");
    options.forEach(el => el.onclick = () => {
        e.classList.toggle("table-customization-option-selected");
    })*/
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
    originsAndAddresses = Object.values(originsAndAddresses).sort((a,b) => a.id - b.id);
    originsAndAddresses.forEach(element => {
        data.push({
            value: element.id,
            text: element.shortName
        })
    })

    return  new MultiSelect("#origin-select", {
        data: data,
        placeholder: "Без фильтра",
        selectAll: true,
        listAll: false
    })
}

function getSignersMultiselectInstance() {
    const data = [];
    participantSigners = Object.values(participantSigners).sort((a,b) => a.id - b.id);
    participantSigners.forEach(element => {
        data.push({
            value: element.id,
            text: element.initials
        })
    })

    return  new MultiSelect("#signer-select", {
        data: data,
        placeholder: "Без фильтра",
        search: true,
        selectAll: true,
        listAll: false
    })
}
function getExecutorsMultiselectInstance() {
    const data = [];
    participants = Object.values(participants).sort((a,b) => a.id - b.id);
    participants.forEach(element => {
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

    if (letterType === "input") {
        let data = await findInputLetters();

        data.sort((e1, e2) => e1.id - e2.id);

        if (ivcNum) {
            data = Object.values(data).filter(el => el.numberIVC === parseInt(ivcNum));
        }

        if (docNum) {
            data = Object.values(data).filter(el => el.documentNumber === docNum);
        }

        if (easdNum) {
            data = Object.values(data).filter(el => el.easdNumber === parseInt(easdNum));
        }

        if (registrationDate) {
            data = Object.values(data).filter(el => el.registrationDate >= new Date(registrationDate).getTime());
        }

        if (registrationDate2) {
            data = Object.values(data).filter(el => el.registrationDate <= new Date(registrationDate2).getTime());
        }

        if (originsMultiSelect.selectedValues.length > 0) {
            data = Object.values(data).filter(el => originsMultiSelect.selectedValues.includes(el.origin.id));
        }

        if (signerMultiSelect.selectedValues.length > 0) {
            data = Object.values(data).filter(el => {
                //console.log(`Letter id:${el.id}. Origin id:${el.signer.id} includes in ${signerMultiSelect.selectedValues}. Result:` + signerMultiSelect.selectedValues.includes(el.signer.id));
                return  signerMultiSelect.selectedValues.includes(el.signer.id);
            });
        }

        if (executorMultiSelect.selectedValues.length > 0) {
            data = Object.values(data).filter(el => executorMultiSelect.selectedValues.includes(el.executor.id));
        }

        document.querySelector("#table-section").classList.remove("hidden");
        table = new Table(document.getElementById("table"), data);
    }
    else if (letterType === "output") {
        let data = await findOutputLetters();

        data.sort((e1, e2) => e1.id - e2.id);

        if (ivcNum) {
            data = Object.values(data).filter(el => el.numberIVC === parseInt(ivcNum));
        }

        if (easdNum) {
            data = Object.values(data).filter(el => el.easdNumber === parseInt(easdNum));
        }

        if (registrationDate) {
            data = Object.values(data).filter(el => el.registrationDate >= new Date(registrationDate).getTime());
        }

        if (registrationDate2) {
            data = Object.values(data).filter(el => el.registrationDate <= new Date(registrationDate2).getTime());
        }

        if (originsMultiSelect.selectedValues.length > 0) {
            data = Object.values(data).filter(el => originsMultiSelect.selectedValues.includes(el.origin.id));
        }

        if (signerMultiSelect.selectedValues.length > 0) {
            data = Object.values(data).filter(el => {
                //console.log(`Letter id:${el.id}. Origin id:${el.signer.id} includes in ${signerMultiSelect.selectedValues}. Result:` + signerMultiSelect.selectedValues.includes(el.signer.id));
                return  signerMultiSelect.selectedValues.includes(el.signer.id);
            });
        }

        if (executorMultiSelect.selectedValues.length > 0) {
            data = Object.values(data).filter(el => executorMultiSelect.selectedValues.includes(el.executor.id));
            console.log(data);
        }

        document.querySelector("#table-section").classList.remove("hidden");
        table = new Table(document.getElementById("table"), data);
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