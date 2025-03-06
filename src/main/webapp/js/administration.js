//let workers;
let table;

/*let requests = Promise.all([
    findWorkers()
]).then((data) => {
    workers = data[0];
})*/


window.addEventListener("load", async () => {
    document.querySelector("#administrate-participants").onclick = async () => {
        const participants = await findParticipants(true);
        table = new Table(
            document.querySelector("#table-section"),
            participants,
            {
                tableName:"Подписанты/Адресаты/Исполнители",
                addOption:true,
                editOption:true,
                showDisabled:true,
                createFormInstance: () => {Participant.createFormInstance()},
                locale: Participant.locale,
                createEventName: Participant.createEventName,
                changeEventName: Participant.changeEventName,
                tableCellsResolver: Participant.tableCellsResolver
            }
        );
        document.querySelector("#table-section").classList.remove("hidden");
    }
    document.querySelector("#administrate-doc-types").onclick = async () => {
        const types = await findDocumentTypes(true);
        table = new Table(
            document.querySelector("#table-section"),
            types,
            {
                tableName:"Типы писем",
                addOption:true,
                editOption:true,
                showDisabled:true,
                createFormInstance: () => {DocumentType.createFormInstance()},
                locale: DocumentType.locale,
                createEventName: DocumentType.createEventName,
                changeEventName: DocumentType.changeEventName,
                tableCellsResolver: DocumentType.tableCellsResolver
            }
        );
        document.querySelector("#table-section").classList.remove("hidden");
    }
    document.querySelector("#administrate-tags").onclick = async () => {
        const tags = await findTags(true);
        table = new Table(
            document.querySelector("#table-section"),
            tags,
            {
                tableName:"Теги",
                addOption:true,
                editOption:true,
                showDisabled:true,
                createFormInstance: () => {Tag.createFormInstance()},
                locale: Tag.locale,
                createEventName: Tag.createEventName,
                changeEventName: Tag.changeEventName,
                tableCellsResolver: Tag.tableCellsResolver
            }
        );
        document.querySelector("#table-section").classList.remove("hidden");
    }
    document.querySelector("#administrate-workgroups").onclick = async () => {
        const workgroups = await findWorkgroups(true);
        table = new Table(
            document.querySelector("#table-section"),
            workgroups,
            {
                tableName:"Рабочие группы",
                addOption:true,
                editOption:true,
                showDisabled:true,
                createFormInstance: () => {Workgroup.createFormInstance()},
                locale: Workgroup.locale,
                createEventName: Workgroup.createEventName,
                changeEventName: Workgroup.changeEventName,
                tableCellsResolver: Workgroup.tableCellsResolver
            }
        );
        document.querySelector("#table-section").classList.remove("hidden");
    }
    document.querySelector("#administrate-origins-and-addresses").onclick = async () => {
        const originsAndAddresses = await findOriginsAndAddresses(true);
        table = new Table(
            document.querySelector("#table-section"),
            originsAndAddresses,
            {
                tableName:"Источники/Адреса",
                addOption:true,
                editOption:true,
                showDisabled:true,
                createFormInstance: () => {OriginAndAddress.createFormInstance()},
                locale: OriginAndAddress.locale,
                createEventName: OriginAndAddress.createEventName,
                changeEventName: OriginAndAddress.changeEventName,
                tableCellsResolver: OriginAndAddress.tableCellsResolver
            }
        );
        document.querySelector("#table-section").classList.remove("hidden");
    }
    document.querySelector("#administrate-workers").onclick = async () => {
        const workers = await findWorkers(true);
        table = new Table(
            document.querySelector("#table-section"),
            workers,
            {
                tableName:"Сотрудники отдела",
                addOption:true,
                editOption:true,
                showDisabled:true,
                createFormInstance: () => {Worker.createFormInstance()},
                locale: Worker.locale,
                createEventName: Worker.createEventName,
                changeEventName: Worker.changeEventName,
                tableCellsResolver: Worker.tableCellsResolver
            }
        );
        document.querySelector("#table-section").classList.remove("hidden");
    }

    addCallbackToQueue(() => document.getElementById("administration-ref").classList.add("li-selected"));
})