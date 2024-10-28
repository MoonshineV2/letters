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
    outputLetter;
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
        if (data.documentType)
            this.documentType = new DocumentType(data.documentType);
        if (data.origin)
            this.origin = new OriginAndAddress(data.origin);
        if (data.signer)
            this.signer = new Participant(data.signer);
        if (data.executor)
            this.executor = new Participant(data.executor);
        this.easdNumber = data.easdNumber;
        if (data.outputLetter)
            this.outputLetter = new OutputLetter(data.outputLetter);
        this.answer = data.answer;
        this.prilojenie = data.prilojenie;
        this.topic = data.topic;
        if (data.tags)
            this.tags = new Tags(data.tags);
        this.note = data.note;
        if (data.targetWorker)
            this.targetWorker = new Worker(data.targetWorker);
        this.reserve = data.reserve;
        this.file = data.file;
    }

    static changeEventName = "inputLetterChanged";

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
        outputLetter:"Исходящее письмо",
        answer:"Ответ",
        prilojenie:"Приложение",
        topic:"Тема",
        tags:"Теги",
        note:"Примечание",
        targetWorker:"Кому расписано",
        reserve:"Резерв",
        file:"Файл"
    }

    static tableCellsResolver = {
        createDate: function (td, letter) {
            if (letter.createDate)
                td.innerText = getDateFormat_dd_mm_yy(letter.createDate);
        },
        registrationDate: function (td, letter) {
            if (letter.registrationDate)
                td.innerText = getDateFormat_dd_mm_yy(letter.registrationDate);
        },
        postuplenieDate: function (td, letter) {
            if (letter.postuplenieDate)
                td.innerText = getDateFormat_dd_mm_yy(letter.postuplenieDate);
        },
        documentDate: function (td, letter) {
            if (letter.documentDate)
                td.innerText = getDateFormat_dd_mm_yy(letter.documentDate);
        },
        documentName: function (td, letter) {
            if (letter.documentName)
                td.innerText = letter.documentName;
        },
        documentType: function (td, letter) {
            if (letter.documentType)
                td.innerText = letter.documentType.name;
        },
        origin: function (td, letter) {
            if (letter.origin)
                td.innerText = letter.origin.shortName;
        },
        signer: function (td, letter) {
            if (letter.signer)
                td.innerText = letter.signer.initials;
        },
        executor: function (td, letter) {
            if (letter.executor)
                td.innerText = letter.executor.initials;
        },
        outputLetter: function (td, letter) {
            if (letter.outputLetter)
                td.innerText = letter.outputLetter.numberIVC;
        },
        answer: function (td, letter) {
            if (letter.answer === "true" || letter.answer === true) {
                td.innerText = "Да";
            } else {
                td.innerText = "Нет";
            }
        },
        prilojenie: function (td, letter) {
            if (letter.prilojenie === "true" || letter.prilojenie === true) {
                td.innerText = "Да";
            } else {
                td.innerText = "Нет";
            }
        },
        targetWorker: function (td, letter) {
            if (td.innerText)
                td.innerText = letter.targetWorker.initials;
        },
        reserve: function (td, letter) {
            if (letter.reserve === "true" || letter.reserve === true) {
                td.innerText = "Да";
            } else {
                td.innerText = "Нет";
            }
        },
        tags: function (td, letter) {
            if (!letter.tags)
                return;
            let string = "";
            letter.tags.array.forEach(tag => {
                string += tag.text + ", ";
            })
            if (letter.tags.array.length > 0) {
                string = string.substring(0, string.length - 2);
            }
            td.innerText = string;
        },
        file: function (td, letter) {
            const aEl = document.createElement("a");
            aEl.href = BACKEND_API_URL + `/api/inputLetters/${letter.id}/file`;
            aEl.innerHTML = letter.documentName;
            td.appendChild(aEl);
        }
    }

    async editFormInstance() {

        let outputLetterOptions = '';
        if (this.outputLetter) {
            outputLetterOptions += `<option value="${this.outputLetter.id}">${this.outputLetter.numberIVC}</option>`;
        }
        else {
            outputLetterOptions += `<option value="0">Не выбрано</option>`;
        }

        let documentTypeOptions = '';
        documentTypeOptions += `<option value="" selected>Не выбрано</option>`;
        documentTypes.forEach((dt) => {
            if (this.documentType && dt.id === this.documentType.id) {
                documentTypeOptions += `<option value="${dt.id}" selected>${dt.name}</option>`;
            }
            else {
                documentTypeOptions += `<option value="${dt.id}">${dt.name}</option>`;
            }
        })

        let originAndAddressOptions = '';
        originAndAddressOptions += `<option value="" selected>Не выбрано</option>`;
        originsAndAddresses.forEach((oa) => {
            if (this.origin && oa.id === this.origin.id) {
                originAndAddressOptions += `<option value="${oa.id}" selected>${oa.shortName}</option>`;
            }
            else {
                originAndAddressOptions += `<option value="${oa.id}">${oa.shortName}</option>`;
            }
        })

        let signerOptions = '';
        signerOptions += `<option value="" selected>Не выбрано</option>`;
        participantSigners.forEach((sr) => {
            if (this.signer && sr.id === this.signer.id) {
                signerOptions += `<option value="${sr.id}" selected>${sr.initials}</option>`;
            }
            else {
                signerOptions += `<option value="${sr.id}">${sr.initials}</option>`;
            }
        })

        let executorOptions = '';
        executorOptions += `<option value="" selected>Не выбрано</option>`;
        participants.forEach((ex) => {
            if (this.executor && ex.id === this.executor.id) {
                executorOptions += `<option value="${ex.id}" selected>${ex.initials}</option>`;
            }
            else {
                executorOptions += `<option value="${ex.id}">${ex.initials}</option>`;
            }
        })

        let targetOptions = '';
        targetOptions += `<option value="" selected>Не выбрано</option>`;
        workers.forEach((target) => {
            if (this.targetWorker && target.id !== this.targetWorker.id) {
                targetOptions += `<option value="${target.id}" selected>${target.initials}</option>`;
            }
            else {
                targetOptions += `<option value="${target.id}">${target.initials}</option>`;
            }
        });

        let tagsOptions = '';
        tags.forEach((tag) => {
            if (!this.tags.array.some((t) => t.id === tag.id)) {
                tagsOptions += `<option value="${tag.id}">${tag.text}</option>`;
            }
            else {
                tagsOptions += `<option value="${tag.id}" selected>${tag.text}</option>`;
            }
        });


        let body = `
            <div class="fields">
                <div class="custom-input">
                        <label for="il-year">${InputLetter.locale.year}</label>
                        <input id="il-year" type="text" value="${this.year}">
                </div>
                <div class="custom-input">
                        <label for="il-numberIVC">${InputLetter.locale.numberIVC}</label>
                        <input id="il-numberIVC" type="text" value="${this.numberIVC}">
                </div>
                <div class="custom-input">
                    <label for="il-doc-num">${InputLetter.locale.documentNumber}</label>
                    <input id="il-doc-num" type="text" value="${this.documentNumber}">
                </div>
                <div class="custom-input">
                        <label for="il-easdNumber">${InputLetter.locale.easdNumber}</label>
                        <input id="il-easdNumber" type="text" value="${this.easdNumber}">
                </div>
                <div class="dividing-line dividing-up"></div>
                <div class="custom-checkbox">
                    <input id="il-is-answer" type="checkbox" ${this.answer ? 'checked' : ''}>
                    <label for="il-is-answer">Ответ на исходящее</label>
                </div>
                <div class="field-answer-grid">
                    <div class="multiselect">
                        <label for="il-years">Год исходящего</label>
                        <select id="il-years" name="years" data-placeholder="Выберите год" data-search="false" data-select-all="true" multiple data-multi-select disabled>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2021">2021</option>
                            <option value="2020">2010</option>
                            <option value="2019">2019</option>
                            <option value="2018">2018</option>
                        </select>
                    </div>
                    <div class="multiselect">
                        <label for="il-months">Месяц исходящего</label>
                        <select id="il-months" name="months" data-placeholder="Выберите месяц" data-search="false" data-select-all="true" multiple data-multi-select disabled>
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
                        <label for="il-output-select">Номер исходящего</label>
                        <select name="doc-num" id="il-output-select" disabled>
                            ${outputLetterOptions}
                        </select>
                    </div>
                </div>
                <div class="dividing-line dividing-up"></div>
                <div class="custom-date">
                    <label for="il-create-date">Дата создания</label>
                    <div class="field-container">
                        <input id="il-create-date" type="date" value="${this.createDate ? getDateFormat_yy_mm_dd(this.createDate) : ''}"/>
                    </div>
                </div>
                <div class="custom-date">
                    <label for="il-registration-date">Дата регистрации</label>
                    <div class="field-container">
                        <input id="il-registration-date" type="date" value="${this.registrationDate ? getDateFormat_yy_mm_dd(this.registrationDate) : ''}"/>
                        <p id="registration-date-auto-insert-info" class="auto-insert-value" hidden>автоматическая вставка значения</p>
                    </div>
                </div>
                <div class="custom-date">
                    <label for="input-letter-postuplenie-date">Дата поступления документа</label>
                    <input id="input-letter-postuplenie-date" type="date" value="${this.postuplenieDate ? getDateFormat_yy_mm_dd(this.postuplenieDate) : ''}"/>
                </div>
                <div class="custom-date">
                    <label for="il-date-doc">Дата письма</label>
                    <input id="il-date-doc" type="date" value="${this.documentDate ? getDateFormat_yy_mm_dd(this.documentDate) : ''}"/>
                </div>
                <div class="custom-select">
                    <label for="il-doc-type-select">Тип документа</label>
                    <select name="doc-type" id="il-doc-type-select">
                        ${documentTypeOptions}
                    </select>
                </div>
                <div class="custom-select">
                    <label for="il-origin-select">Источник письма</label>
                    <select name="origins" id="il-origin-select">
                        ${originAndAddressOptions}
                    </select>
                </div>
                <div class="custom-select">
                    <label for="il-signer-select">Подписант</label>
                    <select name="signers" id="il-signer-select">
                        ${signerOptions}
                    </select>
                </div>
                <div class="custom-select">
                    <label for="il-executor-select">Исполнитель</label>
                    <select name="executors" id="il-executor-select">
                        ${executorOptions}
                    </select>
                </div>
                <div class="custom-select">
                    <label for="il-target-select">Кому расписано</label>
                    <select name="targets" id="il-target-select">
                        ${targetOptions}
                    </select>
                </div>
                <div class="multiselect">
                    <label for="il-tags">Теги</label>
                    <select id="il-tags" name="tags" multiple data-multi-select>
                        ${tagsOptions}
                    </select>
                </div>
                <div class="custom-textarea text-area-small">
                    <label for="il-topic">Тема</label>
                    <textarea id="il-topic">${this.topic}</textarea>
                </div>
                <div class="custom-textarea">
                    <label for="il-note">Примечание</label>
                    <textarea id="il-note">${this.note}</textarea>
                </div>
                <div class="custom-checkbox">
                    <input id="il-prilojenie" type="checkbox" ${this.prilojenie ? 'checked' : ''}>
                    <label for="il-prilojenie">Приложение</label>
                </div>
                <div class="custom-checkbox">
                    <input id="il-reserve" type="checkbox" ${this.reserve ? 'checked' : ''}>
                    <label for="il-reserve">Резерв</label>
                </div>
                <div class="dividing-line dividing-up"></div>
                <div id="il-file-uploader"></div>
            </div>
        `;

        const bodyWrapper = document.createElement("div");
        bodyWrapper.innerHTML = body;

        bodyWrapper.querySelectorAll("select, input, textarea").forEach((el) => {
            const persistedValue = el.value;
            el.oninput = () => {
                if (persistedValue !== el.value) {
                    el.classList.add("field-changed");
                }
                else {
                    el.classList.remove("field-changed");
                }
            }
        })

        bodyWrapper.querySelectorAll("input[type=\"checkbox\"]").forEach((el) => {
            const persistedValue = el.checked;
            el.oninput = () => {
                if (persistedValue !== el.checked) {
                    el.classList.add("field-changed");
                }
                else {
                    el.classList.remove("field-changed");
                }
            }
        })

        const tagsMultiSelectModal = new MultiSelect(bodyWrapper.querySelector("#il-tags"));

        const outputSelect = bodyWrapper.querySelector("#il-output-select");
        const yearMultiSelect = new MultiSelect(bodyWrapper.querySelector("#il-years"), {
            onChange: function(value, text, element) {
                onOutputYearOrMonthChange(outputSelect, yearMultiSelect, monthMultiSelect);
            }
        });
        const monthMultiSelect = new MultiSelect(bodyWrapper.querySelector("#il-months"), {
            onChange: function(value, text, element) {
                onOutputYearOrMonthChange(outputSelect, yearMultiSelect, monthMultiSelect);
            }
        });

        bodyWrapper.querySelector("#il-is-answer").onchange = (e) => {
            if (e.target.checked) {
                monthMultiSelect.disabled = false;
                yearMultiSelect.disabled = false;
            }
            else {
                monthMultiSelect.disabled = true;
                yearMultiSelect.disabled = true;
            }
        }


        const fileUploader = new FileUploader(bodyWrapper.querySelector("#il-file-uploader"));
        if (this.documentName) {
            const file = await getInputLetterFileById(this.id, this.documentName)
            if (file) {
                fileUploader.file = file;
            }
        }

        let footer = `
            <button class="letter-save-btn">
                Сохранить изменения
            </button>
        `;

        const footerWrapper = document.createElement("div");
        footerWrapper.innerHTML = footer;

        const modal = new Modal({headerName:"Редактирование входящего письма", body:bodyWrapper, footer:footerWrapper});

        footerWrapper.querySelector(".letter-save-btn").onclick = async () => {
            const clonedLetter = {...this};

            clonedLetter.year = bodyWrapper.querySelector("#il-year").value;
            clonedLetter.numberIVC = bodyWrapper.querySelector("#il-numberIVC").value;
            clonedLetter.documentNumber = bodyWrapper.querySelector("#il-doc-num").value;
            clonedLetter.easdNumber = bodyWrapper.querySelector("#il-easdNumber").value;
            clonedLetter.answer = bodyWrapper.querySelector("#il-is-answer").checked;
            clonedLetter.outputLetter = {id:outputSelect.value};
            clonedLetter.createDate = bodyWrapper.querySelector("#il-create-date").value;
            clonedLetter.registrationDate = bodyWrapper.querySelector("#il-registration-date").value;
            clonedLetter.documentDate = bodyWrapper.querySelector("#il-date-doc").value;
            clonedLetter.postuplenieDate = bodyWrapper.querySelector("#input-letter-postuplenie-date").value;
            clonedLetter.documentType = {id:bodyWrapper.querySelector("#il-doc-type-select").value};
            clonedLetter.documentName = fileUploader.file ? fileUploader.file.name : null;
            clonedLetter.origin = {id:bodyWrapper.querySelector("#il-origin-select").value};
            clonedLetter.signer = {id:bodyWrapper.querySelector("#il-signer-select").value};
            clonedLetter.executor = {id:bodyWrapper.querySelector("#il-executor-select").value};
            clonedLetter.targetWorker = {id:bodyWrapper.querySelector("#il-target-select").value};
            clonedLetter.tags = new Tags(tagsMultiSelectModal.selectedValues);
            clonedLetter.topic = bodyWrapper.querySelector("#il-topic").value;
            clonedLetter.note = bodyWrapper.querySelector("#il-note").value;
            clonedLetter.prilojenie = bodyWrapper.querySelector("#il-prilojenie").checked;
            clonedLetter.reserve = bodyWrapper.querySelector("#il-reserve").checked;
            clonedLetter.file = fileUploader.file ? fileUploader.file : null;

            try {
                const returnedLetter  = await saveOrUpdateInputLetter(clonedLetter);

                modal.close();
                informerStatus200Instance(5, "Письмо было изменено");

                Object.assign(this, returnedLetter);

                EventEmitter.dispatch(InputLetter.changeEventName, this);
            }
            catch (e) {
                console.error(e.stack);
                informerStatusNot200Instance(30, "Не получилось изменить письмо", e.message);
            }
        }
    }
}

