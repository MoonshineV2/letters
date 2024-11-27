let aside;

class Modal {

    root;

    headerName = "";
    body = '';
    footer = '';
    constructor(options = {}) {
        if (options.headerName) {
            this.headerName = options.headerName;
        }

        if (options.body) {
            this.body = options.body;
        }

        if (options.footer) {
            this.footer = options.footer;
        }

        this.initialize();
    }

    initialize() {
        this.root = document.createElement("div");
        this.root.classList.add("modal");
        document.getElementsByTagName("body")[0].appendChild(this.root);
        document.getElementsByTagName("body")[0].style.overflow = "hidden";


        let background = '<div class="modal-background"></div>';
        let section = `
            <div class="letter-section section-modal">
                <header>
                <h1>${this.headerName}</h1>
                <img class="modal-close" src="../images/close.svg" alt="Иконка закрытия модального окна">
                </header>
                <div class="dividing-line"></div>
                <section class="modal-body">
                    
                </section>
                <div class="dividing-line"></div>
                <footer>
                
                </footer>
            </div>
        `;

        this.root.innerHTML = background + section;

        if (typeof this.body === "object") {
            this.root.querySelector("section").appendChild(this.body);
        }
        else {
            this.root.querySelector("section").innerHTML = this.body;
        }

        if (typeof this.footer === "object") {
            this.root.querySelector("footer").appendChild(this.footer);
        }
        else {
            this.root.querySelector("footer").innerHTML = this.footer;
        }

        this.root.querySelector(".modal-background").onclick = () => {
            this.root.remove();
            document.getElementsByTagName("body")[0].style.overflow = "";
        }

        this.root.querySelector(".modal-close").onclick = () => {
            this.root.remove();
            document.getElementsByTagName("body")[0].style.overflow = "";
        }

    }

    close() {
        document.getElementsByTagName("body")[0].style.overflow = "";
        this.root.remove();
    }
}

function informerStatus200Instance(timeToShow, text) {
    const informer = document.createElement("div");
    informer.classList.add("bottom-informer");
    document.getElementsByTagName("body")[0].appendChild(informer);

    const okayIcon = document.createElement("dib");
    okayIcon.classList.add("okay-icon");
    informer.appendChild(okayIcon);

    const p = document.createElement("p");
    informer.appendChild(p);
    p.innerText = text;

    const closeIcon = document.createElement("div");
    closeIcon.classList.add("close-icon");
    informer.appendChild(closeIcon);
    closeIcon.onclick = () => {
        informer.remove();
    }

    setTimeout(() => {
        informer.classList.add("fading");
    }, (timeToShow-1) * 1000);
    setTimeout(() => {
        informer.remove();
    }, timeToShow * 1000);

    getAsideInstance().appendChild(informer);
}

function informerStatusNot200Instance(timeToShow, text, errorMessage) {
    const informer = document.createElement("div");
    informer.classList.add("bottom-informer");
    informer.classList.add("bottom-informer-error");
    document.getElementsByTagName("body")[0].appendChild(informer);

    const p = document.createElement("p");
    informer.appendChild(p);
    p.innerText = text;

    if (errorMessage) {
        /*const pError = document.createElement("p");
        pError.innerText = ` | Причина: ${errorMessage}`;
        informer.appendChild(pError);*/
        p.innerText += ` | Причина: ${errorMessage}`

    }

    const closeIcon = document.createElement("div");
    closeIcon.classList.add("close-icon");
    informer.appendChild(closeIcon);
    closeIcon.onclick = () => {
        informer.remove();
    }

    setTimeout(() => {
        informer.classList.add("fading");
    }, (timeToShow-1) * 1000);
    setTimeout(() => {
        informer.remove();
    }, timeToShow * 1000);

    getAsideInstance().appendChild(informer);
}

function getAsideInstance() {
    if (aside)
        return aside;

    aside = document.createElement("aside");
    aside.classList.add("aside-informer");

    document.querySelector("main").appendChild(aside);

    return aside;
}