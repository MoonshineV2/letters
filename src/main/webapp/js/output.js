getActualNumberIVC()

window.onload = function() {
    document.getElementById("output-ref").style.color = "yellow";
};

async function getActualNumberIVC() {
    let response = await (await fetch('/letters/rest/outputLetters/actualNumberIVC')).json();
    document.getElementById("ivc-num").value = response.numberIVC;
}