class Table {
    constructor(element, options = {}, data) {
        this.options = options;
        this.element = element;
        this.data = data;
        this.initialize();
    }


    initialize() {
        let theadHTML = document.createElement("thead");
        let trHTML = document.createElement("tr");
        theadHTML.appendChild(trHTML);

        this.columns.forEach(col => {
            let th = document.createElement("th");
            th.innerHTML = col;
            th.scope = "col";
            trHTML.appendChild(th);
        })

        let tbodyHTML = document.createElement("tbody");

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
            row.children[0].parentNode.replaceChild(th, row.children[0])
            tbodyHTML.appendChild(row);
        })

        this.element.innerHTML = "";
        this.element.appendChild(theadHTML);
        this.element.appendChild(tbodyHTML);
    }

    set element(value) {
        this.options.element = value;
    }

    get element() {
        return this.options.element;
    }

    set columns(value) {
        this.options.columns = value;
    }

    get columns() {
        return this.options.columns;
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
}

function getInputLettersPreset() {
    return {
        columns: [
            "Id",
            "Год",
            "Номер ИВЦ ЖА",
            "Дата создания",
            "Дата регистрации",
            "Дата поступления",
            "Дата письма",
            "Номер письма",
            "Название файла",
            "Тип документа",
            "Источник",
            "Подписант",
            "Исполнитель",
            "Номер ЕАСД",
            "Исходящее сообщение",
            "Ответ",
            "Приложение",
            "Тема",
            "Теги",
            "Примечание",
            "Кому расписано",
            "Файл",
            "Резерв"
        ],
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
                if (data.shortName) {
                    td.innerHTML = data.shortName;
                }
                else {
                    td.innerHTML = data.name;
                }
            },
            signer: function (td, data) {
                td.innerHTML = data.initials;
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