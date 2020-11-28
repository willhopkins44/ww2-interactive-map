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
        const mapGrid = this
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

            mapGrid.style.left = (mapGrid.offsetLeft - currX) + 'px';
            mapGrid.style.top = (mapGrid.offsetTop - currY) + 'px';
        }

        const stopDrag = (e) => {
            document.onmouseup = null;
            document.onmousemove = null;
        }

        document.onmouseup = stopDrag;
        document.onmousemove = drag;
    }
    
}

customElements.define('ww2-map-element', MapElement);