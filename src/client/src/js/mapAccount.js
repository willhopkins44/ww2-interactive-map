import { ajaxRequest } from '../ajax.js';

export class MapSignin extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    async connectedCallback() {
        console.log('connected callback');
        await this.getHtml();
    }

    async getHtml() {
        const html = await ajaxRequest('../html/map-account.html');
        this.shadowRoot.innerHTML = html;

        this.initialize();
    }

    initialize() {
        const steamButton = this.shadowRoot.querySelector('img');
        steamButton.addEventListener('click', () => {
            location.href = location.href + 'auth/steam';
        });

        if (steamButton.classList.contains('hidden')) {
            steamButton.classList.remove('hidden');
        }

        // document.cookie = 'dummyCookie=for testing multiple cookies';
        const cookies = document.cookie;
        const cookieList = cookies.split(';');
        for (const cookie of cookieList) {
            const cookieName = cookie.split('=')[0].replace(' ', '');
            if (cookieName == 'connect.sid') {
                // User is logged in because session exists
                if (!steamButton.classList.contains('hidden')) {
                    steamButton.classList.add('hidden');
                }
            }
        }
    }
}

customElements.define('ww2-map-signin', MapSignin);