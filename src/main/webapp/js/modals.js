function openModalCreateOrigin(modalToShow, selectToAddOption, modalError) {
    const modalShowInstance = new bootstrap.Modal(modalToShow);

    const footer = modalToShow.children[0].children[0].children[2];
    const body = modalToShow.children[0].children[0].children[1].children[0];

    const optionsCount = selectToAddOption.options.length;

    body.innerHTML = "";

    document.getElementsByClassName("modal-title")[0].innerHTML = "Создание источника";

    const labelFullname = document.createElement("label");
    labelFullname.setAttribute("for", "message-text");
    labelFullname.classList.add('col-form-label');
    labelFullname.innerHTML = "Полное наименование";
    body.appendChild(labelFullname)

    const inputFullName = document.createElement("input");
    inputFullName.classList.add('form-control');
    inputFullName.type = "text";
    inputFullName.id = "fullname-input";
    body.appendChild(inputFullName)

    const labelShortname = document.createElement("label");
    labelShortname.setAttribute("for", "message-text");
    labelShortname.classList.add('col-form-label');
    labelShortname.innerHTML = "Краткое наименование";
    body.appendChild(labelShortname)

    const inputShortName = document.createElement("input");
    inputShortName.classList.add('form-control');
    inputShortName.type = "text";
    inputShortName.id = "shortname-input";
    body.appendChild(inputShortName)

    const labelAdmKod = document.createElement("label");
    labelAdmKod.setAttribute("for", "message-text");
    labelAdmKod.classList.add('col-form-label');
    labelAdmKod.innerHTML = "Код администрации";
    body.appendChild(labelAdmKod)

    const inputAdmKod = document.createElement("input");
    inputAdmKod.classList.add('form-control');
    inputAdmKod.type = "text";
    inputAdmKod.id = "adm-kod-input";
    body.appendChild(inputAdmKod)

    function hideListener() {
        modalToShow.removeEventListener('hidden.bs.modal', hideListener);

        if (optionsCount === selectToAddOption.options.length) {
            selectToAddOption.options[0].selected = true;
        }
    }

    modalToShow.addEventListener('hidden.bs.modal', hideListener)

    footer.children[1].innerHTML = "Создать";
    footer.children[1].onclick = async () => {
        await createOriginRequest(
            inputFullName.value,
            inputShortName.value,
            inputAdmKod.value,
            modalError,
            modalToShow,
            selectToAddOption
        )
        modalShowInstance.hide();
    }

    modalShowInstance.toggle();
}

async function createOriginRequest(name, shortName, kodADM, modalError, modalToToggle, select) {
    const response = await fetch("/letters/api/originsAndAddresses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            shortName: shortName,
            kodADM: kodADM
        }),
    });

    if (!response.ok) {
        bodyText = await response.text();

        showModalError("Ошибка", bodyText, modalError, modalToToggle);

        throw new Error(`Response status: ${response.status}`);
    }

    const data = await response.json();

    const option = document.createElement("option");
    option.innerText = data.name
    option.value = data.id
    select.insertBefore(option, select.options[select.selectedIndex]);
    option.selected = true;
}

