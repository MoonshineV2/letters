class FileUploader {

    constructor(element, options = {}) {
        this.element = element;

        if (!element) {
            throw new Error("В конструктор не передан елемент");
        }
        this.initialize();
    }

    initialize() {
        let dropZone = `
            <div id="file-drop-zone" class="drag-and-drop-file">
                <img src="../images/file.svg" alt="Фоновое изображение файла"/>
                    <span>
                        <a class="drag-and-drop-select-file" onClick="selectFile()">Выберите файл</a>
                        <p>или перетащите его сюда</p>
                    </span>
            </div>`;

        let uploadedFile = `
            <div id="uploaded-file" class="uploaded-file hidden">
                <div class="uploaded-file-icon"></div>
                <div class="uploaded-file-text">
                    <p id="selected-file-name" class="uploaded-file-text-name"></p>
                    <p id="selected-file-size" class="uploaded-file-text-size"></p>
                </div>
                <img class="cross-mark" src="../images/close.svg" alt="Знак удаления файла" onClick="removeFile()"/>
            </div>`;

        let fileInput = `<input type="file" id="file-input" hidden/>`

        this.element.innerHTML = `${dropZone} ${uploadedFile} ${fileInput}`;
    }


}


let dropArea;
let fileInput;


window.addEventListener("load", () => {
    dropArea = document.getElementById('file-drop-zone');
    fileInput = document.getElementById('file-input');
    // Preventing default browser behavior when dragging a file over the container
    dropArea.addEventListener('dragover', preventDefaults);
    dropArea.addEventListener('dragenter', preventDefaults);
    dropArea.addEventListener('dragleave', preventDefaults);

// Handling dropping files into the area
    dropArea.addEventListener('drop', handleDrop);

// We’ll discuss `handleDrop` function down the road
    function handleDrop(e) {
        e.preventDefault();
        dropArea.classList.remove('drag-over');
        // Getting the list of dragged files
        const files = e.dataTransfer.files;

        // Checking if there are any files
        if (files.length === 1) {
            // Assigning the files to the hidden input from the first step
            fileInput.files = files;

            // Processing the files for previews (next step)
            //handleFiles(files);
        }

        processFileChange();
    }

    dropArea.addEventListener('dragover', () => {
        dropArea.classList.add('drag-over');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('drag-over');
    });

    fileInput.onchange = processFileChange;
})

function selectFile() {
    document.getElementById("file-input").click();
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function removeFile() {
    fileInput.value = null;
    processFileChange();
}

function processFileChange() {
    if (fileInput.files.length > 0) {
        document.getElementById("file-drop-zone").classList.add("hidden");
        document.getElementById("uploaded-file").classList.remove("hidden");

        document.getElementById("selected-file-name").innerText = fileInput.files[0].name;
        document.getElementById("selected-file-size").innerText = ((fileInput.files[0].size / 1024 / 1024).toFixed(2)).toString() + " MB";
    }
    else {
        document.getElementById("file-drop-zone").classList.remove("hidden");
        document.getElementById("uploaded-file").classList.add("hidden");
    }
}