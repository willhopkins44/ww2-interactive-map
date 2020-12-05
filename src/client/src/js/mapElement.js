import { ajaxRequest } from '../ajax.js';

export class MapElement extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({mode: 'open'});
    }

    async connectedCallback() {
        await this.getHtml();
    }

    async getHtml() {
        const html = await ajaxRequest('../html/mapElement.html');
        this.shadowRoot.innerHTML = html;

        this.initialize();
    }

    initialize() {
        this.addEventListener('mousedown', this.initializeDrag);
    }

    initializeDrag(e) {
        let initX = 0, initY = 0, currX = 0, currY = 0;

        e = e || window.event;
        e.preventDefault();
        e.stopPropagation(); // prevents drag from traversing up DOM and affecting map grid
        initX = e.clientX;
        initY = e.clientY;
        
        const drag = (e) => {
            e = e || window.event;
            e.preventDefault();
            currX = initX - e.clientX;
            currY = initY - e.clientY;
            initX = e.clientX;
            initY = e.clientY;

            this.style.left = (this.offsetLeft - currX) + 'px';
            this.style.top = (this.offsetTop - currY) + 'px';
        }

        const stopDrag = (e) => {
            document.onmouseup = null;
            document.onmousemove = null;

            const toolbar = document.querySelector('ww2-map-toolbar');

            if (this.getRootNode().host === toolbar) {
                this.checkPos();
            }
        }

        document.onmouseup = stopDrag;
        document.onmousemove = drag;
    }

    checkPos() {
        const mapGrid = document.querySelector('ww2-map').shadowRoot.querySelector('.map-grid');

        let elementLeft = this.offsetLeft;
        let elementTop = this.offsetTop;
        const mapGridLeft = mapGrid.offsetLeft;
        const mapGridTop = mapGrid.offsetTop;
        
        if (elementLeft >= mapGridLeft && elementTop >= mapGridTop) {
            // TODO: ensure not still on toolbar (such as if map is under toolbar)
            // Adjust element position to grid
            elementLeft -= mapGridLeft;
            elementTop -= mapGridTop;
            this.style.left = elementLeft + 'px';
            this.style.top = elementTop + 'px';

            // Attach element to position in map grid
            this.appendToMap();
        }
    }

    appendToMap() {
        const mapGrid = document.querySelector('ww2-map').shadowRoot.querySelector('.map-grid');
        const mapGridWrapper = mapGrid.querySelector('.map-grid-wrapper');
        const toolbar = document.querySelector('ww2-map-toolbar');

        console.log(toolbar);
        toolbar.shadowRoot.removeChild(this);
        mapGridWrapper.appendChild(this);
    }
    
}

customElements.define('ww2-map-element', MapElement);