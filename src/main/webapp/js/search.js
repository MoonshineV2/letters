window.onload = async function () {
    let data = await getInputLettersData()
    let options = {
        columns: Object.keys(data[0]),
        data: data
    }

    data.sort((a, b) => a.id - b.id);

    data.forEach(el => {
        el.origin = new Origin(el.origin);
    })

    console.log(data);

    new Table(document.getElementById("table"), getInputLettersPreset(), data);

}

async function getInputLettersData() {
    let response = await fetch('/letters/api/inputLetters');
    return await response.json();
}

class Origin {
    id;
    name;
    shortName;
    kodADM;

    constructor(origin) {
        this.id = origin.id;
        this.name = origin.name;
        this.shortName = origin.shortName;
        this.kodADM = origin.kodADM;
    }
}