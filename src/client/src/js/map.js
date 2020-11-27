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
    }

    initializeMapGrid() {
        const mapGrid = this.shadowRoot.getElementById('mapGrid');
        const mapImage = this.shadowRoot.getElementById('mapImage');
        console.log(mapImage.height);

        mapGrid.style.width = mapImage.width;
        mapGrid.style.height = mapImage.height;

        // let initX = 0, initY = 0, currX = 0, currY = 0;
        let dragCoords = {
            initX: 0,
            initY: 0,
            currX: 0,
            currY: 0
        }
        let scale = 1;

        const startDrag = (e) => {
            e = e || window.event;
            e.preventDefault();
            dragCoords.initX = e.clientX;
            dragCoords.initY = e.clientY;
            document.onmouseup = stopDrag;
            document.onmousemove = drag;
        }

        const drag = (e) => {
            e = e || window.event;
            e.preventDefault();
            dragCoords.currX = dragCoords.initX - e.clientX;
            dragCoords.currY = dragCoords.initY - e.clientY;
            dragCoords.initX = e.clientX;
            dragCoords.initY = e.clientY;

            mapGrid.style.left = (mapGrid.offsetLeft - dragCoords.currX) + 'px';
            mapGrid.style.top = (mapGrid.offsetTop - dragCoords.currY) + 'px';
        }

        const stopDrag = (e) => {
            document.onmouseup = null;
            document.onmousemove = null;
        }

        const zoom = (e) => {
            e = e || window.event;
            e.preventDefault();
            
            const oldScale = scale;

            scale += e.deltaY * -0.001;
            scale = Math.min(Math.max(.125, scale), 4); // limits
            // console.log(scale);
            console.log(`(${e.clientX}, ${e.clientY})`);

            // const 

            const scaleChange = scale - oldScale;
            const offsetX = -(e.clientX * scaleChange);
            const offsetY = -(e.clientY * scaleChange);

            mapGrid.style.transform = `scale(${scale})`
            // mapGrid.style.left = (mapGrid.offsetLeft + offsetX) + 'px';
            // mapGrid.style.top = (mapGrid.offsetTop - offsetY) + 'px';
        }

        mapGrid.addEventListener('mousedown', startDrag);
        mapGrid.addEventListener('wheel', zoom);
    }
}

customElements.define('ww2-map', Map);