let workers;
let table;

let requests = Promise.all([
    findWorkers()
]).then((data) => {
    workers = data[0];
})


window.addEventListener("load", async () => {
    document.querySelector("#administrate-participants").onclick = async () => {
        const participants = await findParticipants();
        table = new Table(document.querySelector("#table-section"), participants);
        document.querySelector("#table-section").classList.remove("hidden");
    }
    document.querySelector("#administrate-doc-types").onclick = async () => {
        const types = await findDocumentTypes();
        table = new Table(document.querySelector("#table-section"), types);
        document.querySelector("#table-section").classList.remove("hidden");
    }
    document.querySelector("#administrate-tags").onclick = async () => {
        const tags = await findTags();
        table = new Table(document.querySelector("#table-section"), tags);
        document.querySelector("#table-section").classList.remove("hidden");
    }
    document.querySelector("#administrate-workgroups").onclick = async () => {
        const workgroups = await findWorkgroups();
        table = new Table(document.querySelector("#table-section"), workgroups);
        document.querySelector("#table-section").classList.remove("hidden");
    }
})