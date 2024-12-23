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
            {addOption:true, showDisabled:true}
            );
        document.querySelector("#table-section").classList.remove("hidden");
    }
    document.querySelector("#administrate-doc-types").onclick = async () => {
        const types = await findDocumentTypes(true);
        table = new Table(
            document.querySelector("#table-section"),
            types,
            {addOption:true, showDisabled:true}
        );
        document.querySelector("#table-section").classList.remove("hidden");
    }
    document.querySelector("#administrate-tags").onclick = async () => {
        const tags = await findTags(true);
        table = new Table(
            document.querySelector("#table-section"),
            tags,
            {addOption:true, showDisabled:true});
        document.querySelector("#table-section").classList.remove("hidden");
    }
    document.querySelector("#administrate-workgroups").onclick = async () => {
        const workgroups = await findWorkgroups(true);
        table = new Table(
            document.querySelector("#table-section"),
            workgroups,
            {addOption:true, showDisabled:true});
        document.querySelector("#table-section").classList.remove("hidden");
    }
    document.querySelector("#administrate-origins-and-addresses").onclick = async () => {
        const originsAndAddresses = await findOriginsAndAddresses(true);
        table = new Table(
            document.querySelector("#table-section"),
            originsAndAddresses,
            {addOption:true, showDisabled:true});
        document.querySelector("#table-section").classList.remove("hidden");
    }
    document.querySelector("#administrate-workers").onclick = async () => {
        const workers = await findWorkers(true);
        table = new Table(
            document.querySelector("#table-section"),
            workers,
            {addOption:true, showDisabled:true});
        document.querySelector("#table-section").classList.remove("hidden");
    }

    addCallbackToQueue(() => document.getElementById("administration-ref").classList.add("li-selected"));
})