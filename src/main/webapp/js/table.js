class Table {
    constructor(element, data, options = {}) {
        this.options = options;
        this.element = element;
        this.data = data;

        if (!this.options.locale) {
            this.options.locale = {}
        }

        if (!this.options.fieldsPreset) {
            this.options.fieldsPreset = {};
        }

        if (!this.options.modalToModify) {
            this.options.modalToModify = function (){console.log("modal")}
        }

        this.initialize();
        this.eventHandlers();
    }


    initialize() {
        this.element.innerHTML = "";

        let theadHTML = document.createElement("thead");
        this.element.appendChild(theadHTML);
        this.header = theadHTML;

        let tbodyHTML = document.createElement("tbody");
        this.element.appendChild(tbodyHTML);
        this.body = tbodyHTML;

        this.InitUI();

        //console.log(this.data);
    }

    InitUI() {
        this.header.innerHTML = "";
        this.body.innerHTML = "";

        let trHTML = document.createElement("tr");
        this.header.appendChild(trHTML);
        Object.keys(this.data[0]).forEach(col => {
            let th = document.createElement("th");
            if (Object.keys(this.locale).includes(col)) {
                th.innerHTML = this.locale[col];
            }
            else {
                th.innerHTML = col;
            }
            th.scope = "col";
            trHTML.appendChild(th);
        })

        this.data.forEach(el => {
            let row = document.createElement("tr");

            for (const [key, value] of Object.entries(el)) {
                let td = document.createElement("td");
                if (value !== null && value !== "") {
                    if (Object.keys(this.fieldsPreset).includes(key)) {
                        this.fieldsPreset[key](td, value);
                    }
                    else {
                        td.innerHTML = value;
                    }
                }

                if (key !== "id") {
                    const span = document.createElement("span");
                    td.appendChild(span);
                    const image = document.createElement("img");
                    image.src = "../icons/edit.svg";
                    image.onclick = () => {
                        this.modalToModify;
                    }
                    span.appendChild(image);
                }
                row.appendChild(td);
            }

            let th = document.createElement("th");
            th.innerHTML = row.children[0].innerHTML;
            th.scope = "row";
            row.children[0].parentNode.replaceChild(th, row.children[0]);
            this.body.appendChild(row);
        })
    }

    updateUI() {
        this.body.innerHTML = "";

        this.data.forEach(el => {
            let row = document.createElement("tr");

            for (const [key, value] of Object.entries(el)) {
                let td = document.createElement("td");
                if (value !== null && value !== "") {
                    if (Object.keys(this.fieldsPreset).includes(key)) {
                        this.fieldsPreset[key](td, value);
                    }
                    else {
                        td.innerHTML = value;
                    }
                }
                row.appendChild(td);
            }

            let th = document.createElement("th");
            th.innerHTML = row.children[0].innerHTML;
            th.scope = "row";
            row.children[0].parentNode.replaceChild(th, row.children[0]);
            this.body.appendChild(row);
        })
    }
    eventHandlers() {
        for (let tr of this.header.children) {
            for (let cell of tr.children) {
                cell.onclick = () => {
                    if (this.data.length === 0 || this.data.length === 1) return;
                    let field;
                    if (Object.values(this.locale).includes(cell.innerHTML)) {
                        field = Object.keys(this.locale).find(key => this.locale[key] === cell.innerHTML);
                    }
                    else {
                        field = cell.innerHTML;
                    }

                    if (cell.classList.contains("sort-asc")) {
                        cell.classList.remove("sort-asc");
                        cell.classList.add("sort-desc");
                        console.time('Function sortData');
                        this.sortData(this.data, field, "DESC");
                        console.timeEnd('Function sortData');
                    }
                    else if (cell.classList.contains("sort-desc")) {
                        cell.classList.remove("sort-desc");
                        cell.classList.add("sort-asc");
                        console.time('Function sortData');
                        this.sortData(this.data, field, "ASC");
                        console.timeEnd('Function sortData');
                    }
                    else {
                        cell.classList.add("sort-asc");
                        console.time('Function sortData');
                        this.sortData(this.data, field, "ASC");
                        console.timeEnd('Function sortData');
                    }

                    for (let rows of this.header.children) {
                        for (let cellToResetArrows of tr.children) {
                            if (cellToResetArrows !== cell) {
                                cellToResetArrows.classList.remove("sort-asc");
                                cellToResetArrows.classList.remove("sort-desc");
                            }
                        }
                    }

                    console.time('Function sortUI');
                    this.sortUI(this.body, this.data);
                    console.timeEnd('Function sortUI');
                }
            }
        }
    }

    sortData(data, field, order) {
        const fieldType = this.getFieldType(data, field);
        //console.log(fieldType);
        if (fieldType === "number") {
            //console.log("type of number");
            if (order === "ASC") {
                data.sort((a,b) => a[field] - b[field]);
            }
            else if (order === "DESC"){
                data.sort((a,b) => b[field] - a[field]);
            }
            return;
        }
        if (fieldType === "string") {
            //console.log("type of string");
            if (order === "ASC") {
                data.sort((a,b) => a[field].localeCompare(b[field]));
            }
            else if (order === "DESC"){
                data.sort((a,b) => b[field].localeCompare(a[field]));
            }
            return;
        }
        if (fieldType === "boolean") {
            //console.log("type of boolean");
            if (order === "ASC") {
                data.sort((a,b) => a[field] - b[field]);
            }
            else if (order === "DESC"){
                data.sort((a,b) => b[field] - a[field]);
            }
            return;
        }
        if (fieldType === "Origin") {
            //console.log("type of Origin");
            if (order === "ASC") {
                data.sort((a,b) => a[field].shortName.localeCompare(b[field].shortName));
            }
            else if (order === "DESC"){
                data.sort((a,b) => b[field].shortName.localeCompare(a[field].shortName));
            }
            return;
        }
    }

    getFieldType(data, field) {
        let type = undefined;

        for (let element of data) {
            if (element[field]) {
                if (typeof element[field] !== "object") {
                    type = typeof element[field];
                    break;
                }
                else {
                    if(element[field] instanceof Origin) {
                        type = "Origin";
                        break;
                    }
                    else {
                        return "object";
                    }
                }
            }
        }

        return type;
    }

    sortUI(bodyHTML, data) {
        let rows = Array.from(bodyHTML.children);
        data.forEach(el => {
            const elementToSort = rows.find(row => parseInt(row.getElementsByTagName("th")[0].innerHTML) === el.id);
            bodyHTML.appendChild(elementToSort);
        })
    }

    set header(value) {
        this.options.header = value;
    }

    get header() {
        return this.options.header;
    }

    set body(value) {
        this.options.body = value;
    }

    get body() {
        return this.options.body;
    }

    set element(value) {
        this.options.element = value;
    }

    get element() {
        return this.options.element;
    }

    set locale(value) {
        this.options.locale = value;
    }

    get locale() {
        return this.options.locale;
    }

    set data(value) {
        this.options.data = value;
    }

    get data() {
        return this.options.data;
    }

    set fieldsPreset(value) {
        this.options.fieldsPreset = value;
    }

    get fieldsPreset() {
        return this.options.fieldsPreset;
    }

    get modalToModify() {
        return this.options.modalToModify;
    }
}