function openModalCreateParticipant(modalToShow, selectToAddOption, checkDisabled, modalError, headerText, otherSelectsToAddOption) {
    const modalShowInstance = new bootstrap.Modal(modalToShow);

    const footer = modalToShow.children[0].children[0].children[2];
    const body = modalToShow.children[0].children[0].children[1].children[0];

    const optionsCount = selectToAddOption.options.length;

    body.innerHTML = "";

    document.getElementsByClassName("modal-title")[0].innerHTML = headerText;

    const labelFullname = document.createElement("label");
    labelFullname.setAttribute("for", "message-text");
    labelFullname.classList.add('col-form-label');
    labelFullname.innerHTML = "Полное имя";
    body.appendChild(labelFullname)

    const inputFullName = document.createElement("input");
    inputFullName.classList.add('form-control');
    inputFullName.type = "text";
    inputFullName.id = "fullname-input";
    body.appendChild(inputFullName)

    const labelInitials = document.createElement("label");
    labelInitials.setAttribute("for", "message-text");
    labelInitials.classList.add('col-form-label');
    labelInitials.innerHTML = "Фамилия, инициалы";
    body.appendChild(labelInitials)

    const inputInitials = document.createElement("input");
    inputInitials.classList.add('form-control');
    inputInitials.type = "text";
    inputInitials.id = "shortname-input";
    body.appendChild(inputInitials)

    const labelPost = document.createElement("label");
    labelPost.setAttribute("for", "post-input");
    labelPost.classList.add('col-form-label');
    labelPost.innerHTML = "Должность";
    body.appendChild(labelPost)

    const inputPost = document.createElement("input");
    inputPost.classList.add('form-control');
    inputPost.type = "text";
    inputPost.id = "post-input";
    body.appendChild(inputPost)


    const divSign = document.createElement("div");
    divSign.classList.add('col-form-label');
    body.appendChild(divSign)

    const checkSign = document.createElement("input");
    checkSign.classList.add('form-check-input');
    checkSign.type = "checkbox";
    checkSign.id = "sign-checkbox";
    checkSign.checked = checkDisabled;
    checkSign.disabled = checkDisabled;
    divSign.appendChild(checkSign);

    const labelSign = document.createElement("label");
    labelSign.setAttribute("for", "sign-checkbox");
    labelSign.classList.add('form-check-label');
    labelSign.innerHTML = "Право подписи";
    labelSign.style.paddingLeft = "4px";
    divSign.appendChild(labelSign);

    function hideListener() {
        modalToShow.removeEventListener('hidden.bs.modal', hideListener);

        if (optionsCount === selectToAddOption.options.length) {
            selectToAddOption.options[0].selected = true;
        }
    }

    modalToShow.addEventListener('hidden.bs.modal', hideListener)

    footer.children[1].innerHTML = "Создать";
    footer.children[1].onclick = async () => {
        const data = await createParticipantRequest(
            inputFullName.value,
            inputInitials.value,
            inputPost.value,
            checkSign.checked,
            modalError,
            modalToShow
        )

        const option = document.createElement("option");
        option.innerText = data.initials
        option.value = data.id
        selectToAddOption.insertBefore(option, selectToAddOption.options[selectToAddOption.options.length-1]);
        option.selected = true;

        if (otherSelectsToAddOption !== undefined) {
            otherSelectsToAddOption.forEach(el => {
                if (el.signFlag === true) {
                    if (!checkSign.checked) {
                        return;
                    }
                }
                const option = document.createElement("option");
                option.innerText = data.initials
                option.value = data.id
                el.selectNode.insertBefore(option, el.selectNode.options[el.selectNode.options.length-1]);
            })
        }
        modalShowInstance.hide();
    }

    modalShowInstance.toggle();
}

async function createParticipantRequest(fullName, initials, post, canSign, modalError, modalToToggle) {
    const response = await fetch("/letters/api/participants", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            fullName: fullName,
            initials: initials,
            post: post,
            canSign: canSign
        }),
    });

    if (!response.ok) {
        bodyText = await response.text();
        showModalError("Ошибка", bodyText, modalError, modalToToggle);
        throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();
}

