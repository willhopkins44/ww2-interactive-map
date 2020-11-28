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
    }
}

customElements.define('ww2-map-toolbar', MapToolbar);