function getInputLettersPreset() {
    return {
        locale: {
            id:"Id",
            year:"Год",
            numberIVC:"Номер ИВЦ ЖА",
            createDate:"Дата создания",
            registrationDate:"Дата регистрации",
            postuplenieDate:"Дата поступления",
            documentDate:"Дата письма",
            documentNumber:"Номер письма",
            documentName:"Название файла",
            documentType:"Тип документа",
            origin:"Источник",
            signer:"Подписант",
            executor:"Исполнитель",
            easdNumber:"Номер ЕАСД",
            outputLetterId:"Исходящее письмо",
            answer:"Ответ",
            prilojenie:"Приложение",
            topic:"Тема",
            tagIds:"Теги",
            note:"Примечание",
            targetWorker:"Кому расписано",
            reserve:"Резерв",
            file:"Файл"
        },
        fieldsPreset: {
            createDate: function (td, data) {
                td.innerHTML = new Date(data).toISOString().split('T')[0];
            },
            registrationDate: function (td, data) {
                td.innerHTML = new Date(data).toISOString().split('T')[0];
            },
            postuplenieDate: function (td, data) {
                td.innerHTML = new Date(data).toISOString().split('T')[0];
            },
            documentDate: function (td, data) {
                td.innerHTML = new Date(data).toISOString().split('T')[0];
            },
            documentType: function (td, data) {
                td.innerHTML = data.name;
            },
            origin: function (td, data) {
                const aHTML = document.createElement("a");
                aHTML.innerHTML = data.shortName;
                td.appendChild(aHTML);
            },
            signer: function (td, data) {
                const aHTML = document.createElement("a");
                td.appendChild(aHTML);
                aHTML.innerHTML = data.initials;
            },
            executor: function (td, data) {
                td.innerHTML = data.initials;
            },
            answer: function (td, data) {
                if (data === "true" || data === true) {
                    td.innerHTML = "Да";
                }
                else {
                    td.innerHTML = "Нет";
                }
            },
            prilojenie: function (td, data) {
                if (data === "true" || data === true) {
                    td.innerHTML = "Да";
                }
                else {
                    td.innerHTML = "Нет";
                }
            },
            targetWorker: function (td, data) {
                td.innerHTML = data.initials;
            },
            reserve: function (td, data) {
                if (data === "true" || data === true) {
                    td.innerHTML = "Да";
                }
                else {
                    td.innerHTML = "Нет";
                }
            }
        }
    }
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