class OutputLetter {

    id;
    year;
    numberIVC;
    createDate;
    registrationDate;
    documentDate;
    documentNumber = '';
    documentName;
    documentType;
    address;
    targetParticipant;
    signer;
    executor;
    easdNumber;
    inputLetter;
    answer;
    prilojenie;
    topic;
    tags;
    note;
    reserve;
    file;

    constructor(data) {
        this.id = data.id;
        this.year = data.year;
        this.numberIVC = data.numberIVC;
        this.createDate = data.createDate;
        this.registrationDate = data.registrationDate;
        this.documentDate = data.documentDate;
        if (data.documentNumber)
            this.documentNumber = data.documentNumber;
        this.documentName = data.documentName;
        if (data.documentType)
            this.documentType = new DocumentType(data.documentType);
        if (data.address)
            this.address = new OriginAndAddress(data.address);
        if (data.targetParticipant)
            this.targetParticipant = new Participant(data.targetParticipant);
        if (data.signer)
            this.signer = new Worker(data.signer);
        if (data.executor)
            this.executor = new Participant(data.executor);
        this.easdNumber = data.easdNumber;
        if (data.inputLetter)
            this.inputLetter = new InputLetter(data.inputLetter);
        this.answer = data.answer;
        this.prilojenie = data.prilojenie;
        this.topic = data.topic;
        if (data.tags)
            this.tags = new Tags(data.tags);
        this.note = data.note;
        this.reserve = data.reserve;
        this.file = data.file;
    }

