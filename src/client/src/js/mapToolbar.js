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

        try {
            const path = window.location.origin + '/get/isAdmin';
            const isAdmin = await ajaxRequest(path);
            if (isAdmin) {
                this.initializeElements();
            }
        } catch (error) {
            console.error(error);
        }
    }

    unattachElement() {
        // "this" refers to the map element
        // position absolute removes an element from flexbox
        this.classList.remove('toolbar-element');
        const dimensions = this.getBoundingClientRect();
        this.style = `
            position: absolute;
            left: ${dimensions.x}px;
            top: ${dimensions.y}px;
        `;
    }

    initializeElements() {
        if (this.initialized) {
            const elementsContainer = this.shadowRoot.querySelector('.elements-container');
            const oldElements = elementsContainer.querySelectorAll('ww2-map-element');
            for (const oldElement of oldElements) {
                if (oldElement.classList.contains('toolbar-element')) {
                    // element has not been dragged
                    oldElement.remove();
                }
            }
        }

        const elementImages = {
            // division: '../img/division.jpg',
            division_infantry_GER: '../img/division_infantry_GER.svg',
            location: '../img/location.jpg'
        }

        for (let [key, imageUrl] of Object.entries(elementImages)) {
            const element = document.createElement('ww2-map-element');
            element.classList.add('toolbar-element');
            element.style = `
                top: 0px;
                left: 0px;
            `;
            key = key.split('_');
            const type = key[0];
            const specialty = key[1];
            const allegiance = key[2];
            element.setAttribute('type', type);
            element.setAttribute('specialty', specialty);
            element.setAttribute('allegiance', allegiance);
            element.setAttribute('image', imageUrl);
            element.addEventListener('mousedown', this.unattachElement, {
                once: true
            });
            element.addEventListener('mousedown', this.initializeElements.bind(this), {
                once: true
            });

            // this.shadowRoot.appendChild(element);
            const elementsContainer = this.shadowRoot.querySelector('.elements-container');
            elementsContainer.appendChild(element);
        }

        if (!this.initialized) {
            this.initialized = true;
        }
    }
}

customElements.define('ww2-map-toolbar', MapToolbar);