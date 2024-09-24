const inputLetters = [];
let table;
let tagsMultiSelect;
let originsMultiSelect;
let signerMultiSelect;
let executorMultiSelect;

let filterSection;
let headerFilters;

window.onload = async function () {

    document.getElementById("registration-date").value = new Date("2017-01-01").toISOString().split('T')[0];
    document.getElementById("registration-date-2").value = new Date(Date.now()).toISOString().split('T')[0];

    originsMultiSelect = await getOriginsData();
    signerMultiSelect = await getSignersData();
    tagsMultiSelect = await getTags();
    executorMultiSelect = await getExecutorsData();

    filterSection = document.getElementById("filter-section");
    headerFilters = document.getElementById('header-filters');
}

async function getInputLettersData() {
    let response = await fetch('/letters/api/inputLetters');
    let data = await response.json();
    data.forEach(el => {
        for (const [key, value] of Object.entries(el)) {
            if (value === null) {
                el[key] = "";
            }
        }
    })

    return data;
}

async function getOutputLettersData() {
    let response = await fetch('/letters/api/outputLetters');
    let data = await response.json();
    data.forEach(el => {
        for (const [key, value] of Object.entries(el)) {
            if (value === null) {
                el[key] = "";
            }
        }
    })

    return data;
}

async function getOriginsData() {
    let response = await (await fetch('/letters/api/originsAndAddresses')).json();
    const data = [];
    response = Object.values(response).sort((a,b) => a.id - b.id);
    response.forEach(element => {
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

async function getSignersData() {
    let response = await (await fetch('/letters/api/participants/signers')).json();
    const data = [];
    response = Object.values(response).sort((a,b) => a.id - b.id);
    response.forEach(element => {
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

async function getExecutorsData() {
    let response = await (await fetch('/letters/api/participants')).json();
    const data = [];
    response = Object.values(response).sort((a,b) => a.id - b.id);
    response.forEach(element => {
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
        let data = await getInputLettersData();

        //console.log(ivcNum);

        data.forEach(el => {
            if (el.origin) {
                el.origin = new Origin(el.origin);
            }

            if (el.signer) {
                el.signer = new Participant(el.signer);
            }

            if (el.executor) {
                el.executor = new Participant(el.executor);
            }

            if (el.documentType) {
                el.documentType = new DocumentType(el.documentType);
            }

            if (el.targetWorker) {
                el.targetWorker = new Worker(el.targetWorker);
            }

            if (el.tags) {
                el.tags = new Tags(el.tags);
            }
        })

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

        table = new Table(document.getElementById("table"), data, getInputLettersPreset());
    }
    else if (letterType === "output") {
        let data = await getOutputLettersData();

        table = new Table(document.getElementById("table"), data);
    }

    filterSection.classList.add("hidden");
    headerFilters.classList.remove("hidden");
}