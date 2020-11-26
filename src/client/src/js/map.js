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
    }
}

customElements.define('ww2-map', Map);