    static changeEventName = "outputLetterChanged";

    static locale = {
        id:"Id",
        year:"Год",
        numberIVC:"Номер ИВЦ ЖА",
        createDate:"Дата создания",
        registrationDate:"Дата регистрации",
        documentDate:"Дата письма",
        documentNumber:"Номер письма",
        documentName:"Название файла",
        documentType:"Тип документа",
        address:"Куда направлено",
        targetParticipant:"Кому направлено",
        signer:"Подписант",
        executor:"Исполнитель",
        easdNumber:"Номер ЕАСД",
        inputLetter:"Входящее письмо",
        answer:"Ответ на входящее",
        prilojenie:"Приложение",
        topic:"Тема",
        tags:"Теги",
        note:"Примечание",
        reserve:"Резерв",
        file:"Файл"
    }

    static tableCellsResolver = {
        createDate: function (td, letter) {
            if (letter.createDate)
                td.innerText = getDateFormat_dd_mm_yy(letter.createDate);
        },
        registrationDate: function (td, letter) {
            if (letter.registrationDate)
                td.innerText = getDateFormat_dd_mm_yy(letter.registrationDate);
        },
        documentDate: function (td, letter) {
            if (letter.documentDate)
                td.innerText = getDateFormat_dd_mm_yy(letter.documentDate);
        },
        documentName: function (td, letter) {
            if (letter.documentName)
                td.innerText = letter.documentName;
        },
        documentType: function (td, letter) {
            if (letter.documentType)
                td.innerText = letter.documentType.name;
        },
        targetParticipant: function (td, letter) {
            if (td.innerText)
                td.innerText = letter.targetParticipant.initials;
        },
        address: function (td, letter) {
            if (letter.address)
                td.innerText = letter.address.shortName;
        },
        signer: function (td, letter) {
            if (letter.signer)
                td.innerText = letter.signer.initials;
        },
        executor: function (td, letter) {
            if (letter.executor)
                td.innerText = letter.executor.initials;
        },
        inputLetter: function (td, letter) {
            if (letter.inputLetter)
                td.innerText = letter.inputLetter.numberIVC;
        },
        answer: function (td, letter) {
            if (letter.answer === "true" || letter.answer === true) {
                td.innerText = "Да";
            } else {
                td.innerText = "Нет";
            }
        },
        reserve: function (td, letter) {
            if (letter.reserve === "true" || letter.reserve === true) {
                td.innerText = "Да";
            } else {
                td.innerText = "Нет";
            }
        },
        tags: function (td, letter) {
            if (!letter.tags)
                return;
            let string = "";
            letter.tags.array.forEach(tag => {
                string += tag.text + ", ";
            })
            if (letter.tags.array.length > 0) {
                string = string.substring(0, string.length - 2);
            }
            td.innerText = string;
        },
        file: function (td, letter) {
            const aEl = document.createElement("a");
            aEl.href = BACKEND_API_URL + `/api/outputLetters/${letter.id}/file`;
            aEl.innerHTML = letter.documentName;
            td.appendChild(aEl);
        }
    }

