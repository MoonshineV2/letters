let chainData;

let letterTypeSelect;

let monthMultiSelect;
let yearMultiSelect;
let letterSelect;

window.addEventListener("load", async () => {
    addCallbackToQueue(() => document.getElementById("answers-ref").classList.add("li-selected"));

    //document.querySelector("#build-chain").onclick = () => buildAnswersTree();

    generateYears(document.querySelector("#years"), 2017);

    letterTypeSelect = document.querySelector("#letterType-select");
    letterSelect = document.querySelector("#letter-select");

    letterTypeSelect.onchange = (e) => {
        if (e.target.value === "input") {
            onInputYearOrMonthChange(letterSelect, yearMultiSelect, monthMultiSelect);
            document.querySelector("label[for=letter-select]").innerText = "Номер входящего (номер ИВЦ ЖА)";
        }
        else {
            onOutputYearOrMonthChange(letterSelect, yearMultiSelect, monthMultiSelect);
            document.querySelector("label[for=letter-select]").innerText = "Номер исходящего (номер письма)";
        }
    }

    monthMultiSelect = new MultiSelect(document.querySelector("#months"), {
        onChange: function(value, text, element) {
            if (letterTypeSelect.value === "input") {
                onInputYearOrMonthChange(letterSelect, yearMultiSelect, monthMultiSelect);
            }
            else {
                onOutputYearOrMonthChange(letterSelect, yearMultiSelect, monthMultiSelect);
            }
        }
    })
    yearMultiSelect = new SingleSelect(document.querySelector("#years"),  {
        onChange: function(value, text, element) {
            if (letterTypeSelect.value === "input") {
                onInputYearOrMonthChange(letterSelect, yearMultiSelect, monthMultiSelect);
            }
            else {
                onOutputYearOrMonthChange(letterSelect, yearMultiSelect, monthMultiSelect);
            }
        }
    })

    document.querySelector("#build-tree").onclick = () => {
        buildAnswersTree()
    }
})

async function buildAnswersTree() {
    if (!letterSelect.value) return

    const section = document.querySelector(".letter-chain-section");
    section.innerHTML = "";
    chainData = {};
    if (letterTypeSelect.value === "input") {
        chainData = await getAnswerChainByInputLetterId(letterSelect.value);
    }
    else {
        chainData = await getAnswerChainByOutputLetterId(letterSelect.value);
    }

    //console.log(chainData)

    const root = document.createElement("div");
    root.classList.add("tree");

    const rootUl = document.createElement("ul");
    const rootLi = document.createElement("li");
    rootLi.appendChild(generateTreeNode(chainData.root));
    rootUl.appendChild(rootLi);

    root.appendChild(rootUl);

    section.appendChild(root);

    buildNodeChildren(chainData.root, rootLi);
}

function buildNodeChildren(node, li) {
    if (node.previous && node.previous.length === 0) return;

    const genUl = document.createElement("ul");
    li.appendChild(genUl);

    node.previous.forEach((prev) => {
        const childLi = document.createElement("li");
        childLi.appendChild(generateTreeNode(prev));
        genUl.appendChild(childLi);

        buildNodeChildren(prev, childLi);
    })
}

function generateTreeNode(node) {
    let nodeHtml = `
        <div ${node.root ? "class=\"root-node\"" : ""}>
            <h4>${node.type === "InputLetter" ? "Входящее" : "Исходящее"}</h4>
            <p>Дата регистрации</p>
            <p>${getDateFormat_dd_mm_yy(node.registrationDate)}</p>
            <p>Номер письма</p>
            <p>${node.documentNumber}</p>
        </div>
    `

    let container = document.createElement("div");
    container.innerHTML = nodeHtml;

    return container.children[0];
}

function generateChainNodeHtml(node, isRoot) {
    let root = `
        <div class="chain-node ${isRoot ? "root-node" : ""}">
            <h4>${node.type === "InputLetter" ? "Входящее" : "Исходящее"}</h4>
            <div class="dividing-line"></div>
            <div class="chain-body">
                <div class="chain-body-properties">
                    <div>
                        Id
                    </div>
                    <div>
                        Дата регистрации
                    </div>
                    <div>
                        Номер письма
                    </div>
                    <div>
                        Файл
                    </div>
                </div>
                <div class="vertical-line"></div>
                <div class="chain-body-values">
                    <div>
                        ${node.id}
                    </div>
                    <div>
                        00.00.0000
                    </div>
                    <div>
                        123
                    </div>
                    <div>
                        <a href="${BACKEND_API_URL + `/api/${node.type === "InputLetter" ? "inputLetters" : "outputLetters"}/${node.id}/file`}">файл.xsls</a>
                    </div>
                </div>
            </div>
        </div>
    `
    let container = document.createElement("div");
    container.innerHTML = root;

    return container.querySelector(".chain-node");
}