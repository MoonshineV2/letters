window.onload = async function () {
    document.getElementById("search-ref").style.color = "yellow";

    let data = await getOutputLettersData();
    let options = {
        columns: Object.keys(data[0]),
        data: data
    }

    document.getElementById("letterType-select").onchange = function (ev) {
        if (ev.target.value === "input") {
            document.getElementById("doc-num-display").style.display = "";
            document.getElementById("origin-display").style.display = "";
            document.getElementById("signer-display").classList.add("custom-label-right");
        }
        else {
            document.getElementById("doc-num-display").style.display = "none";
            document.getElementById("origin-display").style.display = "none";
            document.getElementById("signer-display").classList.remove("custom-label-right");
        }
    }

    data.sort((a, b) => a.id - b.id);

    data.forEach(el => {
        el.origin = new Origin(el.origin);
    })

    new Table(document.getElementById("table"), data, getInputLettersPreset());

    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

    await getOriginsData();
    await getSignersData();
}

async function getInputLettersData() {
    let response = await fetch('/letters/api/inputLetters');
    let data = await response.json();
    data.forEach(el => {
        for (const [key, value] of Object.entries(el)) {
            if (value === null) {
                data[key] = "";
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
}