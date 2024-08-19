getActualNumberIVC()

window.onload = async function() {
    document.getElementById("output-ref").style.color = "yellow";

    await getOriginsData();
    await getParticipantsData()
};

async function getActualNumberIVC() {
    let response = await (await fetch('/letters/api/outputLetters/actualNumberIVC')).json();
    document.getElementById("ivc-num").value = response.numberIVC;
}

async function getOriginsData() {
    let response = await fetch('/letters/api/originsAndAddresses');
    const originsAndAddresses = await response.json();

    const modal = document.getElementById("modal");
    const select = document.getElementById("address-select");
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

async function getParticipantsData() {
    let response = await (await fetch('/letters/api/participants')).json();

    const modal = document.getElementById("modal")
    const select = document.getElementById("participant-select");
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
            openModalCreateParticipant(modal, select, false, modalError, "Создание исполнителя/адресата/подписанта");
        }
    }
}