    async editFormInstance() {

        let inputLetterOptions = '';
        if (this.inputLetter) {
            inputLetterOptions += `<option value="${this.inputLetter.id}">${this.inputLetter.numberIVC}</option>`;
        }
        else {
            inputLetterOptions += `<option value="0">Не выбрано</option>`;
        }

        let documentTypeOptions = '';
        documentTypeOptions += `<option value="" selected>Не выбрано</option>`;
        documentTypes.forEach((dt) => {
            if (this.documentType && dt.id === this.documentType.id) {
                documentTypeOptions += `<option value="${dt.id}" selected>${dt.name}</option>`;
            }
            else {
                documentTypeOptions += `<option value="${dt.id}">${dt.name}</option>`;
            }
        })

        let originAndAddressOptions = '';
        originAndAddressOptions += `<option value="" selected>Не выбрано</option>`;
        originsAndAddresses.forEach((oa) => {
            if (this.address && oa.id === this.address.id) {
                originAndAddressOptions += `<option value="${oa.id}" selected>${oa.shortName}</option>`;
            }
            else {
                originAndAddressOptions += `<option value="${oa.id}">${oa.shortName}</option>`;
            }
        })

        let signerOptions = '';
        signerOptions += `<option value="" selected>Не выбрано</option>`;
        workersSigners.forEach((sr) => {
            if (this.signer && sr.id === this.signer.id) {
                signerOptions += `<option value="${sr.id}" selected>${sr.initials}</option>`;
            }
            else {
                signerOptions += `<option value="${sr.id}">${sr.initials}</option>`;
            }
        })

        let executorOptions = '';
        executorOptions += `<option value="" selected>Не выбрано</option>`;
        participants.forEach((ex) => {
            if (this.executor && ex.id === this.executor.id) {
                executorOptions += `<option value="${ex.id}" selected>${ex.initials}</option>`;
            }
            else {
                executorOptions += `<option value="${ex.id}">${ex.initials}</option>`;
            }
        })

        let targetOptions = '';
        participants.forEach((target) => {
            if (this.targetParticipant && target.id !== this.targetParticipant.id) {
                targetOptions += `<option value="${target.id}" selected>${target.initials}</option>`;
            }
            else {
                targetOptions += `<option value="${target.id}">${target.initials}</option>`;
            }
        });

        let tagsOptions = '';
        tags.forEach((tag) => {
            if (!this.tags.array.some((t) => t.id === tag.id)) {
                tagsOptions += `<option value="${tag.id}">${tag.text}</option>`;
            }
            else {
                tagsOptions += `<option value="${tag.id}" selected>${tag.text}</option>`;
            }
        });


        let body = `
            <div class="fields">
                <div class="custom-input">
                        <label for="il-year">${InputLetter.locale.year}</label>
                        <input id="il-year" type="text" value="${this.year}">
                </div>
                <div class="custom-input">
                        <label for="il-numberIVC">${InputLetter.locale.numberIVC}</label>
                        <input id="il-numberIVC" type="text" value="${this.numberIVC}">
                </div>
                <div class="custom-input">
                    <label for="il-doc-num">${InputLetter.locale.documentNumber}</label>
                    <input id="il-doc-num" type="text" value="${this.documentNumber}">
                </div>
                <div class="custom-input">
                        <label for="il-easdNumber">${InputLetter.locale.easdNumber}</label>
                        <input id="il-easdNumber" type="text" value="${this.easdNumber}">
                </div>
                <div class="dividing-line dividing-up"></div>
                <div class="custom-checkbox">
                    <input id="il-is-answer" type="checkbox" ${this.answer ? 'checked' : ''}>
                    <label for="il-is-answer">${OutputLetter.locale.answer}</label>
                </div>
                <div class="field-answer-grid">
                    <div class="multiselect">
                        <label for="il-years">Год исходящего</label>
                        <select id="il-years" name="years" data-placeholder="Выберите год" data-search="false" data-select-all="true" multiple data-multi-select disabled>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                            <option value="2021">2021</option>
                            <option value="2020">2020</option>
                            <option value="2019">2019</option>
                            <option value="2018">2018</option>
                        </select>
                    </div>
                    <div class="multiselect">
                        <label for="il-months">Месяц исходящего</label>
                        <select id="il-months" name="months" data-placeholder="Выберите месяц" data-search="false" data-select-all="true" multiple data-multi-select disabled>
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
                        <label for="il-input-select">${OutputLetter.locale.inputLetter}</label>
                        <select name="doc-num" id="il-input-select" disabled>
                            ${inputLetterOptions}
                        </select>
                    </div>
                </div>
                <div class="dividing-line dividing-up"></div>
                <div class="custom-date">
                    <label for="il-create-date">${OutputLetter.locale.createDate}</label>
                    <div class="field-container">
                        <input id="il-create-date" type="date" value="${this.createDate ? getDateFormat_yy_mm_dd(this.createDate) : null}"/>
                    </div>
                </div>
                <div class="custom-date">
                    <label for="il-registration-date">${OutputLetter.locale.registrationDate}</label>
                    <div class="field-container">
                        <input id="il-registration-date" type="date" value="${this.registrationDate ? getDateFormat_yy_mm_dd(this.registrationDate) : null}"/>
                        <p id="registration-date-auto-insert-info" class="auto-insert-value" hidden>автоматическая вставка значения</p>
                    </div>
                </div>
                <div class="custom-date">
                    <label for="il-date-doc">${OutputLetter.locale.documentDate}</label>
                    <input id="il-date-doc" type="date" value="${this.documentDate ? getDateFormat_yy_mm_dd(this.documentDate) : null}"/>
                </div>
                <div class="custom-select">
                    <label for="il-doc-type-select">${OutputLetter.locale.documentType}</label>
                    <select name="doc-type" id="il-doc-type-select">
                        ${documentTypeOptions}
                    </select>
                </div>
                <div class="custom-select">
                    <label for="il-address-select">${OutputLetter.locale.address}</label>
                    <select name="addresses" id="il-address-select">
                        ${originAndAddressOptions}
                    </select>
                </div>
                <div class="custom-select">
                    <label for="il-target-select">${OutputLetter.locale.targetParticipant}</label>
                    <select name="targets" id="il-target-select">
                        ${targetOptions}
                    </select>
                </div>
                <div class="custom-select">
                    <label for="il-signer-select">${OutputLetter.locale.signer}</label>
                    <select name="signers" id="il-signer-select">
                        ${signerOptions}
                    </select>
                </div>
                <div class="custom-select">
                    <label for="il-executor-select">${OutputLetter.locale.executor}</label>
                    <select name="executors" id="il-executor-select">
                        ${executorOptions}
                    </select>
                </div>
                <div class="multiselect">
                    <label for="il-tags">${OutputLetter.locale.tags}</label>
                    <select id="il-tags" name="tags" multiple data-multi-select>
                        ${tagsOptions}
                    </select>
                </div>
                <div class="custom-textarea text-area-small">
                    <label for="il-topic">${OutputLetter.locale.topic}</label>
                    <textarea id="il-topic">${this.topic}</textarea>
                </div>
                <div class="custom-textarea">
                    <label for="il-note">${OutputLetter.locale.note}</label>
                    <textarea id="il-note">${this.note}</textarea>
                </div>
                <div class="custom-checkbox">
                    <input id="il-prilojenie" type="checkbox" ${this.prilojenie ? 'checked' : ''}>
                    <label for="il-prilojenie">${OutputLetter.locale.prilojenie}</label>
                </div>
                <div class="custom-checkbox">
                    <input id="il-reserve" type="checkbox" ${this.reserve ? 'checked' : ''}>
                    <label for="il-reserve">${OutputLetter.locale.reserve}</label>
                </div>
                <div class="dividing-line dividing-up"></div>
                <div id="il-file-uploader"></div>
            </div>
        `;

        const bodyWrapper = document.createElement("div");
        bodyWrapper.innerHTML = body;

        bodyWrapper.querySelectorAll("select, input, textarea").forEach((el) => {
            const persistedValue = el.value;
            el.oninput = () => {
                if (persistedValue !== el.value) {
                    el.classList.add("field-changed");
                }
                else {
                    el.classList.remove("field-changed");
                }
            }
        })

        bodyWrapper.querySelectorAll("input[type=\"checkbox\"]").forEach((el) => {
            const persistedValue = el.checked;
            el.oninput = () => {
                if (persistedValue !== el.checked) {
                    el.classList.add("field-changed");
                }
                else {
                    el.classList.remove("field-changed");
                }
            }
        })

        const tagsMultiSelectModal = new MultiSelect(bodyWrapper.querySelector("#il-tags"));

        const inputSelect = bodyWrapper.querySelector("#il-input-select");
        const yearMultiSelect = new MultiSelect(bodyWrapper.querySelector("#il-years"), {
            onChange: function(value, text, element) {
                onInputYearOrMonthChange(inputSelect, yearMultiSelect, monthMultiSelect);
            }
        });
        const monthMultiSelect = new MultiSelect(bodyWrapper.querySelector("#il-months"), {
            onChange: function(value, text, element) {
                onInputYearOrMonthChange(inputSelect, yearMultiSelect, monthMultiSelect);
            }
        });

        bodyWrapper.querySelector("#il-is-answer").onchange = (e) => {
            if (e.target.checked) {
                monthMultiSelect.disabled = false;
                yearMultiSelect.disabled = false;
            }
            else {
                monthMultiSelect.disabled = true;
                yearMultiSelect.disabled = true;
            }
        }

        const fileUploader = new FileUploader(bodyWrapper.querySelector("#il-file-uploader"));
        if (this.documentName) {
            try {
                const file = await getOutputLetterFileById(this.id, this.documentName)
                if (file) {
                    fileUploader.file = file;
                }
            }
            catch (e) {
                console.error(e);
            }
        }

        let footer = `
            <button class="letter-save-btn">
                Сохранить изменения
            </button>
        `;

        const footerWrapper = document.createElement("div");
        footerWrapper.innerHTML = footer;

        const modal = new Modal({headerName:"Редактирование исходящего письма", body:bodyWrapper, footer:footerWrapper});

        footerWrapper.querySelector(".letter-save-btn").onclick = async () => {
            const clonedLetter = {...this};

            clonedLetter.year = bodyWrapper.querySelector("#il-year").value;
            clonedLetter.numberIVC = bodyWrapper.querySelector("#il-numberIVC").value;
            clonedLetter.documentNumber = bodyWrapper.querySelector("#il-doc-num").value;
            clonedLetter.easdNumber = bodyWrapper.querySelector("#il-easdNumber").value;
            clonedLetter.answer = bodyWrapper.querySelector("#il-is-answer").checked;
            clonedLetter.inputLetter = {id:inputSelect.value};
            clonedLetter.createDate = bodyWrapper.querySelector("#il-create-date").value;
            clonedLetter.registrationDate = bodyWrapper.querySelector("#il-registration-date").value;
            clonedLetter.documentDate = bodyWrapper.querySelector("#il-date-doc").value;
            clonedLetter.documentType = {id:bodyWrapper.querySelector("#il-doc-type-select").value};
            clonedLetter.documentName = fileUploader.file ? fileUploader.file.name : null;
            clonedLetter.address = {id:bodyWrapper.querySelector("#il-address-select").value};
            clonedLetter.targetParticipant = {id:bodyWrapper.querySelector("#il-target-select").value};
            clonedLetter.signer = {id:bodyWrapper.querySelector("#il-signer-select").value};
            clonedLetter.executor = {id:bodyWrapper.querySelector("#il-executor-select").value};
            clonedLetter.tags = new Tags(tagsMultiSelectModal.selectedValues);
            clonedLetter.topic = bodyWrapper.querySelector("#il-topic").value;
            clonedLetter.note = bodyWrapper.querySelector("#il-note").value;
            clonedLetter.prilojenie = bodyWrapper.querySelector("#il-prilojenie").checked;
            clonedLetter.reserve = bodyWrapper.querySelector("#il-reserve").checked;
            clonedLetter.file = fileUploader.file ? fileUploader.file : null;

            try {
                const returnedLetter  = await saveOrUpdateOutputLetter(clonedLetter);

                modal.close();
                informerStatus200Instance(5, "Письмо было изменено");

                Object.assign(this, returnedLetter);

                EventEmitter.dispatch(OutputLetter.changeEventName, this);
            }
            catch (e) {
                console.error(e.stack);
                informerStatusNot200Instance(30, "Не получилось изменить письмо", e.message);
            }
        }
    }
}

