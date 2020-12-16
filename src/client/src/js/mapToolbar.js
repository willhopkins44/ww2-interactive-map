import { ajaxRequest } from '../ajax.js';

export class MapToolbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.initialized = false;
    }

    async connectedCallback() {
        await this.getHtml();
    }

    async getHtml() {
        const html = await ajaxRequest('../html/map-toolbar.html');
        this.shadowRoot.innerHTML = html;

        this.initializeElements();
    }

    unattachElement() {
        // "this" refers to the map element
        // position absolute removes an element from flexbox
        this.style = `
            position: absolute;
        `;
    }

    initializeElements() {
        if (this.initialized) {
            const oldElements = this.shadowRoot.querySelectorAll('ww2-map-element');
            for (const oldElement of oldElements) {
                if (parseFloat(oldElement.style.top.replace('px', '')) == 0) {
                    // element has not been dragged
                    oldElement.remove();
                }
            }
        }

        const elements = {
            regiment: '../img/soldier.jpg',
            town: '../img/town.jpg'
        }

        for (const imageUrl of Object.values(elements)) {
            const element = document.createElement('ww2-map-element');
            element.classList.add('toolbar-element');
            element.style = `
                top: 0px;
                left: 0px;
            `;
            element.setAttribute('image', imageUrl);
            element.addEventListener('mousedown', this.unattachElement, {
                once: true
            });
            element.addEventListener('mousedown', this.initializeElements.bind(this), {
                once: true
            });

            this.shadowRoot.appendChild(element);
        }

        if (!this.initialized) {
            this.initialized = true;
        }
    }
}

customElements.define('ww2-map-toolbar', MapToolbar);