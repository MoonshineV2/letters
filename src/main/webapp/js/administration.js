
window.addEventListener("load", async () => {
    document.querySelector("#administrate-doc-types").onclick = async () => {
        const types = await findDocumentTypes();
        new Table(document.querySelector("#table"), types);
    }
    document.querySelector("#administrate-tags").onclick = async () => {
        const tags = await findTags();
        new Table(document.querySelector("#table"), tags);
    }
    document.querySelector("#administrate-workgroups").onclick = async () => {
        const workgroups = await findWorkgroups();
        new Table(document.querySelector("#table"), workgroups);
    }
})