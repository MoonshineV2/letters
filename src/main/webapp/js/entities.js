class InputLetter {

    id;
    year;
    numberIVC;
    createDate;
    registrationDate;
    postuplenieDate;
    documentDate;
    documentNumber;
    documentName;
    documentType;
    origin;
    signer;
    executor;
    easdNumber;
    outputLetterId;
    answer;
    prilojenie;
    topic;
    tags;
    note;
    targetWorker;
    reserve;
    file;

    constructor(data) {
        this.id = data.id;
        this.year = data.year;
        this.numberIVC = data.numberIVC;
        this.createDate = data.createDate;
        this.registrationDate = data.registrationDate;
        this.postuplenieDate = data.postuplenieDate;
        this.documentDate = data.documentDate;
        this.documentNumber = data.documentNumber;
        this.documentName = data.documentName;
        this.documentType = new DocumentType(data.documentType);
        this.origin = new Origin(data.origin);
        this.signer = new Participant(data.signer);
        this.executor = new Participant(data.executor);
        this.easdNumber = data.easdNumber;
        this.outputLetterId = data.outputLetterId;
        this.answer = data.answer;
        this.prilojenie = data.prilojenie;
        this.topic = data.topic;
        this.tags = new Tags(data.tags);
        this.note = data.note;
        this.targetWorker = new Worker(data.targetWorker);
        this.reserve = data.reserve;
        this.file = data.file;
    }

    static locale = {
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
    }

    static tableCellsResolver = {
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
            td.innerText = letter.documentName;
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
            } else {
                td.innerHTML = "Нет";
            }
        },
        prilojenie: function (td, letter) {
            if (letter.prilojenie === "true" || letter.prilojenie === true) {
                td.innerHTML = "Да";
            } else {
                td.innerHTML = "Нет";
            }
        },
        targetWorker: function (td, letter) {
            td.innerHTML = letter.targetWorker.initials;
        },
        reserve: function (td, letter) {
            if (letter.reserve === "true" || letter.reserve === true) {
                td.innerHTML = "Да";
            } else {
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
        },
        file: function (td, letter) {
            const aEl = document.createElement("a");
            aEl.href = BACKEND_API_URL + `/api/inputLetters/${letter.id}/file`;
            aEl.innerHTML = letter.documentName;
            td.appendChild(aEl);
        }
    }

    editFormInstance() {

        let documentTypeOptions = '';
        documentTypes.forEach((dt) => {
            if (dt.id !== this.documentType.id) {
                documentTypeOptions += `<option value="${dt.id}">${dt.name}</option>`;
            }
            else {
                documentTypeOptions += `<option value="${dt.id}" selected>${dt.name}</option>`;
            }
        })

        let originAndAddressOptions = '';
        originsAndAddresses.forEach((oa) => {
            if (oa.id !== this.origin.id) {
                originAndAddressOptions += `<option value="${oa.id}">${oa.shortName}</option>`;
            }
            else {
                originAndAddressOptions += `<option value="${oa.id}" selected>${oa.shortName}</option>`;
            }
        })

        let signerOptions = '';
        signers.forEach((sr) => {
            if (sr.id !== this.signer.id) {
                signerOptions += `<option value="${sr.id}">${sr.initials}</option>`;
            }
            else {
                signerOptions += `<option value="${sr.id}" selected>${sr.initials}</option>`;
            }
        })

        let executorOptions = '';
        executors.forEach((ex) => {
            if (ex.id !== this.executor.id) {
                executorOptions += `<option value="${ex.id}">${ex.initials}</option>`;
            }
            else {
                executorOptions += `<option value="${ex.id}" selected>${ex.initials}</option>`;
            }
        })

        let targetOptions = '';
        workers.forEach((target) => {
            if (target.id !== this.targetWorker.id) {
                targetOptions += `<option value="${target.id}">${target.initials}</option>`;
            }
            else {
                targetOptions += `<option value="${target.id}" selected>${target.initials}</option>`;
            }
        })

        let body = `
            <div class="fields">
                <div class="custom-input">
                        <label for="input-letter-year">${InputLetter.locale.year}</label>
                        <input id="input-letter-year" type="text" value="${this.year}">
                </div>
                <div class="custom-input">
                        <label for="input-letter-numberIVC">${InputLetter.locale.numberIVC}</label>
                        <input id="input-letter-numberIVC" type="text" value="${this.numberIVC}">
                </div>
                <div class="custom-input">
                    <label for="input-letter-doc-num">${InputLetter.locale.documentNumber}</label>
                    <input id="input-letter-doc-num" type="text" value="${this.documentNumber}">
                </div>
                <div class="custom-input">
                        <label for="input-letter-easdNumber">${InputLetter.locale.easdNumber}</label>
                        <input id="input-letter-easdNumber" type="text" value="${this.easdNumber}">
                </div>
                <div class="dividing-line dividing-up"></div>
                <div class="custom-checkbox">
                    <input id="is-answer" type="checkbox" ${this.answer ? 'checked' : ''}>
                    <label for="is-answer">Ответ на исходящее</label>
                </div>
                <div class="field-answer-grid">
                    <div class="multiselect">
                        <label for="years">Год исходящего</label>
                        <select id="years" name="years" data-placeholder="Выберите год" data-search="false" data-select-all="true" multiple data-multi-select>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2021">2021</option>
                            <option value="2020">2010</option>
                            <option value="2019">2019</option>
                            <option value="2018">2018</option>
                        </select>
                    </div>
                    <div class="multiselect">
                        <label for="months">Месяц исходящего</label>
                        <select id="months" name="months" data-placeholder="Выберите месяц" data-search="false" data-select-all="true" multiple data-multi-select>
                            <option value="1">01 (январь)</option>
                            <option value="2">02 (февраль)</option>
                            <option value="3">03 (март)</option>
                            <option value="4">04 (апрель)</option>
                            <option value="5">05 (май)</option>
                            <option value="6">06 (июнь)</option>
                            <option value="7">07 (июль)</option>
                            <option value="8">08 (август)</option>
                            <option value="9">09 (сентябрь)</option>
                            <option value="10">10 (октябрь)</option>
                            <option value="11">11 (ноябрь)</option>
                            <option value="12">12 (декабрь)</option>
                        </select>
                    </div>
                    <div class="custom-select answer-grid-select">
                        <label for="output-select">Номер исходящего</label>
                        <select name="doc-num" id="output-select" disabled>
                            <option value="" disabled selected hidden>Нет писем</option>
                        </select>
                    </div>
                </div>
                <div class="dividing-line dividing-up"></div>
                <div class="custom-date">
                    <label for="registration-date">Дата регистрации</label>
                    <div class="field-container">
                        <input id="registration-date" type="date" value="${this.registrationDate ? new Date(this.registrationDate).toISOString().split('T')[0] : null}"/>
                        <p id="registration-date-auto-insert-info" class="auto-insert-value" hidden>автоматическая вставка значения</p>
                    </div>
                </div>
                <div class="custom-date">
                    <label for="date-doc">Дата документа</label>
                    <input id="date-doc" type="date" value="${this.documentDate ? new Date(this.documentDate).toISOString().split('T')[0] : null}"/>
                </div>
                <div class="custom-date">
                    <label for="postuplenie-date">Дата поступления документа</label>
                    <input id="postuplenie-date" type="date" value="${this.postuplenieDate ? new Date(this.postuplenieDate).toISOString().split('T')[0] : null}"/>
                </div>
                <div class="custom-select">
                    <label for="doc-type-select">Тип документа</label>
                    <select name="doc-type" id="doc-type-select">
                        ${documentTypeOptions}
                    </select>
                </div>
                <div class="custom-select">
                    <label for="origin-select">Источник письма</label>
                    <select name="origins" id="origin-select">
                        ${originAndAddressOptions}
                    </select>
                </div>
                <div class="custom-select">
                    <label for="signer-select">Подписант</label>
                    <select name="signers" id="signer-select">
                        ${signerOptions}
                    </select>
                </div>
                <div class="custom-select">
                    <label for="executor-select">Исполнитель</label>
                    <select name="executors" id="executor-select">
                        ${executorOptions}
                    </select>
                </div>
                <div class="custom-select">
                    <label for="target-select">Кому расписано</label>
                    <select name="targets" id="target-select">
                        ${targetOptions}
                    </select>
                </div>
                <div class="multiselect">
                    <label for="tags">Теги</label>
                    <select id="tags" name="tags"></select>
                </div>
                <div class="custom-textarea text-area-small">
                    <label for="topic">Тема</label>
                    <textarea id="topic">${this.topic}"</textarea>
                </div>
                <div class="custom-textarea">
                    <label for="note">Примечание</label>
                    <textarea id="note">${this.note}</textarea>
                </div>
                <div class="custom-checkbox">
                    <input id="prilojenie" type="checkbox" ${this.prilojenie ? 'checked' : ''}>
                    <label for="prilojenie">Приложение</label>
                </div>
                <div class="custom-checkbox">
                    <input id="reserve" type="checkbox" ${this.reserve ? 'checked' : ''}>
                    <label for="reserve">Резерв</label>
                </div>
            </div>
        `;

        let footer = `
            <button class="letter-save-btn" onclick="">
                Сохранить изменения
            </button>
        `;

        new Modal({headerName:"Редактирование входящего письма", body:body, footer:footer});
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

    static locale = {
        id:"Id",
        name:"Полное наименование",
        shortName:"Краткое наименование",
        kodADM:"Код администрации"
    }

    static createFormInstance() {
        let body = `
            <div class="fields">
                <div class="custom-input">
                        <label for="origin-address-name">${this.locale.name}</label>
                        <input id="origin-address-name" type="text">
                </div>
                <div class="custom-input">
                        <label for="origin-address-shortName">${this.locale.shortName}</label>
                        <input id="origin-address-shortName" type="text">
                </div>
                <div class="custom-input">
                        <label for="origin-address-kodADM">${this.locale.kodADM}</label>
                        <input id="origin-address-kodADM" type="text">
                </div>
            </div>
        `;

        let footer = `
            <button class="letter-save-btn" onclick="">
                Создать
            </button>
        `;

        new Modal({headerName:"Создание источника/адреса", body:body, footer:footer});
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