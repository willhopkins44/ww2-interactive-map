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

        this.initializeListings();
    }

    initializeListings() {
        const regiment = document.createElement('ww2-map-element');
        regiment.classList.add('testing');
        regiment.style = `
            position: absolute;
            top: 0;
            left: 0;
            z-index: 5;
        `;

        this.shadowRoot.appendChild(regiment);
    }
}

customElements.define('ww2-map-toolbar', MapToolbar);