class OriginAndAddress {
    id;
    name = "";
    shortName = "";
    kodADM;

    constructor(origin) {
        this.id = origin.id;
        this.name = origin.name;
        if (origin.shortName)
            this.shortName = origin.shortName;
        this.kodADM = origin.kodADM;
    }

    compare(another) {
        if (!(another instanceof OriginAndAddress)) {
            return -1;
        }
        return this.shortName.localeCompare(another.shortName);
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
                        <div class="field-container">
                            <input id="origin-address-name" type="text">
                            <p id="origin-address-name-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-input">
                        <label for="origin-address-shortname">${this.locale.shortName}</label>
                        <div class="field-container">
                            <input id="origin-address-shortname" type="text">
                            <p id="origin-address-shortname-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-input">
                        <label for="origin-address-kodadm">${this.locale.kodADM}</label>
                        <div class="field-container">
                            <input id="origin-address-kodadm" type="text">
                            <p id="origin-address-kodadm-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
                        </div>
                </div>
            </div>
        `;
        const bodyWrapper = document.createElement("div");
        bodyWrapper.innerHTML = body;

        let footer = `
            <button class="letter-save-btn">
                Создать
            </button>
        `;
        const footerWrapper = document.createElement("div");
        footerWrapper.innerHTML = footer;

        const modal = new Modal({headerName:"Создание источника/адреса", body:bodyWrapper, footer:footerWrapper});

        const nameInput = bodyWrapper.querySelector("#origin-address-name");
        const shortNameInput = bodyWrapper.querySelector("#origin-address-shortname");
        const kodADMInput = bodyWrapper.querySelector("#origin-address-kodadm");
        nameInput.oninput = () => {
            nameInput.removeAttribute("empty");
        }
        shortNameInput.oninput = () => {
            shortNameInput.removeAttribute("empty");
        }
        kodADMInput.oninput = () => {
            kodADMInput.removeAttribute("empty");
        }
        footerWrapper.querySelector(".letter-save-btn").onclick = async () => {


            let notOkay = false;

            if (!nameInput.value) {
                nameInput.setAttribute("empty", "");
                notOkay = true;
            }
            if (!shortNameInput.value) {
                shortNameInput.setAttribute("empty", "");
                notOkay = true;
            }
            if (!kodADMInput.value) {
                kodADMInput.setAttribute("empty", "");
                notOkay = true;
            }

            if (notOkay) {
                return;
            }

            try {
                await saveOriginAndAddress({
                    name: nameInput.value,
                    shortName: shortNameInput.value,
                    kodADM: kodADMInput.value
                })

                const event = new Event("originsAndAddressesChanged");
                document.dispatchEvent(event);

                modal.close();
                informerStatus200Instance(5, "Источник/Адрес был сохранён");
            }
            catch (e) {
                informerStatusNot200Instance(30, "Источник/Адрес не был сохранён", e.message);
                console.error(e.stack);
            }
        }
    }
}

class Participant {
    id;
    fullName = "";
    initials = "";
    post;
    canSign;

    constructor(participant) {
        this.id = participant.id;
        this.fullName = participant.fullName;
        if (participant.initials)
            this.initials = participant.initials;
        this.post = participant.post;
        this.canSign = participant.canSign;
    }

    compare(another) {
        if (!(another instanceof Participant)) {
            return -1;
        }
        return this.initials.localeCompare(another.initials);
    }

    static locale = {
        id:"Id",
        fullName:"ФИО",
        initials:"Фамилия, инициалы",
        post:"Должность",
        canSign:"Право подписи"
    }

    static createFormInstance(isSigner) {
        let body = `
            <div class="fields">
                <div class="custom-input">
                        <label for="participant-fullname">${this.locale.fullName}</label>
                        <div class="field-container">
                            <input id="participant-fullname" type="text">
                            <p id="participant-fullname-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-input">
                        <label for="participant-initials">${this.locale.initials}</label>
                        <div class="field-container">
                            <input id="participant-initials" type="text">
                            <p id="participant-initials-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-input">
                        <label for=participant-post">${this.locale.post}</label>
                        <div class="field-container">
                            <input id="participant-post" type="text">
                            <p id="participant-post-empty" class="under-attention under-attention-empty" hidden>поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-checkbox">
                    <input id="participant-cansign" type="checkbox" ${isSigner !== undefined && isSigner === true ? 'checked disabled' : ''}>
                    <label for="participant-cansign">${Participant.locale.canSign.toLowerCase()}</label>
                </div>
            </div>
        `;
        const bodyWrapper = document.createElement("div");
        bodyWrapper.innerHTML = body;

        let footer = `
            <button class="letter-save-btn">
                Создать
            </button>
        `;
        const footerWrapper = document.createElement("div");
        footerWrapper.innerHTML = footer;

        const modal = new Modal({headerName:"Создание подписанта/адресата/исполнителя", body:bodyWrapper, footer:footerWrapper});

        const nameInput = bodyWrapper.querySelector("#participant-fullname");
        const shortNameInput = bodyWrapper.querySelector("#participant-initials");
        const post = bodyWrapper.querySelector("#participant-post");
        const canSign = bodyWrapper.querySelector("#participant-cansign");
        nameInput.oninput = () => {
            nameInput.removeAttribute("empty");
        }
        shortNameInput.oninput = () => {
            shortNameInput.removeAttribute("empty");
        }
        post.oninput = () => {
            post.removeAttribute("empty");
        }
        footerWrapper.querySelector(".letter-save-btn").onclick = async () => {

            let notOkay = false;

            if (!nameInput.value) {
                nameInput.setAttribute("empty", "");
                notOkay = true;
            }
            if (!shortNameInput.value) {
                shortNameInput.setAttribute("empty", "");
                notOkay = true;
            }
            if (!post.value) {
                post.setAttribute("empty", "");
                notOkay = true;
            }

            if (notOkay) {
                return;
            }

            try {
                await saveParticipant(new Participant({
                    fullName: nameInput.value,
                    initials: shortNameInput.value,
                    post: post.value,
                    canSign: canSign.checked
                }))

                const event = new Event("participantsChanged");
                document.dispatchEvent(event);

                if (canSign.checked) {
                    const eventSigners = new Event("participantSignersChanged");
                    document.dispatchEvent(eventSigners);
                }

                modal.close();
                informerStatus200Instance(5, "Подписант/адресат/исполнитель был сохранён");
            }
            catch (e) {
                informerStatusNot200Instance(30, "Подписант/адресат/исполнитель не был сохранён", e.message);
                console.error(e.stack);
            }
        }
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
        if (worker.initials)
            this.initials = worker.initials;
        this.post = worker.post;
        this.canSign = worker.canSign;
        this.workgroupId = worker.workgroupId;
        this.workgroupName = worker.workgroupName;
    }
    compare(another) {
        if (!(another instanceof Worker)) {
            return -1;
        }
        return this.initials.localeCompare(another.initials);
    }

    static locale = {
        id:"Id",
        fullName:"ФИО",
        initials:"Фамилия, инициалы",
        post:"Должность",
        canSign:"Право подписи",
        workgroupId:"Id рабочей группы",
        workgroupName:"Название рабочей группы"
    }

    static createFormInstance(isSigner) {
        let body = `
            <div class="fields">
                <div class="custom-input">
                        <label for="worker-fullname">${this.locale.fullName}</label>
                        <div class="field-container">
                            <input id="worker-fullname" type="text">
                            <p id="worker-fullname-empty" class="under-attention" hidden>поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-input">
                        <label for="worker-initials">${this.locale.initials}</label>
                        <div class="field-container">
                            <input id="worker-initials" type="text">
                            <p id="worker-initials-empty" class="under-attention" hidden>поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-input">
                        <label for=worker-post">${this.locale.post}</label>
                        <div class="field-container">
                            <input id="worker-post" type="text">
                            <p id="worker-post-empty" class="under-attention" hidden>поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-checkbox">
                    <input id="worker-cansign" type="checkbox" ${isSigner !== undefined && isSigner === true ? 'checked disabled' : ''}>
                    <label for="worker-cansign">${Worker.locale.canSign.toLowerCase()}</label>
                </div>
            </div>
        `;
        const bodyWrapper = document.createElement("div");
        bodyWrapper.innerHTML = body;

        let footer = `
            <button class="letter-save-btn">
                Создать
            </button>
        `;
        const footerWrapper = document.createElement("div");
        footerWrapper.innerHTML = footer;

        const modal = new Modal({headerName:"Создание Сотрудника отдела", body:bodyWrapper, footer:footerWrapper});

        const nameInput = bodyWrapper.querySelector("#worker-fullname");
        const shortNameInput = bodyWrapper.querySelector("#worker-initials");
        const post = bodyWrapper.querySelector("#worker-post");
        const canSign = bodyWrapper.querySelector("#worker-cansign");
        nameInput.oninput = () => {
            bodyWrapper.querySelector("#worker-fullname-empty").hidden = true;
        }
        shortNameInput.oninput = () => {
            bodyWrapper.querySelector("#worker-initials-empty").hidden = true;
        }
        post.oninput = () => {
            bodyWrapper.querySelector("#worker-post-empty").hidden = true;
        }
        footerWrapper.querySelector(".letter-save-btn").onclick = async () => {

            let notOkay = false;

            if (!nameInput.value) {
                bodyWrapper.querySelector("#worker-fullname-empty").hidden = false;
                notOkay = true;
            }
            if (!shortNameInput.value) {
                bodyWrapper.querySelector("#worker-initials-empty").hidden = false;
                notOkay = true;
            }
            if (!post.value) {
                bodyWrapper.querySelector("#worker-post-empty").hidden = false;
                notOkay = true;
            }

            if (notOkay) {
                return;
            }

            try {
                await saveParticipant(new Participant({
                    fullName: nameInput.value,
                    initials: shortNameInput.value,
                    post: post.value,
                    canSign: canSign.checked
                }))

                const event = new Event("participantsChanged");
                document.dispatchEvent(event);

                if (canSign.checked) {
                    const eventSigners = new Event("participantSignersChanged");
                    document.dispatchEvent(eventSigners);
                }



                modal.close();
                informerStatus200Instance(5, "Подписант/адресат/исполнитель был сохранён");
            }
            catch (e) {
                informerStatusNot200Instance(30, "Подписант/адресат/исполнитель не был сохранён", e.message);
                console.error(e.stack);
            }
        }
    }
}

class DocumentType {

    id;
    name = "";

    constructor(documentType) {
        this.id = documentType.id;
        if (documentType.name)
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

    compare(another) {
        if (!(another instanceof DocumentType)) {
            return -1;
        }
        return this.name.localeCompare(another.name);
    }
}

class Tags {

    array = [];

    constructor(tags) {
        if (!tags) {
            return;
        }
        if (!Array.isArray(tags)) {
            return;
        }
        if (tags.length === 0) {
            return;
        }

        if (typeof tags[0] === "object") {
            this.array = tags;
        }
        else {
            tags.forEach((el) => {
                this.array.push({id:el});
            })
        }
    }
    compare(another) {
        if (!(another instanceof Tags)) {
            return -1;
        }

        return this.array.length - another.array.length;
    }
}

class Tag {
    id;
    name;

    constructor(data) {
        this.id = data.id;
        this.name = data.name;
    }
}

class EventEmitter {

    static events = {};
    static subscribe(eventName, callback) {
        if(!EventEmitter.events[eventName]) {
            EventEmitter.events[eventName] = [];
        }

        EventEmitter.events[eventName].push(callback);

        return () => {
            EventEmitter.events[eventName] = EventEmitter.events[eventName].filter(callbackOnEvent => callback !== callbackOnEvent);
        }
    }

    static dispatch(eventName, data) {
        const event = EventEmitter.events[eventName];
        if(event) {
            event.forEach(callback => {
                callback.call(null, data);
            });
        }
    }
}