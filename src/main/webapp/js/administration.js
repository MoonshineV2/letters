//let workers;
let table;

/*let requests = Promise.all([
    findWorkers()
]).then((data) => {
    workers = data[0];
})*/


window.addEventListener("load", async () => {
    document.querySelector("#administrate-participants").onclick = async () => {
        const participants = await findParticipants();
        table = new Table(document.querySelector("#table-section"), participants, {addOption:true});
        document.querySelector("#table-section").classList.remove("hidden");
    }
    document.querySelector("#administrate-doc-types").onclick = async () => {
        const types = await findDocumentTypes();
        table = new Table(document.querySelector("#table-section"), types, {addOption:true});
        document.querySelector("#table-section").classList.remove("hidden");
    }
    document.querySelector("#administrate-tags").onclick = async () => {
        const tags = await findTags();
        table = new Table(document.querySelector("#table-section"), tags, {addOption:true});
        document.querySelector("#table-section").classList.remove("hidden");
    }
    document.querySelector("#administrate-workgroups").onclick = async () => {
        const workgroups = await findWorkgroups();
        table = new Table(document.querySelector("#table-section"), workgroups, {addOption:true});
        document.querySelector("#table-section").classList.remove("hidden");
    }
    document.querySelector("#administrate-origins-and-addresses").onclick = async () => {
        const originsAndAddresses = await findOriginsAndAddresses();
        table = new Table(document.querySelector("#table-section"), originsAndAddresses, {addOption:true});
        document.querySelector("#table-section").classList.remove("hidden");
    }
    document.querySelector("#administrate-workers").onclick = async () => {
        const workers = await findWorkers();
        table = new Table(document.querySelector("#table-section"), workers, {addOption:true});
        document.querySelector("#table-section").classList.remove("hidden");
    }

    addCallbackToQueue(() => document.getElementById("administration-ref").classList.add("li-selected"));
})