let chainData;

window.addEventListener("load", async () => {
    addCallbackToQueue(() => document.getElementById("answers-ref").classList.add("li-selected"));

    document.querySelector("#build-chain").onclick = () => buildAnswersTree();
})

async function buildAnswersChain() {
    chainData = await getAnswerChain();
    console.log(chainData);

    const section = document.querySelector(".letter-chain-section");
    section.innerHTML = "";
    section.appendChild(generateChainNodeHtml(chainData.root, true));

    let nextNode = chainData.root.next;

    while (nextNode) {
        let img = document.createElement("img");
        img.src = "../images/arrow-up.svg";
        img.alt = "ArrowUp";
        img.classList.add("chain-arrow-up");
        section.insertBefore(img, section.firstChild);

        section.insertBefore(generateChainNodeHtml(nextNode), section.firstChild);

        nextNode = nextNode.next;
    }

    if (chainData.root.previous && chainData.root.previous.length > 0) {
        let img = document.createElement("img");
        img.src = "../images/arrow-up.svg";
        img.alt = "ArrowUp";
        img.classList.add("chain-arrow-up");
        section.appendChild(img)


        if (chainData.root.previous.length > 1) {
            let grid = document.createElement("div");
            grid.classList.add("chain-node-container");

            let imgLeft = document.createElement("img");
            imgLeft.src = "../images/arrow-left.svg";
            imgLeft.alt = "ArrowLeft";
            imgLeft.classList.add("chain-arrow-switch");
            imgLeft.classList.add("switch-disabled");
            grid.appendChild(imgLeft)

            grid.appendChild(generateChainNodeHtml(chainData.root.previous[0]));

            let imgRight = document.createElement("img");
            imgRight.src = "../images/arrow-right.svg";
            imgRight.alt = "ArrowRight";
            imgRight.classList.add("chain-arrow-switch");
            grid.appendChild(imgRight)

            section.appendChild(grid);

            let selectedIndex = 0;

            imgRight.onclick = () => {
                if (selectedIndex + 1 < chainData.root.previous.length) {
                    grid.children[1].replaceWith(generateChainNodeHtml(chainData.root.previous[selectedIndex + 1]));
                    selectedIndex++;
                    if (selectedIndex + 1 === chainData.root.previous.length) {
                        imgRight.classList.add("switch-disabled");
                    }

                    imgLeft.classList.remove("switch-disabled");
                }
            }

            imgLeft.onclick = () => {
                if (selectedIndex -1 >= 0) {
                    grid.children[1].replaceWith(generateChainNodeHtml(chainData.root.previous[selectedIndex -1]));
                    selectedIndex--;
                    if (selectedIndex === 0) {
                        imgLeft.classList.add("switch-disabled");
                    }

                    imgRight.classList.remove("switch-disabled");
                }
            }

            return;
        }

        section.appendChild(generateChainNodeHtml(chainData.root.previous[0]));
    }
}

async function buildAnswersTree() {
    chainData = await getAnswerChain();
    console.log(chainData);

    const root = document.createElement("div");
    root.classList.add("tree");

    const rootUl = document.createElement("ul");
    const rootLi = document.createElement("li");
    rootLi.appendChild(generateTreeNode(chainData.root));
    rootUl.appendChild(rootLi);

    root.appendChild(rootUl);

    const section = document.querySelector(".letter-chain-section");
    section.innerHTML = "";
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
        <div>
            <h4>${node.type === "InputLetter" ? "Входящее" : "Исходящее"}</h4>
            <p>Id: ${node.id}</p>
            <p>Дата регистрации</p>
            <p>Номер письма</p>
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