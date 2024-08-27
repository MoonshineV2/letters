window.onload = async function () {
    let data = await getInputLettersData()
    let options = {
        columns: Object.keys(data[0]),
        data: data
    }

    data.sort((a, b) => a.id - b.id);

    new Table(document.getElementById("table"), getInputLettersPreset(), data);

}

async function getInputLettersData() {
    let response = await fetch('/letters/api/inputLetters');
    return await response.json();
}