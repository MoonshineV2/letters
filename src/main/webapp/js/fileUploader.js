class FileUploader {

    constructor(element, options = {}) {
        this.options = options;

        if (!element) {
            throw new Error("В конструктор не передан елемент");
        }

        this.options.element = element;

        this.initialize();
        this.eventHandlers();
    }

    initialize() {
        let dropZone = `
            <div class="drag-and-drop-file">
                <img src="../images/file.svg" alt="Фоновое изображение файла"/>
                    <span>
                        <a class="drag-and-drop-select-file"">Выберите файл</a>
                        <p>или перетащите его сюда</p>
                    </span>
            </div>`;

        let uploadedFile = `
            <div class="uploaded-file hidden">
                <div class="uploaded-file-icon"></div>
                <div class="uploaded-file-text">
                    <p class="uploaded-file-text-name"></p>
                    <p class="uploaded-file-text-size"></p>
                </div>
                <img class="cross-mark" src="../images/close.svg" alt="Знак удаления файла"/>
            </div>`;

        let fileInput = `<input type="file" class="file-input" hidden/>`

        this.element.innerHTML = `${dropZone} ${uploadedFile} ${fileInput}`;
    }

    eventHandlers() {

        this.dropArea = this.element.querySelector('.drag-and-drop-file');
        this.fileInput = this.element.querySelector('.file-input');
        // Preventing default browser behavior when dragging a file over the container
        this.dropArea.addEventListener('dragover', (e) => {
            this.preventDefaults(e)
        });
        this.dropArea.addEventListener('dragenter', (e) => {
            this.preventDefaults(e)
        });
        this.dropArea.addEventListener('dragleave', (e) => {
            this.preventDefaults(e)
        });

        // We’ll discuss `handleDrop` function down the road
        const handleDrop = (e) => {
            console.log("handleDrop(e)");
            e.preventDefault();
            this.dropArea.classList.remove('drag-over');
            // Getting the list of dragged files
            const files = e.dataTransfer.files;

            // Checking if there are any files
            if (files.length === 1) {
                // Assigning the files to the hidden input from the first step
                this.fileInput.files = files;

                // Processing the files for previews (next step)
                //handleFiles(files);
            }

            this.processFileChange();
        }
        // Handling dropping files into the area
        this.dropArea.addEventListener('drop', handleDrop);

        this.dropArea.addEventListener('dragover', () => {
            this.dropArea.classList.add('drag-over');
        });

        this.dropArea.addEventListener('dragleave', () => {
            this.dropArea.classList.remove('drag-over');
        });

        this.fileInput.onchange = () => {
            this.processFileChange();
        }

        this.element.querySelector('.drag-and-drop-select-file').onclick = () => {
            this.fileInput.click();
        }

        this.element.querySelector('.cross-mark').onclick = () => {
            this.fileInput.value = null;
            this.processFileChange();
        }
    }

    processFileChange() {
        console.log("processFileChange()");
        if (this.fileInput.files.length > 0) {

            this.dropArea.classList.add("hidden");
            this.element.querySelector('.uploaded-file').classList.remove("hidden");

            this.element.querySelector('.uploaded-file-text-name').innerText = this.fileInput.files[0].name;
            this.element.querySelector('.uploaded-file-text-size').innerText = ((this.fileInput.files[0].size / 1024 / 1024).toFixed(2)).toString() + " MB";
        }
        else {
            this.dropArea.classList.remove("hidden");
            this.element.querySelector('.uploaded-file').classList.add("hidden");
        }
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    set element(value) {
        this.options.element = value;
    }

    get element() {
        return this.options.element;
    }

    set dropArea(value) {
        this.options.dropArea = value;
    }

    get dropArea() {
        return this.options.dropArea;
    }

    set fileInput(value) {
        this.options.fileInput = value;
    }

    get fileInput() {
        return this.options.fileInput;
    }
}