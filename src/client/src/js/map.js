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
        this.populateMap();
    }

    initializeMapGrid() {
        const mapGrid = this.shadowRoot.querySelector('.map-grid');

        mapGrid.addEventListener('mousedown', this.initializeDrag);
        // mapGrid.addEventListener('wheel', this.zoom); // disabled
    }

    initializeMutationObserver() {
        const targetNode = this.shadowRoot.querySelector('.map-grid-wrapper');

        const mutationCallback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                if (mutation['addedNodes'].length == 1) {
                    const element = mutation['addedNodes'][0];
                    if (!element.hasAttribute('mapId')) {
                        element.checkConfirmation();
                        break;
                    }
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

    async populateMap() {
        const path = window.location.origin + '/get/mapElement?type=all';
        const elements = JSON.parse(await ajaxRequest(path));
        const mapGrid = this.shadowRoot.querySelector('.map-grid');
        const mapGridWrapper = mapGrid.querySelector('.map-grid-wrapper');

        for (const type of Object.keys(elements)) {
            for (const element of elements[type]) {
                const newElement = document.createElement('ww2-map-element');
                newElement.style = `
                    position: absolute;
                    left: ${element.pos_x}px;
                    top: ${element.pos_y}px;
                `;
                newElement.setAttribute('image', `../img/${type}.jpg`);
                newElement.setAttribute('mapId', element._id);
                newElement.positionLocked = true;
                mapGridWrapper.appendChild(newElement);
            }
        }
    }

    initializeDrag(e) {
        if (e.button == 0) {
            const mapGrid = this
            let initX = 0, initY = 0, currX = 0, currY = 0;

            e = e || window.event;
            e.preventDefault();
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