import { ajaxRequest } from '../ajax.js';

export class MapToolbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    async connectedCallback() {
        await this.getHtml();
    }

    async getHtml() {
        const html = await ajaxRequest('../html/map-toolbar.html');
        this.shadowRoot.innerHTML = html;

        this.initializeRegiment();
        // this.initializeTown();
    }

    initializeRegiment() {
        const regiment = document.createElement('ww2-map-element');
        // regiment.classList.add('testing');
        regiment.classList.add('toolbar-element');
        regiment.style = `
            top: 0;
            left: 0;
        `;
        regiment.setAttribute('image', '../img/soldier.jpg');
        regiment.addEventListener('mousedown', this.initializeRegiment.bind(this), {
            once: true // Prevent execution every time element is moved around map (including confirmation check)
        });

        this.shadowRoot.appendChild(regiment);
    }

    initializeTown() {
        const town = document.createElement('ww2-map-element');
        town.classList.add('toolbar-element');
        town.style = `
            top: 0;
            left: 0;
        `;
        town.setAttribute('image', '../img/town.jpg');
        town.addEventListener('mousedown', this.initializeTown.bind(this));

        this.shadowRoot.appendChild(town);
    }
}

customElements.define('ww2-map-toolbar', MapToolbar);