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

        console.log(this.data);
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
                        this.fieldsPreset[key](td, el);

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
                        this.sortData(field, "DESC");
                        console.timeEnd('Function sortData');
                    }
                    else if (cell.classList.contains("sort-desc")) {
                        cell.classList.remove("sort-desc");
                        cell.classList.add("sort-asc");
                        console.time('Function sortData');
                        this.sortData(field, "ASC");
                        console.timeEnd('Function sortData');
                    }
                    else {
                        cell.classList.add("sort-asc");
                        console.time('Function sortData');
                        this.sortData(field, "ASC");
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
                    this.sortUI();
                    console.timeEnd('Function sortUI');
                }
            }
        }
    }

    sortData(field, order) {
        const fieldType = this.getFieldType(this.data, field);
        //console.log(fieldType);
        if (fieldType === "number") {
            //console.log("type of number");
            if (order === "ASC") {
                this.data.sort((a,b) => a[field] - b[field]);
            }
            else if (order === "DESC"){
                this.data.sort((a,b) => b[field] - a[field]);
            }
            return;
        }
        if (fieldType === "string") {
            //console.log("type of string");
            if (order === "ASC") {
                this.data.sort((a,b) => a[field].localeCompare(b[field]));
            }
            else if (order === "DESC"){
                this.data.sort((a,b) => b[field].localeCompare(a[field]));
            }
            return;
        }
        if (fieldType === "boolean") {
            //console.log("type of boolean");
            if (order === "ASC") {
                this.data.sort((a,b) => a[field] - b[field]);
            }
            else if (order === "DESC"){
                this.data.sort((a,b) => b[field] - a[field]);
            }
            return;
        }
        if (fieldType === "Origin") {
            //console.log("type of Origin");
            if (order === "ASC") {
                this.data.sort((a,b) => Origin.compare(a[field],b[field]));
            }
            else if (order === "DESC"){
                this.data.sort((a,b) => Origin.compare(b[field],a[field]));
            }
            return;
        }
        if (fieldType === "Participant") {
            if (order === "ASC") {
                this.data.sort((a,b) => Participant.compare(a[field],b[field]));
            }
            else if (order === "DESC"){
                this.data.sort((a,b) => Participant.compare(b[field],a[field]));
            }
            return;
        }
        if (fieldType === "DocumentType") {
            if (order === "ASC") {
                this.data.sort((a,b) => DocumentType.compare(a[field],b[field]));
            }
            else if (order === "DESC"){
                this.data.sort((a,b) => DocumentType.compare(b[field],a[field]));
            }
            return;
        }
        if (fieldType === "Worker") {
            if (order === "ASC") {
                this.data.sort((a,b) => Worker.compare(a[field],b[field]));
            }
            else if (order === "DESC"){
                this.data.sort((a,b) => Worker.compare(b[field],a[field]));
            }
            return;
        }
        if (fieldType === "Tags") {
            if (order === "ASC") {
                this.data.sort((a,b) => Tags.compare(a[field],b[field]));
            }
            else if (order === "DESC"){
                this.data.sort((a,b) => Tags.compare(b[field],a[field]));
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
                    if(element[field] instanceof Participant) {
                        type = "Participant";
                        break;
                    }
                    if(element[field] instanceof DocumentType) {
                        type = "DocumentType";
                        break;
                    }
                    if(element[field] instanceof Worker) {
                        type = "Worker";
                        break;
                    }
                    if(element[field] instanceof Tags) {
                        type = "Tags";
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

    sortUI() {
        let rows = Array.from(this.body.children);
        this.data.forEach(el => {
            const elementToSort = rows.find(row => parseInt(row.getElementsByTagName("th")[0].innerHTML) === el.id);
            this.body.appendChild(elementToSort);
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
            createDate: function (td, letter) {
                td.innerHTML = new Date(letter.createDate).toISOString().split('T')[0];
            },
            registrationDate: function (td, letter) {
                td.innerHTML = new Date(letter.registrationDate).toISOString().split('T')[0];
            },
            postuplenieDate: function (td, letter) {
                td.innerHTML = new Date(letter.postuplenieDate).toISOString().split('T')[0];
            },
            documentDate: function (td, letter) {
                td.innerHTML = new Date(letter.documentDate).toISOString().split('T')[0];
            },
            documentName: function (td, letter) {
                const aEl = document.createElement("a");
                aEl.href = `http://localhost:8080/letters/api/inputLetters/${letter.id}/file`;
                aEl.innerHTML = letter.documentName;
                td.appendChild(aEl);
            },
            documentType: function (td, letter) {
                td.innerHTML = letter.documentType.name;
            },
            origin: function (td, letter) {
                const aHTML = document.createElement("a");
                td.appendChild(aHTML);
                aHTML.innerHTML = letter.origin.shortName;
            },
            signer: function (td, letter) {
                const aHTML = document.createElement("a");
                td.appendChild(aHTML);
                aHTML.innerHTML = letter.signer.initials;
            },
            executor: function (td, letter) {
                td.innerHTML = letter.executor.initials;
            },
            answer: function (td, letter) {
                if (letter.answer === "true" || letter.answer === true) {
                    td.innerHTML = "Да";
                }
                else {
                    td.innerHTML = "Нет";
                }
            },
            prilojenie: function (td, letter) {
                if (letter.prilojenie === "true" || letter.prilojenie === true) {
                    td.innerHTML = "Да";
                }
                else {
                    td.innerHTML = "Нет";
                }
            },
            targetWorker: function (td, letter) {
                td.innerHTML = letter.targetWorker.initials;
            },
            reserve: function (td, letter) {
                if (letter.reserve === "true" || letter.reserve === true) {
                    td.innerHTML = "Да";
                }
                else {
                    td.innerHTML = "Нет";
                }
            },
            tags: function (td, letter) {
                let string = "";
                letter.tags.tagsArray.forEach(tag => {
                    string += tag.text + ", ";
                })
                if (letter.tags.tagsArray.length > 0) {
                    string = string.substring(0, string.length - 2);
                }
                td.innerHTML = string;
            }
        }
    }
}

class Origin {
    id;
    name;
    shortName = "";
    kodADM;

    constructor(origin) {
        this.id = origin.id;
        this.name = origin.name;
        this.shortName = origin.shortName;
        this.kodADM = origin.kodADM;
    }

    static compare(o1, o2) {
        if (!(o1 instanceof Origin)) {
            return -1;
        }
        if (!(o2 instanceof Origin)) {
            return 1;
        }

        return o1.shortName.localeCompare(o2.shortName);
    }
}

class Participant {
    id;
    fullname;
    initials = "";
    post;
    canSign;

    constructor(participant) {
        this.id = participant.id;
        this.fullname = participant.fullname;
        this.initials = participant.initials;
        this.post = participant.post;
        this.canSign = participant.canSign;
    }

    static compare(o1, o2) {
        if (!(o1 instanceof Participant)) {
            return -1;
        }
        if (!(o2 instanceof Participant)) {
            return 1;
        }

        return o1.initials.localeCompare(o2.initials);
    }
}

class Worker {
    id;
    fullname;
    initials = "";
    post;
    canSign;
    workgroupId;
    workgroupName;

    constructor(worker) {
        this.id = worker.id;
        this.fullname = worker.fullname;
        this.initials = worker.initials;
        this.post = worker.post;
        this.canSign = worker.canSign;
        this.workgroupId = worker.workgroupId;
        this.workgroupName = worker.workgroupName;
    }

    static compare(o1, o2) {
        if (!(o1 instanceof Worker)) {
            return -1;
        }
        if (!(o2 instanceof Worker)) {
            return 1;
        }

        return o1.initials.localeCompare(o2.initials);
    }
}

class DocumentType {

    id;
    name = "";

    constructor(documentType) {
        this.id = documentType.id;
        this.name = documentType.name;
    }

    static compare(o1, o2) {
        if (!(o1 instanceof DocumentType)) {
            return -1;
        }
        if (!(o2 instanceof DocumentType)) {
            return 1;
        }

        return o1.name.localeCompare(o2.name);
    }
}

class Tags {

    tagsArray;

    constructor(tags) {
        this.tagsArray = tags;
    }

    static compare(o1, o2) {
        if (!(o1 instanceof Tags)) {
            return -1;
        }
        if (!(o2 instanceof Tags)) {
            return 1;
        }

        return o1.tagsArray.length - o2.tagsArray.length;
    }
}
