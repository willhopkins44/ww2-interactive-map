import { ajaxRequest } from '../ajax.js';

export class MapElement extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({mode: 'open'});
        this.initialized = false;
    }

    async connectedCallback() {
        if (!this.initialized) {
            await this.getHtml();
            this.initialize();
        }
    }

    async getHtml() {
        const html = await ajaxRequest('../html/map-element.html');
        this.shadowRoot.innerHTML = html;
    }

    initialize() {
        this.addEventListener('mousedown', this.initializeDrag);

        this.initialized = true;
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

        toolbar.shadowRoot.removeChild(this);
        mapGridWrapper.appendChild(this);
    }

    confirm() {
        const confirmBox = document.createElement('div');
        confirmBox.classList.add('confirm');

        const elementStyles = window.getComputedStyle(this);
        const elementWidth = parseFloat(elementStyles.getPropertyValue('width').replace('px', ''));
        const elementHeight = parseFloat(elementStyles.getPropertyValue('height').replace('px', ''));

        this.shadowRoot.appendChild(confirmBox); // append before getComputedStyle
        
        const confirmBoxStyles = window.getComputedStyle(confirmBox);
        const confirmBoxWidth = parseFloat(confirmBoxStyles.getPropertyValue('width').replace('px', ''));
        const confirmBoxHeight = parseFloat(confirmBoxStyles.getPropertyValue('height').replace('px', ''));

        confirmBox.style.left = (elementWidth - confirmBoxWidth) + 'px';
        confirmBox.style.top = (elementHeight - confirmBoxHeight) + 'px';
        console.log(`${confirmBox.style.left}, ${confirmBox.style.top}`);
    }
    
}

customElements.define('ww2-map-element', MapElement);