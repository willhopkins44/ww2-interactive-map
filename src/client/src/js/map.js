import { ajaxRequest } from '../ajax.js';

export class Map extends HTMLElement {
    constructor () {
        super(); // Constructs HTMLElement first
        this.attachShadow({mode: 'open'});
    }

    async connectedCallback() {
        await this.getHtml();
    }

    async getHtml() {
        const html = await ajaxRequest('../html/map.html');
        this.shadowRoot.innerHTML = html;

        this.initializeMapGrid();
        this.initializeMutationObserver();
    }

    initializeMutationObserver() {
        const targetNode = this.shadowRoot.querySelector('.map-grid-wrapper');

        const mutationCallback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation['addedNodes'].length == 1) {
                    const element = mutation['addedNodes'][0];
                    element.confirm();
                    break;
                }
            }
        };

        const observer = new MutationObserver(mutationCallback);

        observer.observe(targetNode, {
            childList: true,
            subtree: false
        });

        // observer.disconnect();
    }

    initializeMapGrid() {
        const mapGrid = this.shadowRoot.querySelector('.map-grid');

        mapGrid.addEventListener('mousedown', this.initializeDrag);
        // mapGrid.addEventListener('wheel', this.zoom); // disabled

        // Temporary map element insertion
        // const mapGridWrapper = this.shadowRoot.querySelector('.map-grid-wrapper');
        // const mapElement = document.createElement('ww2-map-element');
        // mapElement.classList.add('regiment');
        // mapElement.style = `
        //     position: absolute;
        //     top: 0;
        //     left: 0;
        //     z-index: 5;
        // `;
        // mapGridWrapper.appendChild(mapElement);
    }

    initializeDrag(e) {
        const mapGrid = this
        let initX = 0, initY = 0, currX = 0, currY = 0;

        e = e || window.event;
        e.preventDefault();
        initX = e.clientX;
        initY = e.clientY;
        // console.log(`${initX}, ${initY}`);
        
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

    zoom(e) {
        const mapGrid = this;
        if (!mapGrid.getAttribute('scale')) {
            mapGrid.setAttribute('scale', 1);
        }
        let scale = parseFloat(mapGrid.getAttribute('scale'));

        e = e || window.event;
        e.preventDefault();
        
        scale += e.deltaY * -0.001;
        scale = Math.min(Math.max(.125, scale), 4); // minimum and maximum level of zoom

        mapGrid.style.transform = `scale(${scale})`;
        mapGrid.setAttribute('scale', scale);
    }
}

customElements.define('ww2-map', Map);