async function openModalCreateWorker(modalToShow, selectToAddOption, modalError, headerText, otherSelectsToAddOption) {
    const modalShowInstance = new bootstrap.Modal(modalToShow);

    const footer = modalToShow.children[0].children[0].children[2];
    const body = modalToShow.children[0].children[0].children[1].children[0];

    const optionsCount = selectToAddOption.options.length;

    document.getElementsByClassName("modal-title")[0].innerHTML = headerText;

    body.innerHTML = "";

    const labelFullname = document.createElement("label");
    labelFullname.setAttribute("for", "message-text");
    labelFullname.classList.add('col-form-label');
    labelFullname.innerHTML = "Полное имя";
    body.appendChild(labelFullname)

    const inputFullName = document.createElement("input");
    inputFullName.classList.add('form-control');
    inputFullName.type = "text";
    inputFullName.id = "fullname-input";
    body.appendChild(inputFullName)

    const labelInitials = document.createElement("label");
    labelInitials.setAttribute("for", "message-text");
    labelInitials.classList.add('col-form-label');
    labelInitials.innerHTML = "Фамилия, инициалы";
    body.appendChild(labelInitials)

    const inputInitials = document.createElement("input");
    inputInitials.classList.add('form-control');
    inputInitials.type = "text";
    inputInitials.id = "shortname-input";
    body.appendChild(inputInitials)

    const labelPost = document.createElement("label");
    labelPost.setAttribute("for", "post-input");
    labelPost.classList.add('col-form-label');
    labelPost.innerHTML = "Должность";
    body.appendChild(labelPost)

    const inputPost = document.createElement("input");
    inputPost.classList.add('form-control');
    inputPost.type = "text";
    inputPost.id = "post-input";
    body.appendChild(inputPost)

    const labelWorkgroup = document.createElement("label");
    labelWorkgroup.setAttribute("for", "workgroup-select");
    labelWorkgroup.classList.add('col-form-label');
    labelWorkgroup.innerHTML = "Рабочая группа";
    body.appendChild(labelWorkgroup);

    const divPost = document.createElement("div");
    divPost.classList.add('custom-select');
    body.appendChild(divPost)

    const selectWorkgroup = document.createElement("select");
    selectWorkgroup.name = "workgroups";
    selectWorkgroup.id = "workgroup-select";
    divPost.appendChild(selectWorkgroup)

    const option = document.createElement("option");
    selectWorkgroup.appendChild(option);
    option.innerText = "Выберите вариант";
    option.selected = true;
    option.hidden = true;
    option.disabled = true;

    const divSign = document.createElement("div");
    divSign.classList.add('col-form-label');
    body.appendChild(divSign)

    const checkSign = document.createElement("input");
    checkSign.classList.add('form-check-input');
    checkSign.type = "checkbox";
    checkSign.id = "sign-checkbox";
    checkSign.checked = false;
    divSign.appendChild(checkSign);

    const labelSign = document.createElement("label");
    labelSign.setAttribute("for", "sign-checkbox");
    labelSign.classList.add('form-check-label');
    labelSign.innerHTML = "Право подписи";
    labelSign.style.paddingLeft = "4px";
    divSign.appendChild(labelSign);

    function hideListener() {
        modalToShow.removeEventListener('hidden.bs.modal', hideListener);

        if (optionsCount === selectToAddOption.options.length) {
            selectToAddOption.options[0].selected = true;
        }
    }

    modalToShow.addEventListener('hidden.bs.modal', hideListener)

    footer.children[1].innerHTML = "Создать";
    footer.children[1].onclick = async () => {

        if (inputFullName.value === "" || inputFullName.value === undefined) {
            showModalError("Ошибка", "Поле:\"Полное имя\" не может быть пустым.", modalError, modalToShow);
            return;
        }

        if (inputInitials.value === "" || inputInitials.value === undefined) {
            showModalError("Ошибка", "Поле:\"Фамилия, инициалы\" не может быть пустым.", modalError, modalToShow);
            return;
        }

        if (option.selected) {
            showModalError("Ошибка", "Выберите рабочую группу.", modalError, modalToShow);
            return;
        }

        const data = await createWorkerRequest(
            inputFullName.value,
            inputInitials.value,
            inputPost.value,
            checkSign.checked,
            selectWorkgroup.value,
            modalError,
            modalToShow
        )

        const optionWorker = document.createElement("option");
        optionWorker.innerText = data.initials
        optionWorker.value = data.id
        selectToAddOption.insertBefore(optionWorker, selectToAddOption.options[selectToAddOption.options.length-1]);
        optionWorker.selected = true;

        if (otherSelectsToAddOption !== undefined) {
            otherSelectsToAddOption.forEach(el => {
                if (el.signFlag === true) {
                    if (!checkSign.checked) {
                        return;
                    }
                }
                const option = document.createElement("option");
                option.innerText = data.initials
                option.value = data.id
                el.selectNode.insertBefore(option, el.selectNode.options[el.selectNode.options.length-1]);
            })
        }

        modalShowInstance.hide();
    }

    modalShowInstance.toggle();

    await getWorkgroupsData();
}

async function createWorkerRequest(fullName, initials, post, canSign, workgroupId, modalError, modalToToggle) {
    const response = await fetch("/letters/api/workers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            fullName: fullName,
            initials: initials,
            post: post,
            canSign: canSign,
            workgroupId: workgroupId
        }),
    });


    if (!response.ok) {
        bodyText = await response.text();
        showModalError("Ошибка", bodyText, modalError, modalToToggle);
        throw new Error(`Response status: ${response.status}`);
    }

    return await response.json();
}

function showModalError(headerText, bodyText, modalError, modalToToggle) {

    const modalErrorInstance = bootstrap.Modal.getOrCreateInstance(modalError);

    const header = modalError.children[0].children[0].children[0].children[0];
    const body = modalError.children[0].children[0].children[1].children[0];

    header.innerHTML = headerText;
    body.innerHTML = bodyText;

    if (typeof modalToToggle !== "undefined") {
        const modalToToggleInstance = bootstrap.Modal.getOrCreateInstance(modalToToggle);
        modalToToggleInstance.hide();

        function hideListener() {
            modalToToggleInstance.show();
            modalError.removeEventListener('hidden.bs.modal', hideListener);
        }
        modalError.addEventListener('hidden.bs.modal', hideListener)
    }

    modalErrorInstance.toggle();
}

async function getWorkgroupsData() {
    let response = await fetch('/letters/api/workgroups');
    const originsAndAddresses = await response.json();

    const select = document.getElementById("workgroup-select");


    originsAndAddresses.forEach(element => {
        const option = document.createElement("option");
        option.innerText = element.name
        option.value = element.id
        select.appendChild(option)
    })
}