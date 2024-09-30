class Table {

    locale = {};
    tableCellsResolver = {};

    constructor(element, data, options = {}) {

        if (!data) {
            return;
        }
        if (data.length === 0) {
            return;
        }

        this.options = options;
        this.element = element;
        this.data = data;

        if (options.locale) {
            this.locale = options.locale;
        }
        else if (data[0].constructor.locale) {
            this.locale = data[0].constructor.locale;
        }

        if (options.tableCellsResolver) {
            this.tableCellsResolver = options.tableCellsResolver;
        }
        else if (data[0].constructor.tableCellsResolver) {
            this.tableCellsResolver = data[0].constructor.tableCellsResolver;
        }

        this.initialize();
        this.eventHandlers();

        //console.log(this.data);
    }


    initialize() {
        this.element.innerHTML = "";

        let theadHTML = document.createElement("thead");
        this.element.appendChild(theadHTML);
        this.header = theadHTML;

        let tbodyHTML = document.createElement("tbody");
        this.element.appendChild(tbodyHTML);
        this.body = tbodyHTML;

        this.InitUI();
        this.resizableGrid();

        //console.log(this.data);
    }

    InitUI() {
        this.header.innerHTML = "";
        this.body.innerHTML = "";

        let trHTML = document.createElement("tr");
        this.header.appendChild(trHTML);
        Object.keys(this.data[0]).forEach(col => {
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

        this.data.forEach(el => {
            let row = document.createElement("tr");

            for (const [key, value] of Object.entries(el)) {
                let td = document.createElement("td");
                if (value !== null && value !== "") {
                    if (Object.keys(this.tableCellsResolver).includes(key)) {
                        this.tableCellsResolver[key](td, el);

                    }
                    else {
                        td.innerHTML = value;
                    }
                }

                if (key !== "id") {
                    const span = document.createElement("span");
                    td.appendChild(span);
                    const image = document.createElement("img");
                    image.src = "../images/edit.svg";
                    image.onclick = () => {
                        el.editFormInstance();
                    }
                    span.appendChild(image);
                }
                row.appendChild(td);
            }

            let th = document.createElement("th");
            th.innerHTML = row.children[0].innerHTML;
            th.scope = "row";
            row.children[0].parentNode.replaceChild(th, row.children[0]);
            this.body.appendChild(row);
        })
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
    }

    sortData(field, order) {
        const fieldType = this.getFieldType(this.data, field);
        //console.log(fieldType);
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
                this.data.sort((a,b) => a[field].localeCompare(b[field]));
            }
            else if (order === "DESC"){
                this.data.sort((a,b) => b[field].localeCompare(a[field]));
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
        if (fieldType === "Origin") {
            //console.log("type of Origin");
            if (order === "ASC") {
                this.data.sort((a,b) => Origin.compare(a[field],b[field]));
            }
            else if (order === "DESC"){
                this.data.sort((a,b) => Origin.compare(b[field],a[field]));
            }
            return;
        }
        if (fieldType === "Participant") {
            if (order === "ASC") {
                this.data.sort((a,b) => Participant.compare(a[field],b[field]));
            }
            else if (order === "DESC"){
                this.data.sort((a,b) => Participant.compare(b[field],a[field]));
            }
            return;
        }
        if (fieldType === "DocumentType") {
            if (order === "ASC") {
                this.data.sort((a,b) => DocumentType.compare(a[field],b[field]));
            }
            else if (order === "DESC"){
                this.data.sort((a,b) => DocumentType.compare(b[field],a[field]));
            }
            return;
        }
        if (fieldType === "Worker") {
            if (order === "ASC") {
                this.data.sort((a,b) => Worker.compare(a[field],b[field]));
            }
            else if (order === "DESC"){
                this.data.sort((a,b) => Worker.compare(b[field],a[field]));
            }
            return;
        }
        if (fieldType === "Tags") {
            if (order === "ASC") {
                this.data.sort((a,b) => Tags.compare(a[field],b[field]));
            }
            else if (order === "DESC"){
                this.data.sort((a,b) => Tags.compare(b[field],a[field]));
            }
            return;
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
                else {
                    if(element[field] instanceof Origin) {
                        type = "Origin";
                        break;
                    }
                    if(element[field] instanceof Participant) {
                        type = "Participant";
                        break;
                    }
                    if(element[field] instanceof DocumentType) {
                        type = "DocumentType";
                        break;
                    }
                    if(element[field] instanceof Worker) {
                        type = "Worker";
                        break;
                    }
                    if(element[field] instanceof Tags) {
                        type = "Tags";
                        break;
                    }
                    else {
                        return "object";
                    }
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
        const row = this.element.getElementsByTagName('tr')[0],
            cols = row ? row.children : undefined;
        if (!cols) return;


        let tableHeight = this.element.offsetHeight;

        for (let i = 0; i < cols.length; i++) {
            let div = createDiv(tableHeight);
            cols[i].appendChild(div);
            cols[i].style.position = 'relative';
            setListeners(this.element, div);
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
            div.style.right = 0;
            div.style.width = '5px';
            div.style.position = 'absolute';
            div.style.cursor = 'col-resize';
            div.style.userSelect = 'none';
            div.style.height = height + 'px';
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

    set data(value) {
        this.options.data = value;
    }

    get data() {
        return this.options.data;
    }
    get modalToModify() {
        return this.options.modalToModify;
    }
}

function getInputLettersPreset() {
}
