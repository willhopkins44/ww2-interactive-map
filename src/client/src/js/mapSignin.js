import { ajaxRequest } from '../ajax.js';

export class MapSignin extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    async connectedCallback() {
        await this.getHtml();
    }

    async getHtml() {
        const html = await ajaxRequest('../html/map-signin.html');
        this.shadowRoot.innerHTML = html;
    }
}

customElements.define('ww2-map-signin', MapSignin);