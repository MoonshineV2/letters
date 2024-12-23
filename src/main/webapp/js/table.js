class Table {

    locale = {};
    tableCellsResolver = {};
    columns = [];
    data = [];
    dataRows = [];

    changeEventName;
    createEventName;

    createFormInstance;

    addOption = false;
    showDisabled = false;

    constructor(element, data, options = {}) {


        this.options = options;
        this.element = element;
        if (data && data.length > 0) {
            this.data = data;
            if (data[0].constructor.locale)
                this.locale = data[0].constructor.locale;
            if (data[0].constructor.tableCellsResolver)
                this.tableCellsResolver = data[0].constructor.tableCellsResolver;
            if (data[0].constructor.changeEventName)
                this.changeEventName = data[0].constructor.changeEventName;
            if (data[0].constructor.createEventName)
                this.createEventName = data[0].constructor.createEventName;
            if (data[0].constructor.createFormInstance)
                this.createFormInstance = data[0].constructor.createFormInstance;
        }

        if (options.locale) {
            this.locale = options.locale;
        }

        if (options.tableCellsResolver) {
            this.tableCellsResolver = options.tableCellsResolver;
        }

        if (options.changeEventName) {
            this.changeEventName = options.changeEventName;
        }

        if (options.columns) {
            options.columns.forEach(column => this.columns.push(column));
        }

        if (options.addOption) {
            this.addOption = options.addOption;
        }

        if (options.showDisabled) {
            this.showDisabled = options.showDisabled;
        }

        this.initialize();
        this.eventHandlers();

        //console.log(this.data);
    }


    initialize() {
        this.element.innerHTML = "";

        this.element.appendChild(this.initUpper());

        let tableContainer = document.createElement("div");
        tableContainer.classList.add("table-container");
        this.element.appendChild(tableContainer);

        let tableHTML = document.createElement("table");
        tableContainer.appendChild(tableHTML);
        this.table = tableHTML;

        let theadHTML = document.createElement("thead");
        tableHTML.appendChild(theadHTML);
        this.header = theadHTML;

        let tbodyHTML = document.createElement("tbody");
        tableHTML.appendChild(tbodyHTML);
        this.body = tbodyHTML;

        this.data.forEach(el => {
            Object.keys(el).forEach(key => {
                if (!this.columns.includes(key)) {
                    this.columns.push(key);
                }
            })
        })

        this.initHeader()
        this.initBody();
        this.resizableGrid();

        //console.log(this.data);
        //console.log(this.dataRows)
    }

    initUpper() {
        const root = document.createElement('div');
        root.classList.add("table-upper");

        let generated =
            `<div style="display: flex;gap: 5px;">
                ${this.addOption ? `
                    <button id="add-option" class="table-customization-btn add-option">
                        Добавить
                    </button>
                ` : ''}
                ${this.showDisabled ? `
                    <input type="checkbox" id="show-disabled" class="toggle-checkbox" />
                    <label for="show-disabled" class="toggle-container">
                        <div>Все</div>
                        <div>Активные</div>
                    </label>
                ` : ''}
            </div>
            <div style="position: relative">
                <button id="export-btn" class="table-customization-btn excel-btn">
                    Экспорт
                </button>
                <div class="table-customization-options excel-options">
                    <div class="custom-input">
                        <input id="excel-filename" type="text" placeholder="Название файла">
                        <p>.xlsx</p>
                        <button class="excel-save-btn">Сохранить</button>
                    </div>
                </div>
            </div>`

        root.innerHTML = generated;

        root.querySelector("#export-btn").onclick = (e) => {
            e.currentTarget.classList.toggle("table-customization-btn-active");
        }

        const excelFilename = root.querySelector("#excel-filename");
        root.querySelector(".excel-save-btn").onclick = () => {
            if (!excelFilename.value) {
                excelFilename.setAttribute("empty", "");

                excelFilename.oninput = () => {
                    excelFilename.removeAttribute("empty");
                }

                return;
            }

            const columns = Array.from(table.header.firstChild.children).map(th =>
                th.firstChild.innerText
            );
            const rows = [];
            Array.from(table.body.children).forEach(tr => {
                const row = [];
                Array.from(tr.children).forEach(td => {
                    if (td.querySelector("a")) {
                        row.push(td.querySelector("a").href);
                    }
                    else {
                        row.push(td.innerText);
                    }
                });

                rows.push(row);
            })

            tableToExcel({
                filename:excelFilename.value,
                headerRow:columns,
                dataRows:rows
            })
        }

        if (this.createFormInstance && this.addOption) {
            root.querySelector("#add-option").addEventListener("click", (e) => {
                this.createFormInstance();
            })
        }

        if (this.showDisabled) {
            root.querySelector("#show-disabled").onchange = () => {
                if (root.querySelector("#show-disabled").checked) {
                    this.dataRows.forEach(dr => {
                        if (dr.assignedData.disabled) {
                            dr.row.style.display = "none";
                        }
                    })
                }
                else {
                    this.dataRows.forEach(dr => {
                        dr.row.style.display = "";
                    })
                }
            }
        }

        return root;
    }

    initHeader() {
        this.header.innerHTML = "";

        let trHTML = document.createElement("tr");
        this.header.appendChild(trHTML);
        this.columns.forEach(col => {
            let th = document.createElement("th");
            if (Object.keys(this.locale).includes(col)) {
                const p = document.createElement("p");
                p.innerText = this.locale[col];
                th.appendChild(p);
            }
            else {
                const p = document.createElement("p");
                p.innerText = col
                th.appendChild(p);
            }
            th.scope = "col";
            trHTML.appendChild(th);
        })
    }

    initBody() {
        this.body.innerHTML = "";

        let toShow = this.data;
        if (!this.showDisabled) {
            toShow = toShow.filter(dataElement => !dataElement.disabled);
        }

        toShow.forEach(dataElement => {
            const createdRow = this.createRow(dataElement);
            this.body.appendChild(createdRow);
            this.dataRows.push({id:dataElement.id, row:createdRow, assignedData:dataElement});
        })
    }

    createRow(el) {
        let row = document.createElement("tr");

        const props = Object.keys(el);

        this.columns.forEach(column => {
            let td = document.createElement("td");
            if (props.includes(column)) {
                if (Object.keys(this.tableCellsResolver).includes(column)) {
                    this.tableCellsResolver[column](td, el);
                }
                else {
                    td.innerText = el[column];
                }
            }

            const span = document.createElement("span");
            td.appendChild(span);
            const image = document.createElement("img");
            image.src = "../images/edit.svg";
            image.onclick = () => {
                el.editFormInstance();
            }
            span.appendChild(image);

            row.appendChild(td);
        })

        let th = document.createElement("th");
        th.innerHTML = row.children[0].innerText;
        th.scope = "row";
        row.children[0].parentNode.replaceChild(th, row.children[0]);

        return row;
    }

    updateRow(id) {
        let dataRow = this.dataRows.find(row => row.id === id);
        for (const child of dataRow.row.children) {
            child.innerHTML = "";
        }

        let created = this.createRow(dataRow.assignedData);
        dataRow.row.replaceWith(created);
        dataRow.row = created;
    }
    eventHandlers() {
        for (let tr of this.header.children) {
            for (let cell of tr.children) {
                cell.children[0].onclick = () => {
                    if (this.data.length === 0 || this.data.length === 1) return;
                    let field;
                    if (Object.values(this.locale).includes(cell.children[0].innerText)) {
                        field = Object.keys(this.locale).find(key => this.locale[key] === cell.children[0].innerText);
                    }
                    else {
                        field = cell.children[0].innerText;
                    }

                    if (cell.classList.contains("sort-asc")) {
                        cell.classList.remove("sort-asc");
                        cell.classList.add("sort-desc");
                        console.time('Function sortData');
                        this.sortData(field, "DESC");
                        console.timeEnd('Function sortData');
                    }
                    else if (cell.classList.contains("sort-desc")) {
                        cell.classList.remove("sort-desc");
                        cell.classList.add("sort-asc");
                        console.time('Function sortData');
                        this.sortData(field, "ASC");
                        console.timeEnd('Function sortData');
                    }
                    else {
                        cell.classList.add("sort-asc");
                        console.time('Function sortData');
                        this.sortData(field, "ASC");
                        console.timeEnd('Function sortData');
                    }

                    for (let rows of this.header.children) {
                        for (let cellToResetArrows of tr.children) {
                            if (cellToResetArrows !== cell) {
                                cellToResetArrows.classList.remove("sort-asc");
                                cellToResetArrows.classList.remove("sort-desc");
                            }
                        }
                    }

                    console.time('Function sortUI');
                    this.sortUI();
                    console.timeEnd('Function sortUI');
                }
            }
        }

        if (this.changeEventName) {
            // Подписываемся на ивент, который будет вызываться в классе, если он прописан
            const unSubscribe = EventEmitter.subscribe(this.changeEventName, (data) => {
                this.updateRow(data.id);
            });

            let observer = new MutationObserver((mutations) => {
                if (!document.body.contains(this.header)) {
                    unSubscribe();
                    observer.disconnect();
                }

            });
            observer.observe(this.table, {childList: true, subtree: true});
        }

        if (this.createEventName) {
            const unSubscribe = EventEmitter.subscribe(this.createEventName, (data) => {
                const createdRow = this.createRow(data);
                this.body.appendChild(createdRow);
                this.data.push(data);
                this.dataRows.push({id:data.id, row:createdRow, assignedData:data});
            });

            let observer = new MutationObserver((mutations) => {
                if (!document.body.contains(this.header)) {
                    unSubscribe();
                    observer.disconnect();
                }

            });
            observer.observe(this.table, {childList: true, subtree: true});
        }
    }

    sortData(field, order) {
        const fieldType = this.getFieldType(this.data, field);
        //console.log(this.data);
        if (fieldType === "number") {
            //console.log("type of number");
            if (order === "ASC") {
                this.data.sort((a,b) => a[field] - b[field]);
            }
            else if (order === "DESC"){
                this.data.sort((a,b) => b[field] - a[field]);
            }
            return;
        }
        if (fieldType === "string") {
            //console.log("type of string");
            if (order === "ASC") {
                this.data.sort((a,b) => compareStrings(a[field], b[field]));
            }
            else if (order === "DESC"){
                this.data.sort((a,b) => compareStrings(b[field], a[field]));
            }
            return;
        }
        if (fieldType === "boolean") {
            //console.log("type of boolean");
            if (order === "ASC") {
                this.data.sort((a,b) => a[field] - b[field]);
            }
            else if (order === "DESC"){
                this.data.sort((a,b) => b[field] - a[field]);
            }
            return;
        }

        try {
            if (order === "ASC") {
                this.data.sort((a,b) => {
                    if (!a[field]) return 1;
                    if (!b[field]) return -1;
                    return  a[field].compare(b[field])
                    }
                );
            }
            else if (order === "DESC"){
                this.data.sort((a,b) => {
                        if (!a[field]) return -1;
                        if (!b[field]) return 1;
                        return  b[field].compare(a[field])
                    }
                );
            }
        }
        catch (e) {
            console.error(e.stack);
            console.error("Не удалось сравнить два объекта. Возможно у объектов нет функции \"compare(o)\"");
        }
    }

    getFieldType(data, field) {
        let type = undefined;

        for (let element of data) {
            if (element[field]) {
                if (typeof element[field] !== "object") {
                    type = typeof element[field];
                    break;
                }
            }
        }

        return type;
    }

    sortUI() {
        let rows = Array.from(this.body.children);
        this.data.forEach(el => {
            const elementToSort = rows.find(row => parseInt(row.getElementsByTagName("th")[0].innerHTML) === el.id);
            this.body.appendChild(elementToSort);
        })
    }

    resizableGrid() {
        const row = this.table.getElementsByTagName('tr')[0],
            cols = row ? row.children : undefined;
        if (!cols) return;


        let tableHeight = this.table.offsetHeight;

        for (let i = 0; i < cols.length; i++) {
            let div = createDiv(tableHeight);
            cols[i].appendChild(div);
            cols[i].style.position = 'relative';
            setListeners(this.table, div);
        }

        function setListeners(table, div) {
            let pageX, curCol, nxtCol, curColWidth, nxtColWidth, tableWidth;

            div.addEventListener('mousedown', function(e) {

                tableWidth = table.offsetWidth;
                curCol = e.target.parentElement;
                nxtCol = curCol.nextElementSibling;
                pageX = e.pageX;

                let padding = paddingDiff(curCol);

                curColWidth = curCol.offsetWidth - padding;
                //  if (nxtCol)
                //nxtColWidth = nxtCol.offsetWidth - padding;
            });

            div.addEventListener('mouseover', function(e) {
                e.target.style.borderRight = '2px solid #0000ff';
            })

            div.addEventListener('mouseout', function(e) {
                e.target.style.borderRight = '';
            })

            document.addEventListener('mousemove', function(e) {
                if (curCol) {
                    let diffX = e.pageX - pageX;

                    // if (nxtCol)
                    //nxtCol.style.width = (nxtColWidth - (diffX)) + 'px';

                    curCol.style.width = (curColWidth + diffX) + 'px';
                    curCol.style.whiteSpace = 'normal';
                    table.style.width = tableWidth + diffX + "px"
                }
            });

            document.addEventListener('mouseup', function(e) {
                curCol = undefined;
                nxtCol = undefined;
                pageX = undefined;
                nxtColWidth = undefined;
                curColWidth = undefined
            });
        }

        function createDiv(height) {
            let div = document.createElement('div');
            div.style.top = 0;
            div.style.right = "-2px";
            div.style.width = '5px';
            div.style.position = 'absolute';
            div.style.cursor = 'col-resize';
            div.style.userSelect = 'none';
            //div.style.height = height + 'px';
            div.style.height = '100%';
            return div;
        }

        function paddingDiff(col) {

            if (getStyleVal(col, 'box-sizing') == 'border-box') {
                return 0;
            }

            let padLeft = getStyleVal(col, 'padding-left');
            let padRight = getStyleVal(col, 'padding-right');
            return (parseInt(padLeft) + parseInt(padRight));

        }

        function getStyleVal(elm, css) {
            return (window.getComputedStyle(elm, null).getPropertyValue(css))
        }
    }

    set table(value) {
        this.options.table = value;
    }

    get table() {
        return this.options.table;
    }

    set header(value) {
        this.options.header = value;
    }

    get header() {
        return this.options.header;
    }

    set body(value) {
        this.options.body = value;
    }

    get body() {
        return this.options.body;
    }

    set element(value) {
        this.options.element = value;
    }

    get element() {
        return this.options.element;
    }

    set locale(value) {
        this.options.locale = value;
    }

    get locale() {
        return this.options.locale;
    }

    get data() {
        return this.data;
    }

    get columns() {
        return this.columns;
    }
}

const compareStrings = (str1, str2) => {
    if (!str1)
        return -1;
    if (!str2)
        return 1;

    return  str1.localeCompare(str2);
}
