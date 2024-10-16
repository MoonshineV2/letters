let table;
let tagsMultiSelect;
let originsMultiSelect;
let signerMultiSelect;
let executorMultiSelect;

let filterSection;
let headerFilters;

let originsAndAddresses;
let signers;
let executors;
let workers;
let documentTypes;
let tags;

let requests = Promise.all([
    getOriginsAndAddressesData(),
    getSignersData(),
    getExecutorsData(),
    getWorkersData(),
    getDocumentTypesData(),
    getTagsData()
]).then((data) => {
    originsAndAddresses = data[0];
    signers = data[1];
    executors = data[2];
    workers = data[3];
    documentTypes = data[4];
    tags = data[5];
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

    const options = document.getElementById("table-customization-options");
    Array.from(options.children).forEach((e) => {
        e.onclick = () => {
            e.classList.toggle("table-customization-option-selected");
        }
    })

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


    document.querySelector(".table-customization-btn").onclick = (e) => {
        e.currentTarget.classList.toggle("table-customization-btn-active");
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
    signers = Object.values(signers).sort((a,b) => a.id - b.id);
    signers.forEach(element => {
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
    executors = Object.values(executors).sort((a,b) => a.id - b.id);
    executors.forEach(element => {
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
    const origin = document.getElementById("origin-select").value;
    const signer = document.getElementById("signer-select").value;
    const executor = document.getElementById("signer-select").value;
    const answerNum = document.getElementById("answer-num").value;
    const tags = document.getElementById("tags").value;

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
        }

        table = new Table(document.getElementById("table"), data);
    }

    filterSection.classList.add("hidden");
    headerFilters.classList.remove("hidden");

    const a = document.createElement("a");
    a.href = "#table-section";
    a.click();
    a.remove();
}