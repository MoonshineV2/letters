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

    static locale =   {
        id:"Id",
        year:"Год",
        numberIVC:"Номер ИВЦ ЖА",
        file:"Файл",
        registrationDate:"Дата регистрации",
        postuplenieDate:"Дата поступления",
        documentDate:"Дата письма",
        documentNumber:"Номер письма",
        documentName:"Название файла",
        documentType:"Тип письма",
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
        createDate:"Дата записи в БД"
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
                td.innerText = letter.outputLetter.documentNumber;
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
            if (letter.targetWorker)
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
            outputLetterOptions += `<option value="${this.outputLetter.id}">${this.outputLetter.documentNumber}</option>`;
        }
        else {
            outputLetterOptions += `<option value="0">Не выбрано</option>`;
        }

        let documentTypeOptions = '';
        if (this.documentType && this.documentType.id > 0) {
            documentTypeOptions += `<option value="${this.documentType.id}" selected>${this.documentType.name}</option>`;
            documentTypes.filter(el => el.id !== this.documentType.id).forEach((dt) => {
                documentTypeOptions += `<option value="${dt.id}">${dt.name}</option>`;
            });
        }
        else {
            documentTypeOptions += `<option value="" selected>Не выбрано</option>`;
            documentTypes.forEach((dt) => {
                documentTypeOptions += `<option value="${dt.id}">${dt.name}</option>`;
            });
        }

        let originAndAddressOptions = '';
        if (this.origin && this.origin.id > 0) {
            originAndAddressOptions += `<option value="${this.origin.id}" selected>${this.origin.shortName}</option>`;
            originsAndAddresses.filter(el => el.id !== this.origin.id).forEach((oa) => {
                originAndAddressOptions += `<option value="${oa.id}">${oa.shortName}</option>`;
            });
        }
        else {
            originAndAddressOptions += `<option value="" selected>Не выбрано</option>`;
            originsAndAddresses.forEach((oa) => {
                originAndAddressOptions += `<option value="${oa.id}">${oa.shortName}</option>`;
            });
        }

        let signerOptions = '';
        if (this.signer && this.signer.id > 0) {
            signerOptions += `<option value="${this.signer.id}" selected>${this.signer.initials}</option>`;
            participantSigners.filter(el => el.id !== this.signer.id).forEach((sr) => {
                signerOptions += `<option value="${sr.id}">${sr.initials}</option>`;
            });
        }
        else {
            signerOptions += `<option value="" selected disabled hidden>Не выбрано</option>`;
            participantSigners.forEach((sr) => {
                signerOptions += `<option value="${sr.id}">${sr.initials}</option>`;
            });
        }

        let executorOptions = '';
        if (this.executor && this.executor.id > 0) {
            executorOptions += `<option value="${this.executor.id}" selected>${this.executor.initials}</option>`;
            participants.filter(el => el.id !== this.executor.id).forEach((ex) => {
                executorOptions += `<option value="${ex.id}">${ex.initials}</option>`;
            });
        }
        else {
            executorOptions += `<option value="" selected disabled hidden>Не выбрано</option>`;
            participants.forEach((ex) => {
                executorOptions += `<option value="${ex.id}">${ex.initials}</option>`;
            });
        }

        let targetOptions = '';
        if (this.targetWorker && this.targetWorker.id > 0) {
            targetOptions += `<option value="${this.targetWorker.id}" selected>${this.targetWorker.initials}</option>`;
            workers.filter(el => el.id !== this.targetWorker.id).forEach((target) => {
                targetOptions += `<option value="${target.id}">${target.initials}</option>`;
            });
        }
        else {
            executorOptions += `<option value="" selected disabled hidden>Не выбрано</option>`;
            workers.forEach((target) => {
                targetOptions += `<option value="${target.id}">${target.initials}</option>`;
            });
        }

        let tagsOptions = '';
        this.tags.array.forEach(selected => {
            tagsOptions += `<option value="${selected.id}" selected>${selected.text}</option>`;
        })
        tags.filter(el => !this.tags.array.some((t) => t.id === el.id)).forEach((tag) => {
            tagsOptions += `<option value="${tag.id}">${tag.text}</option>`;
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
                        <select id="il-years" name="years" data-placeholder="Выберите год" data-search="false" data-select-all="true" multiple data-multi-select ${!this.answer ? 'disabled' : ''}>
                        </select>
                    </div>
                    <div class="multiselect">
                        <label for="il-months">Месяц исходящего</label>
                        <select id="il-months" name="months" data-placeholder="Выберите месяц" data-search="false" data-select-all="true" multiple data-multi-select ${!this.answer ? 'disabled' : ''}>
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
                        <label for="il-output-select">Номер исходящего (номер письма)</label>
                        <select name="doc-num" id="il-output-select" disabled>
                            ${outputLetterOptions}
                        </select>
                    </div>
                </div>
                <div class="dividing-line dividing-up"></div>
                <div class="custom-date">
                    <label for="il-create-date">${InputLetter.locale.createDate}</label>
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

        generateYears(bodyWrapper.querySelector("#il-years"), 2017);

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
        const yearMultiSelect = new SingleSelect(bodyWrapper.querySelector("#il-years"), {
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
            this.executor = new Worker(data.executor);
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

    compare(another) {
        if (!(another instanceof OutputLetter)) {
            return -1;
        }
        return this.id - another.id;
    }

    static changeEventName = "outputLetterChanged";

    static locale = {
        id:"Id",
        year:"Год",
        numberIVC:"Номер ИВЦ ЖА",
        file:"Файл",
        registrationDate:"Дата регистрации",
        documentDate:"Дата письма",
        documentNumber:"Номер письма",
        documentName:"Название файла",
        documentType:"Тип письма",
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
        createDate:"Дата записи в БД"
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
            if (letter.targetParticipant)
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
        if (this.documentType && this.documentType.id > 0) {
            documentTypeOptions += `<option value="${this.documentType.id}" selected>${this.documentType.name}</option>`;
            documentTypes.filter(el => el.id !== this.documentType.id).forEach((dt) => {
                documentTypeOptions += `<option value="${dt.id}">${dt.name}</option>`;
            });
        }
        else {
            documentTypeOptions += `<option value="" selected>Не выбрано</option>`;
            documentTypes.forEach((dt) => {
                documentTypeOptions += `<option value="${dt.id}">${dt.name}</option>`;
            });
        }

        let originAndAddressOptions = '';
        if (this.address && this.address.id > 0) {
            originAndAddressOptions += `<option value="${this.address.id}" selected>${this.address.name}</option>`;
            originsAndAddresses.filter(el => el.id !== this.address.id).forEach((oa) => {
                originAndAddressOptions += `<option value="${oa.id}">${oa.shortName}</option>`;
            });
        }
        else {
            originAndAddressOptions += `<option value="" selected>Не выбрано</option>`;
            originsAndAddresses.forEach((oa) => {
                originAndAddressOptions += `<option value="${oa.id}">${oa.shortName}</option>`;
            });
        }

        let signerOptions = '';
        if (this.signer && this.signer.id > 0) {
            signerOptions += `<option value="${this.signer.id}" selected>${this.signer.initials}</option>`;
            workersSigners.filter(el => el.id !== this.signer.id).forEach((sr) => {
                signerOptions += `<option value="${sr.id}">${sr.initials}</option>`;
            });
        }
        else {
            signerOptions += `<option value="" selected>Не выбрано</option>`;
            workersSigners.forEach((sr) => {
                signerOptions += `<option value="${sr.id}">${sr.initials}</option>`;
            });
        }

        let executorOptions = '';
        if (this.executor && this.executor.id > 0) {
            executorOptions += `<option value="${this.executor.id}" selected>${this.executor.initials}</option>`;
            workers.filter(el => el.id !== this.executor.id).forEach((ex) => {
                executorOptions += `<option value="${ex.id}">${ex.initials}</option>`;
            });
        }
        else {
            executorOptions += `<option value="" selected>Не выбрано</option>`;
            workers.forEach((ex) => {
                executorOptions += `<option value="${ex.id}">${ex.initials}</option>`;
            });
        }

        let targetOptions = '';
        if (this.targetParticipant && this.targetParticipant.id > 0) {
            targetOptions += `<option value="${this.targetParticipant.id}" selected>${this.targetParticipant.initials}</option>`;
            participants.filter(el => el.id !== this.targetParticipant.id).forEach((target) => {
                targetOptions += `<option value="${target.id}">${target.initials}</option>`;
            });
        }
        else {
            targetOptions += `<option value="" selected>Не выбрано</option>`;
            participants.forEach((target) => {
                targetOptions += `<option value="${target.id}">${target.initials}</option>`;
            });
        }

        let tagsOptions = '';
        this.tags.array.forEach(selected => {
            tagsOptions += `<option value="${selected.id}" selected>${selected.text}</option>`;
        })
        tags.filter(el => !this.tags.array.some((t) => t.id === el.id)).forEach((tag) => {
            tagsOptions += `<option value="${tag.id}">${tag.text}</option>`;
        });

        let body = `
            <div class="fields">
                <div class="custom-input">
                        <label for="ol-year">${OutputLetter.locale.year}</label>
                        <input id="ol-year" type="text" value="${this.year}">
                </div>
                <div class="custom-input">
                        <label for="ol-numberIVC">${OutputLetter.locale.numberIVC}</label>
                        <input id="ol-numberIVC" type="text" value="${this.numberIVC}">
                </div>
                <div class="custom-input">
                    <label for="ol-doc-num">${OutputLetter.locale.documentNumber}</label>
                    <input id="ol-doc-num" type="text" value="${this.documentNumber}">
                </div>
                <div class="custom-input">
                        <label for="ol-easdNumber">${OutputLetter.locale.easdNumber}</label>
                        <input id="ol-easdNumber" type="text" value="${this.easdNumber}">
                </div>
                <div class="dividing-line dividing-up"></div>
                <div class="custom-checkbox">
                    <input id="ol-is-answer" type="checkbox" ${this.answer ? 'checked' : ''}>
                    <label for="ol-is-answer">${OutputLetter.locale.answer}</label>
                </div>
                <div class="field-answer-grid">
                    <div class="multiselect">
                        <label for="ol-years">Год исходящего</label>
                        <select id="ol-years" name="years" data-placeholder="Выберите год" data-search="false" data-select-all="true" multiple data-multi-select disabled>
                        </select>
                    </div>
                    <div class="multiselect">
                        <label for="ol-months">Месяц исходящего</label>
                        <select id="ol-months" name="months" data-placeholder="Выберите месяц" data-search="false" data-select-all="true" multiple data-multi-select disabled>
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
                        <label for="ol-input-select">${OutputLetter.locale.inputLetter} (номер ИВЦ ЖА)</label>
                        <select name="doc-num" id="ol-input-select" disabled>
                            ${inputLetterOptions}
                        </select>
                    </div>
                </div>
                <div class="dividing-line dividing-up"></div>
                <div class="custom-date">
                    <label for="ol-create-date">${OutputLetter.locale.createDate}</label>
                    <div class="field-container">
                        <input id="ol-create-date" type="date" value="${this.createDate ? getDateFormat_yy_mm_dd(this.createDate) : null}"/>
                    </div>
                </div>
                <div class="custom-date">
                    <label for="ol-registration-date">${OutputLetter.locale.registrationDate}</label>
                    <div class="field-container">
                        <input id="ol-registration-date" type="date" value="${this.registrationDate ? getDateFormat_yy_mm_dd(this.registrationDate) : null}"/>
                        <p id="registration-date-auto-insert-info" class="auto-insert-value" hidden>автоматическая вставка значения</p>
                    </div>
                </div>
                <div class="custom-date">
                    <label for="ol-date-doc">${OutputLetter.locale.documentDate}</label>
                    <input id="ol-date-doc" type="date" value="${this.documentDate ? getDateFormat_yy_mm_dd(this.documentDate) : null}"/>
                </div>
                <div class="custom-select">
                    <label for="ol-doc-type-select">${OutputLetter.locale.documentType}</label>
                    <select name="doc-type" id="ol-doc-type-select">
                        ${documentTypeOptions}
                    </select>
                </div>
                <div class="custom-select">
                    <label for="ol-address-select">${OutputLetter.locale.address}</label>
                    <select name="addresses" id="ol-address-select">
                        ${originAndAddressOptions}
                    </select>
                </div>
                <div class="custom-select">
                    <label for="ol-target-select">${OutputLetter.locale.targetParticipant}</label>
                    <select name="targets" id="ol-target-select">
                        ${targetOptions}
                    </select>
                </div>
                <div class="custom-select">
                    <label for="ol-signer-select">${OutputLetter.locale.signer}</label>
                    <select name="signers" id="ol-signer-select">
                        ${signerOptions}
                    </select>
                </div>
                <div class="custom-select">
                    <label for="ol-executor-select">${OutputLetter.locale.executor}</label>
                    <select name="executors" id="ol-executor-select">
                        ${executorOptions}
                    </select>
                </div>
                <div class="multiselect">
                    <label for="ol-tags">${OutputLetter.locale.tags}</label>
                    <select id="ol-tags" name="tags" multiple data-multi-select>
                        ${tagsOptions}
                    </select>
                </div>
                <div class="custom-textarea text-area-small">
                    <label for="ol-topic">${OutputLetter.locale.topic}</label>
                    <textarea id="ol-topic">${this.topic}</textarea>
                </div>
                <div class="custom-textarea">
                    <label for="ol-note">${OutputLetter.locale.note}</label>
                    <textarea id="ol-note">${this.note}</textarea>
                </div>
                <div class="custom-checkbox">
                    <input id="ol-prilojenie" type="checkbox" ${this.prilojenie ? 'checked' : ''}>
                    <label for="ol-prilojenie">${OutputLetter.locale.prilojenie}</label>
                </div>
                <div class="custom-checkbox">
                    <input id="ol-reserve" type="checkbox" ${this.reserve ? 'checked' : ''}>
                    <label for="ol-reserve">${OutputLetter.locale.reserve}</label>
                </div>
                <div class="dividing-line dividing-up"></div>
                <div id="ol-file-uploader"></div>
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

        generateYears(bodyWrapper.querySelector("#ol-years"), 2017);

        const tagsMultiSelectModal = new MultiSelect(bodyWrapper.querySelector("#ol-tags"));

        const inputSelect = bodyWrapper.querySelector("#ol-input-select");
        const yearMultiSelect = new SingleSelect(bodyWrapper.querySelector("#ol-years"), {
            onChange: function(value, text, element) {
                onInputYearOrMonthChange(inputSelect, yearMultiSelect, monthMultiSelect);
            }
        });
        const monthMultiSelect = new MultiSelect(bodyWrapper.querySelector("#ol-months"), {
            onChange: function(value, text, element) {
                onInputYearOrMonthChange(inputSelect, yearMultiSelect, monthMultiSelect);
            }
        });

        bodyWrapper.querySelector("#ol-is-answer").onchange = (e) => {
            if (e.target.checked) {
                monthMultiSelect.disabled = false;
                yearMultiSelect.disabled = false;
            }
            else {
                monthMultiSelect.disabled = true;
                yearMultiSelect.disabled = true;
            }
        }

        const fileUploader = new FileUploader(bodyWrapper.querySelector("#ol-file-uploader"));
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

            clonedLetter.year = bodyWrapper.querySelector("#ol-year").value;
            clonedLetter.numberIVC = bodyWrapper.querySelector("#ol-numberIVC").value;
            clonedLetter.documentNumber = bodyWrapper.querySelector("#ol-doc-num").value;
            clonedLetter.easdNumber = bodyWrapper.querySelector("#ol-easdNumber").value;
            clonedLetter.answer = bodyWrapper.querySelector("#ol-is-answer").checked;
            clonedLetter.inputLetter = {id:inputSelect.value};
            clonedLetter.createDate = bodyWrapper.querySelector("#ol-create-date").value;
            clonedLetter.registrationDate = bodyWrapper.querySelector("#ol-registration-date").value;
            clonedLetter.documentDate = bodyWrapper.querySelector("#ol-date-doc").value;
            clonedLetter.documentType = {id:bodyWrapper.querySelector("#ol-doc-type-select").value};
            clonedLetter.documentName = fileUploader.file ? fileUploader.file.name : null;
            clonedLetter.address = {id:bodyWrapper.querySelector("#ol-address-select").value};
            clonedLetter.targetParticipant = {id:bodyWrapper.querySelector("#ol-target-select").value};
            clonedLetter.signer = {id:bodyWrapper.querySelector("#ol-signer-select").value};
            clonedLetter.executor = {id:bodyWrapper.querySelector("#ol-executor-select").value};
            clonedLetter.tags = new Tags(tagsMultiSelectModal.selectedValues);
            clonedLetter.topic = bodyWrapper.querySelector("#ol-topic").value;
            clonedLetter.note = bodyWrapper.querySelector("#ol-note").value;
            clonedLetter.prilojenie = bodyWrapper.querySelector("#ol-prilojenie").checked;
            clonedLetter.reserve = bodyWrapper.querySelector("#ol-reserve").checked;
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
    disabled;

    constructor(origin) {
        this.id = origin.id;
        this.name = origin.name;
        if (origin.shortName)
            this.shortName = origin.shortName;
        this.kodADM = origin.kodADM;
        this.disabled = origin.disabled;
    }

    static createEventName = "OriginAndAddressCreated";
    static changeEventName = "OriginAndAddressChanged";

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
        kodADM:"Код администрации",
        disabled:"Неактивен"
    }

    static tableCellsResolver = {
        disabled: function (td, letter) {
            td.innerText = letter.disabled ? "Да" : "Нет"
        }
    }

    static createFormInstance() {
        let body = `
            <div class="fields">
                <div class="custom-input">
                        <div class="field-container">
                            <label for="origin-address-name">${this.locale.name}</label>
                            <input id="origin-address-name" type="text">
                            <p id="origin-address-name-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-input">
                        <div class="field-container">
                            <label for="origin-address-shortname">${this.locale.shortName}</label>
                            <input id="origin-address-shortname" type="text">
                            <p id="origin-address-shortname-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-input">
                        <div class="field-container">
                            <label for="origin-address-kodadm">${this.locale.kodADM}</label>
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

        shortNameInput.oninput = () => {
            shortNameInput.removeAttribute("empty");
        }
        kodADMInput.oninput = () => {
            kodADMInput.removeAttribute("empty");
        }
        footerWrapper.querySelector(".letter-save-btn").onclick = async () => {


            let notOkay = false;

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
                const returned = await saveOrUpdateOriginAndAddress({
                    name: nameInput.value,
                    shortName: shortNameInput.value,
                    kodADM: kodADMInput.value
                })

                const event = new Event("originsAndAddressesChanged");
                document.dispatchEvent(event);

                EventEmitter.dispatch(OriginAndAddress.createEventName, returned);

                modal.close();
                informerStatus200Instance(5, "Источник/Адрес был сохранён");
            }
            catch (e) {
                informerStatusNot200Instance(30, "Источник/Адрес не был сохранён", e.message);
                console.error(e.stack);
            }
        }
    }

    async editFormInstance() {

        let body = `
            <div class="fields">
                <div class="custom-input">
                        <div class="field-container">
                            <label for="origin-address-name">${OriginAndAddress.locale.name}</label>
                            <input id="origin-address-name" type="text" value="${this.name}">
                            <p id="origin-address-name-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-input">
                        <div class="field-container">
                            <label for="origin-address-shortname">${OriginAndAddress.locale.shortName}</label>
                            <input id="origin-address-shortname" type="text" value="${this.shortName}">
                            <p id="origin-address-shortname-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-input">
                        <div class="field-container">
                            <label for="origin-address-kodadm">${OriginAndAddress.locale.kodADM}</label>
                            <input id="origin-address-kodadm" type="text" value="${this.kodADM}">
                            <p id="origin-address-kodadm-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-checkbox">
                    <input id="origin-address-disabled" type="checkbox" ${this.disabled ? "checked" : ""}>
                    <label for="origin-address-disabled">Неактивен</label>
                </div>
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

        let footer = `
            <button class="letter-save-btn">
                Сохранить изменения
            </button>
        `;

        const footerWrapper = document.createElement("div");
        footerWrapper.innerHTML = footer;

        const modal = new Modal({headerName:"Редактирование источника/адреса", body:bodyWrapper, footer:footerWrapper});

        footerWrapper.querySelector(".letter-save-btn").onclick = async () => {
            const clonedOriginAndAddress = {...this};

            clonedOriginAndAddress.name = bodyWrapper.querySelector("#origin-address-name").value;
            clonedOriginAndAddress.shortName = bodyWrapper.querySelector("#origin-address-shortname").value;
            clonedOriginAndAddress.kodADM = bodyWrapper.querySelector("#origin-address-kodadm").value;
            clonedOriginAndAddress.disabled = bodyWrapper.querySelector("#origin-address-disabled").checked;

            try {
                const returned  = await saveOrUpdateOriginAndAddress(clonedOriginAndAddress);

                modal.close();
                informerStatus200Instance(5, "Источник/адрес был изменён");

                Object.assign(this, returned);

                EventEmitter.dispatch(OriginAndAddress.changeEventName, this);
            }
            catch (e) {
                console.error(e.stack);
                informerStatusNot200Instance(30, "Не получилось изменить Источник/адрес", e.message);
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
    disabled;

    constructor(participant) {
        this.id = participant.id;
        this.fullName = participant.fullName;
        if (participant.initials)
            this.initials = participant.initials;
        this.post = participant.post;
        this.canSign = participant.canSign;
        this.disabled = participant.disabled;
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
        canSign:"Право подписи",
        disabled:"Неактивен"
    }

    static tableCellsResolver = {
        canSign: function (td, letter) {
            td.innerText = letter.canSign ? "Да" : "Нет"
        },
        disabled: function (td, letter) {
            td.innerText = letter.disabled ? "Да" : "Нет"
        }
    }

    static createEventName = "ParticipantCreated";
    static changeEventName = "ParticipantChanged";

    static createFormInstance(isSigner) {
        let body = `
            <div class="fields">
                <div class="custom-input">
                        <div class="field-container">
                            <label for="participant-fullname">${this.locale.fullName}</label>
                            <input id="participant-fullname" type="text">
                            <p id="participant-fullname-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-input"> 
                        <div class="field-container">
                            <label for="participant-initials">${this.locale.initials}</label>
                            <input id="participant-initials" type="text">
                            <p id="participant-initials-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-input">
                        <div class="field-container">
                            <label for=participant-post">${this.locale.post}</label>
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

        shortNameInput.oninput = () => {
            shortNameInput.removeAttribute("empty");
        }
        post.oninput = () => {
            post.removeAttribute("empty");
        }
        footerWrapper.querySelector(".letter-save-btn").onclick = async () => {

            let notOkay = false;

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
                const returned = await saveOrUpdateParticipant(new Participant({
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

                EventEmitter.dispatch(Participant.createEventName, returned);

                modal.close();
                informerStatus200Instance(5, "Подписант/адресат/исполнитель был сохранён");
            }
            catch (e) {
                informerStatusNot200Instance(30, "Подписант/адресат/исполнитель не был сохранён", e.message);
                console.error(e.stack);
            }
        }
    }

    async editFormInstance() {

        let body = `
            <div class="fields">
                <div class="custom-input">
                        <div class="field-container">
                            <label for="participant-fullname">${Participant.locale.fullName}</label>
                            <input id="participant-fullname" type="text" value="${this.fullName}">
                            <p id="participant-fullname-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-input"> 
                        <div class="field-container">
                            <label for="participant-initials">${Participant.locale.initials}</label>
                            <input id="participant-initials" type="text" value="${this.initials}">
                            <p id="participant-initials-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-input">
                        <div class="field-container">
                            <label for=participant-post">${Participant.locale.post}</label>
                            <input id="participant-post" type="text" value="${this.post}">
                            <p id="participant-post-empty" class="under-attention under-attention-empty" hidden>поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-checkbox">
                    <input id="participant-cansign" type="checkbox" ${this.canSign ? 'checked' : ""}>
                    <label for="participant-cansign">${Participant.locale.canSign.toLowerCase()}</label>
                </div>
                <div class="custom-checkbox">
                    <input id="worker-disabled" type="checkbox" ${this.disabled ? "checked" : ""}>
                    <label for="worker-disabled">Неактивен</label>
                </div>
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

        let footer = `
            <button class="letter-save-btn">
                Сохранить изменения
            </button>
        `;

        const footerWrapper = document.createElement("div");
        footerWrapper.innerHTML = footer;

        const modal = new Modal({headerName:"Редактирование подписанта/адресата/исполнителя", body:bodyWrapper, footer:footerWrapper});

        footerWrapper.querySelector(".letter-save-btn").onclick = async () => {
            const clonedParticipant = {...this};

            clonedParticipant.fullName = bodyWrapper.querySelector("#participant-fullname").value;
            clonedParticipant.initials = bodyWrapper.querySelector("#participant-initials").value;
            clonedParticipant.post = bodyWrapper.querySelector("#participant-post").value;
            clonedParticipant.canSign = bodyWrapper.querySelector("#participant-cansign").checked;
            clonedParticipant.disabled = bodyWrapper.querySelector("#worker-disabled").checked;

            try {
                const returned  = await saveOrUpdateParticipant(clonedParticipant);

                modal.close();
                informerStatus200Instance(5, "подписант/адресат/исполнитель был изменён");

                Object.assign(this, returned);

                EventEmitter.dispatch(Participant.changeEventName, this);
            }
            catch (e) {
                console.error(e.stack);
                informerStatusNot200Instance(30, "Не получилось изменить подписанта/адресата/исполнителя", e.message);
            }
        }
    }
}

class Worker {
    id;
    fullName;
    initials = "";
    post;
    canSign;
    workgroupId;
    workgroupName;
    disabled;

    constructor(worker) {
        this.id = worker.id;
        this.fullName = worker.fullName;
        if (worker.initials)
            this.initials = worker.initials;
        this.post = worker.post;
        this.canSign = worker.canSign;
        this.workgroupId = worker.workgroupId;
        this.workgroupName = worker.workgroupName;
        this.disabled = worker.disabled;
    }

    static changeEventName = "WorkerChanged";
    static createEventName = "WorkerCreated";

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
        workgroupName:"Название рабочей группы",
        disabled:"Неактивен"
    }

    static tableCellsResolver = {
        canSign: function (td, letter) {
            td.innerText = letter.canSign ? "Да" : "Нет"
        },
        disabled: function (td, letter) {
            td.innerText = letter.disabled ? "Да" : "Нет"
        }
    }

    static async createFormInstance(isSigner) {

        let body = `
            <div class="fields">
                <div class="custom-input">
                        <div class="field-container">
                            <label for="worker-fullname">${this.locale.fullName}</label>
                            <input id="worker-fullname" type="text">
                            <p id="worker-fullname-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-input">
                        <div class="field-container">
                            <label for="worker-initials">${this.locale.initials}</label>
                            <input id="worker-initials" type="text">
                            <p id="worker-initials-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-input">
                        <div class="field-container">
                            <label for="worker-post">${this.locale.post}</label>
                            <input id="worker-post" type="text">
                            <p id="worker-post-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-select">
                    <div class="field-container">
                        <label for="workgroup-select">Рабочая группа</label>
                        <select name="workgroups" id="workgroup-select">
                            <option value="" disabled selected hidden>Выберите вариант</option>
                        </select>
                        <p id="doc-type-select-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
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

        const workgroupSelect = bodyWrapper.querySelector("#workgroup-select");
        findWorkgroups().then(result => {
            result.forEach(wg => {
                const opt = document.createElement("option");
                opt.value = wg.id;
                opt.innerText = wg.name;
                workgroupSelect.appendChild(opt);
            })
        });

        let footer = `
            <button class="letter-save-btn">
                Создать
            </button>
        `;
        const footerWrapper = document.createElement("div");
        footerWrapper.innerHTML = footer;

        const modal = new Modal({headerName: "Создание Сотрудника отдела", body: bodyWrapper, footer: footerWrapper});

        const nameInput = bodyWrapper.querySelector("#worker-fullname");
        const shortNameInput = bodyWrapper.querySelector("#worker-initials");
        const post = bodyWrapper.querySelector("#worker-post");
        const canSign = bodyWrapper.querySelector("#worker-cansign");

        shortNameInput.oninput = () => {
            shortNameInput.removeAttribute("empty");
        }
        post.oninput = () => {
            post.removeAttribute("empty");
        }
        workgroupSelect.onchange = () => {
            workgroupSelect.removeAttribute("empty");
        }

        footerWrapper.querySelector(".letter-save-btn").onclick = async () => {

            let notOkay = false;

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
                const created = await saveOrUpdateWorker(new Worker({
                    fullName: nameInput.value,
                    initials: shortNameInput.value,
                    post: post.value,
                    canSign: canSign.checked,
                    workgroupId: workgroupSelect.value
                }))

                const event = new Event("WorkersChanged");
                document.dispatchEvent(event);

                EventEmitter.dispatch(Worker.createEventName, created);

                if (canSign.checked) {
                    const eventSigners = new Event("WorkerSignersChanged");
                    document.dispatchEvent(eventSigners);
                }


                modal.close();
                informerStatus200Instance(5, "Сотрудник отдела был сохранён");
            } catch (e) {
                informerStatusNot200Instance(30, "Сотрудник отдела не был сохранён", e.message);
                console.error(e.stack);
            }
        }
    }

    async editFormInstance() {

        let body = `
            <div class="fields">
                <div class="custom-input">
                        <div class="field-container">
                            <label for="worker-fullname">${Worker.locale.fullName}</label>
                            <input id="worker-fullname" type="text" value="${this.fullName}">
                            <p id="worker-fullname-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-input">
                        <div class="field-container">
                            <label for="worker-initials">${Worker.locale.initials}</label>
                            <input id="worker-initials" type="text" value="${this.initials}">
                            <p id="worker-initials-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-input">
                        <div class="field-container">
                            <label for="worker-post">${Worker.locale.post}</label>
                            <input id="worker-post" type="text" value="${this.post}">
                            <p id="worker-post-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-select">
                    <div class="field-container">
                        <label for="workgroup-select">Рабочая группа</label>
                        <select name="workgroups" id="workgroup-select">
                            <option value="" disabled selected hidden>Выберите вариант</option>
                        </select>
                        <p id="doc-type-select-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
                    </div>
                </div>
                <div class="custom-checkbox">
                    <input id="worker-cansign" type="checkbox" ${this.canSign ? "checked" : ""}>
                    <label for="worker-cansign">${Worker.locale.canSign.toLowerCase()}</label>
                </div>
                <div class="custom-checkbox">
                    <input id="worker-disabled" type="checkbox" ${this.disabled ? "checked" : ""}>
                    <label for="worker-disabled">Неактивен</label>
                </div>
            </div>
        `;

        const bodyWrapper = document.createElement("div");
        bodyWrapper.innerHTML = body;

        const workgroupSelect = bodyWrapper.querySelector("#workgroup-select");
        findWorkgroups().then(result => {
            result.forEach(wg => {
                const opt = document.createElement("option");
                opt.value = wg.id;
                opt.innerText = wg.name;
                workgroupSelect.appendChild(opt);
                if (wg.id === this.workgroupId) {
                    opt.selected = true;
                }
            })
        });

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

        let footer = `
            <button class="letter-save-btn">
                Сохранить изменения
            </button>
        `;

        const footerWrapper = document.createElement("div");
        footerWrapper.innerHTML = footer;

        const modal = new Modal({headerName:"Редактирование рабочей группы", body:bodyWrapper, footer:footerWrapper});

        footerWrapper.querySelector(".letter-save-btn").onclick = async () => {
            const clonedWorker = {...this};

            clonedWorker.fullName = bodyWrapper.querySelector("#worker-fullname").value;
            clonedWorker.initials = bodyWrapper.querySelector("#worker-initials").value;
            clonedWorker.post = bodyWrapper.querySelector("#worker-post").value;
            clonedWorker.workgroupId = bodyWrapper.querySelector("#workgroup-select").value;
            clonedWorker.canSign = bodyWrapper.querySelector("#worker-cansign").checked;
            clonedWorker.disabled = bodyWrapper.querySelector("#worker-disabled").checked;

            try {
                const returned  = await saveOrUpdateWorker(clonedWorker);

                modal.close();
                informerStatus200Instance(5, "Сотрудник отдела был изменён");

                Object.assign(this, returned);

                EventEmitter.dispatch(Worker.changeEventName, this);
            }
            catch (e) {
                console.error(e.stack);
                informerStatusNot200Instance(30, "Не получилось изменить сотрудника отдела", e.message);
            }
        }
    }
}

class DocumentType {

    id;
    name = "";
    disabled;

    constructor(documentType) {
        this.id = documentType.id;
        if (documentType.name)
            this.name = documentType.name;

        this.disabled = documentType.disabled;
    }

    static createEventName = "DocumentTypeCreated";
    static changeEventName = "DocumentTypeChanged";

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

    static locale = {
        id:"Id",
        name:"Название типа",
        disabled:"Неактивен"
    }

    static tableCellsResolver = {
        disabled: function (td, letter) {
            td.innerText = letter.disabled ? "Да" : "Нет"
        }
    }

    static createFormInstance() {
        let body = `
            <div class="fields">
                <div class="custom-input">
                        <div class="field-container">
                            <label for="doctype-name">Название типа письма</label>
                            <input id="doctype-name" type="text">
                            <p id="doctype-name-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
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

        const modal = new Modal({headerName:"Создание типа документа", body:bodyWrapper, footer:footerWrapper});

        const nameInput = bodyWrapper.querySelector("#doctype-name");

        nameInput.oninput = () => {
            nameInput.removeAttribute("empty");
        }

        footerWrapper.querySelector(".letter-save-btn").onclick = async () => {
            let notOkay = false;

            if (!nameInput.value) {
                nameInput.setAttribute("empty", "");
                notOkay = true;
            }

            if (notOkay) {
                return;
            }

            try {
                const created = await saveOrUpdateDocumentType({
                    name: nameInput.value
                })

                EventEmitter.dispatch(DocumentType.createEventName, created);

                modal.close();
                informerStatus200Instance(5, "Тип документа был сохранён");
            }
            catch (e) {
                informerStatusNot200Instance(30, "Тип документа не был сохранён", e.message);
                console.error(e.stack);
            }
        }
    }

    async editFormInstance() {

        let body = `
            <div class="fields">
                <div class="custom-input">
                        <label for="dt-name">Название типа письма</label>
                        <input id="dt-name" type="text" value="${this.name}">
                </div>
                <div class="custom-checkbox">
                    <input id="dt-disabled" type="checkbox" ${this.disabled ? "checked" : ""}>
                    <label for="dt-disabled">Неактивен</label>
                </div>
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

        let footer = `
            <button class="letter-save-btn">
                Сохранить изменения
            </button>
        `;

        const footerWrapper = document.createElement("div");
        footerWrapper.innerHTML = footer;

        const modal = new Modal({headerName:"Редактирование типа документа", body:bodyWrapper, footer:footerWrapper});

        footerWrapper.querySelector(".letter-save-btn").onclick = async () => {
            const clonedDocType = {...this};

            clonedDocType.name = bodyWrapper.querySelector("#dt-name").value;
            clonedDocType.disabled = bodyWrapper.querySelector("#dt-disabled").checked;

            try {
                const returnedDocType  = await saveOrUpdateDocumentType(clonedDocType);

                modal.close();
                informerStatus200Instance(5, "Тип документа был изменён");

                Object.assign(this, returnedDocType);

                EventEmitter.dispatch(DocumentType.changeEventName, this);
            }
            catch (e) {
                console.error(e.stack);
                informerStatusNot200Instance(30, "Не получилось изменить тип документа", e.message);
            }
        }
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
    text;
    disabled;

    constructor(data) {
        this.id = data.id;
        this.text = data.text;
        this.disabled = data.disabled;
    }

    static locale = {
        id:"Id",
        text:"Название тега",
        disabled:"Неактивен"
    }

    static tableCellsResolver = {
        disabled: function (td, letter) {
            td.innerText = letter.disabled ? "Да" : "Нет"
        }
    }

    static changeEventName = "tagChanged";
    static createEventName = "tagCreated";

    static createFormInstance() {
        let body = `
            <div class="fields">
                <div class="custom-input">
                        <div class="field-container">
                            <label for="tag-name">Название тега</label>
                            <input id="tag-name" type="text">
                            <p id="tag-name-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
                        </d/iv>
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

        const modal = new Modal({headerName:"Создание тега", body:bodyWrapper, footer:footerWrapper});

        const nameInput = bodyWrapper.querySelector("#tag-name");

        nameInput.oninput = () => {
            nameInput.removeAttribute("empty");
        }

        footerWrapper.querySelector(".letter-save-btn").onclick = async () => {
            let notOkay = false;

            if (!nameInput.value) {
                nameInput.setAttribute("empty", "");
                notOkay = true;
            }

            if (notOkay) {
                return;
            }

            try {
                const created = await saveOrUpdateTag({
                    text: nameInput.value
                })

                EventEmitter.dispatch(Tag.createEventName, created);

                modal.close();
                informerStatus200Instance(5, "Тег был сохранён");
            }
            catch (e) {
                informerStatusNot200Instance(30, "Тег не был сохранён", e.message);
                console.error(e.stack);
            }
        }
    }

    async editFormInstance() {

        let body = `
            <div class="fields">
                <div class="custom-input">
                        <label for="tag-name">Название тега</label>
                        <input id="tag-name" type="text" value="${this.text}">
                </div>
                <div class="custom-checkbox">
                    <input id="tag-disabled" type="checkbox" ${this.disabled ? "checked" : ""}>
                    <label for="tag-disabled">Неактивен</label>
                </div>
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

        let footer = `
            <button class="letter-save-btn">
                Сохранить изменения
            </button>
        `;

        const footerWrapper = document.createElement("div");
        footerWrapper.innerHTML = footer;

        const modal = new Modal({headerName:"Редактирование тега", body:bodyWrapper, footer:footerWrapper});

        footerWrapper.querySelector(".letter-save-btn").onclick = async () => {
            const clonedTag = {...this};

            clonedTag.text = bodyWrapper.querySelector("#tag-name").value;
            clonedTag.disabled = bodyWrapper.querySelector("#tag-disabled").checked;

            try {
                const returnedTag  = await saveOrUpdateTag(clonedTag);

                modal.close();
                informerStatus200Instance(5, "Тег был изменён");

                Object.assign(this, returnedTag);

                EventEmitter.dispatch(Tag.changeEventName, this);
            }
            catch (e) {
                console.error(e.stack);
                informerStatusNot200Instance(30, "Не получилось изменить тег", e.message);
            }
        }
    }

}

class Workgroup {
    id;
    name;
    leaderId;
    leaderName;
    disabled;

    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.leaderId = data.leaderId;
        this.leaderName = data.leaderName;
        this.disabled = data.disabled;
    }

    static locale = {
        id:"Id",
        name:"Название рабочей группы",
        leaderId:"Id лидера",
        leaderName:"Имя лидера",
        disabled:"Неактивен"
    }

    static tableCellsResolver = {
        disabled: function (td, letter) {
            td.innerText = letter.disabled ? "Да" : "Нет"
        }
    }

    static createEventName = "WorkgroupCreated"
    static changeEventName = "WorkgroupChanged";

    static createFormInstance() {
        let body = `
            <div class="fields">
                <div class="custom-input">
                        <div class="field-container">
                            <label for="wg-name">Название рабочей группы</label>
                            <input id="wg-name" type="text">
                            <p id="wg-name-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
                        </div>
                </div>
                <div class="custom-select">
                    <div class="field-container">
                        <label for="wg-leader-select">Руководитель рабочей группы</label>
                        <select name="leader" id="wg-leader-select">
                        </select>
                        <p id="wg-leader-empty" class="under-attention under-attention-empty">поле не может быть пустым</p>
                    </div>
                </div>
            </div>
        `;
        const bodyWrapper = document.createElement("div");
        bodyWrapper.innerHTML = body;

        const leaderSelect = bodyWrapper.querySelector("#wg-leader-select");
        findWorkers().then(result => {
            result.forEach(worker => {
                const opt = document.createElement("option");
                opt.value = worker.id;
                opt.innerText = worker.initials;
                leaderSelect.appendChild(opt);
            })
        });

        let footer = `
            <button class="letter-save-btn">
                Создать
            </button>
        `;
        const footerWrapper = document.createElement("div");
        footerWrapper.innerHTML = footer;

        const modal = new Modal({headerName:"Создание рабочей группы", body:bodyWrapper, footer:footerWrapper});

        const nameInput = bodyWrapper.querySelector("#wg-name");

        nameInput.oninput = () => {
            nameInput.removeAttribute("empty");
        }

        leaderSelect.oninput = () => {
            leaderSelect.removeAttribute("empty");
        }

        footerWrapper.querySelector(".letter-save-btn").onclick = async () => {
            let notOkay = false;

            if (!nameInput.value) {
                nameInput.setAttribute("empty", "");
                notOkay = true;
            }

            if (!leaderSelect.value) {
                leaderSelect.setAttribute("empty", "");
                notOkay = true;
            }

            if (notOkay) {
                return;
            }

            try {
                const created = await saveOrUpdateWorkgroup({
                    name: nameInput.value,
                    leaderId: leaderSelect.value
                })

                EventEmitter.dispatch(Workgroup.createEventName, created);

                modal.close();
                informerStatus200Instance(5, "Рабочая группа была сохранена");
            }
            catch (e) {
                informerStatusNot200Instance(30, "Рабочая группа не была сохранена", e.message);
                console.error(e.stack);
            }
        }
    }

    async editFormInstance() {

        let body = `
            <div class="fields">
                <div class="custom-input">
                        <label for="wg-name">Название рабочей группы</label>
                        <input id="wg-name" type="text" value="${this.name}">
                </div>
                <div class="custom-select">
                    <label for="wg-leader-select">Руководитель рабочей группы</label>
                    <select name="leader" id="wg-leader-select">
                    </select>
                </div>
                <div class="custom-checkbox">
                    <input id="wg-disabled" type="checkbox" ${this.disabled ? "checked" : ""}>
                    <label for="wg-disabled">Неактивен</label>
                </div>
            </div>
        `;

        const bodyWrapper = document.createElement("div");
        bodyWrapper.innerHTML = body;

        const leaderSelect = bodyWrapper.querySelector("#wg-leader-select");
        findWorkers().then(result => {
            result.forEach(worker => {
                const opt = document.createElement("option");
                opt.value = worker.id;
                opt.innerText = worker.initials;
                leaderSelect.appendChild(opt);
                if (worker.id === this.leaderId) {
                    opt.selected = true;
                }
            })
        });

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

        let footer = `
            <button class="letter-save-btn">
                Сохранить изменения
            </button>
        `;

        const footerWrapper = document.createElement("div");
        footerWrapper.innerHTML = footer;

        const modal = new Modal({headerName:"Редактирование рабочей группы", body:bodyWrapper, footer:footerWrapper});

        footerWrapper.querySelector(".letter-save-btn").onclick = async () => {
            const clonedWorkgroup = {...this};

            clonedWorkgroup.name = bodyWrapper.querySelector("#wg-name").value;
            clonedWorkgroup.leaderId = bodyWrapper.querySelector("#wg-leader-select").value;
            clonedWorkgroup.disabled = bodyWrapper.querySelector("#wg-disabled").checked;

            try {
                const returnedWorkgroup  = await saveOrUpdateWorkgroup(clonedWorkgroup);

                modal.close();
                informerStatus200Instance(5, "Рабочая группа была изменена");

                Object.assign(this, returnedWorkgroup);

                EventEmitter.dispatch(Workgroup.changeEventName, this);
            }
            catch (e) {
                console.error(e.stack);
                informerStatusNot200Instance(30, "Не получилось изменить Рабочую группу", e.message);
            }
        }
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