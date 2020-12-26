import { ajaxRequest } from '../ajax.js';

export class MapElement extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({mode: 'open'});
        this.initialized = false;
        this.positionLocked = false;
    }

    async connectedCallback() {
        if (!this.initialized) {
            await this.getHtml();
        }
    }

    static get observedAttributes() {
        return ['image'];
    };

    attributeChangedCallback(name, oldValue, newValue) {
        // this.initializeImage(newValue);
        this.imageUrl = newValue;
    }

    async getHtml() {
        const html = await ajaxRequest('../html/map-element.html');
        this.shadowRoot.innerHTML += html; // += because the image may have already been appended to the shadow root

        this.initialize();
    }

    initialize() {
        this.initializeImage(this.imageUrl);
        this.initializeInformation();
        this.addEventListener('mousedown', this.initializeDrag);
        this.addEventListener('mouseover', this.displayInformation);

        this.initialized = true;
    }

    initializeImage(url) {
        const image = document.createElement('img');
        image.classList.add('image');
        image.setAttribute('src', url);

        this.shadowRoot.appendChild(image);
    }

    initializeInformation() {
        const informationBox = document.createElement('div');
        informationBox.classList.add('information');
        informationBox.classList.add('hidden');
        this.shadowRoot.appendChild(informationBox);

        const informationBoxStyles = window.getComputedStyle(informationBox);
        const informationBoxHeight = parseFloat(informationBoxStyles.getPropertyValue('height').replace('px', ''));

        const elementStyles = window.getComputedStyle(this);
        const elementWidth = parseFloat(elementStyles.getPropertyValue('width').replace('px', ''));
        const elementHeight = parseFloat(elementStyles.getPropertyValue('height').replace('px', ''));

        informationBox.style.left = (elementWidth) + 'px';
        informationBox.style.top = ((elementHeight - informationBoxHeight) / 2) + 'px';
    }

    initializeDrag(e) {
        if (!this.positionLocked) {
            let initX = 0, initY = 0, currX = 0, currY = 0;

            e = e || window.event;
            e.preventDefault();
            e.stopPropagation(); // prevents drag from traversing up DOM and affecting map grid
            initX = e.clientX;
            initY = e.clientY;
            
            const drag = (e) => {
                e = e || window.event;
                e.preventDefault();
                currX = initX - e.clientX;
                currY = initY - e.clientY;
                initX = e.clientX;
                initY = e.clientY;

                this.style.left = (this.offsetLeft - currX) + 'px';
                this.style.top = (this.offsetTop - currY) + 'px';
            }

            const stopDrag = (e) => {
                document.onmouseup = null;
                document.onmousemove = null;

                const toolbar = document.querySelector('ww2-map-toolbar');

                if (this.getRootNode().host === toolbar) {
                    this.checkPos();
                }
            }

            document.onmouseup = stopDrag;
            document.onmousemove = drag;
        }
    }

    displayInformation(e) {
        const informationBox = this.shadowRoot.querySelector('.information');
        if (this.positionLocked) {
            const displayInformationBox = setTimeout(() => {
                informationBox.classList.remove('hidden');
            }, 600);

            this.onmouseleave = () => {
                if (!informationBox.classList.contains('hidden')) {
                    informationBox.classList.add('hidden');
                }
                clearTimeout(displayInformationBox);
            }
        }
    }

    checkPos() {
        const mapGrid = document.querySelector('ww2-map').shadowRoot.querySelector('.map-grid');
        const toolbar = document.querySelector('ww2-map-toolbar');

        let elementLeft = this.offsetLeft;
        let elementTop = this.offsetTop;
        const mapGridLeft = mapGrid.offsetLeft;
        const mapGridTop = mapGrid.offsetTop;
        const toolbarHeight = toolbar.offsetHeight;
        
        if (elementLeft >= mapGridLeft && elementTop >= mapGridTop && elementTop >= toolbarHeight) {
            // TODO: ensure not still on toolbar (such as if map is under toolbar)
            // Adjust element position to grid
            elementLeft -= mapGridLeft;
            elementTop -= mapGridTop;
            this.style.left = elementLeft + 'px';
            this.style.top = elementTop + 'px';

            // Attach element to position in map grid
            this.appendToMap();
        }
    }

    appendToMap() {
        const mapGrid = document.querySelector('ww2-map').shadowRoot.querySelector('.map-grid');
        const mapGridWrapper = mapGrid.querySelector('.map-grid-wrapper');
        const toolbar = document.querySelector('ww2-map-toolbar');

        toolbar.shadowRoot.removeChild(this);
        mapGridWrapper.appendChild(this);
    }

    checkConfirmation() {
        const confirmBox = document.createElement('div');
        confirmBox.classList.add('confirmation');
        this.shadowRoot.appendChild(confirmBox); // append before getComputedStyle

        const confirmBoxStyles = window.getComputedStyle(confirmBox);
        const confirmBoxHeight = parseFloat(confirmBoxStyles.getPropertyValue('height').replace('px', ''));

        const elementStyles = window.getComputedStyle(this);
        const elementWidth = parseFloat(elementStyles.getPropertyValue('width').replace('px', ''));
        const elementHeight = parseFloat(elementStyles.getPropertyValue('height').replace('px', ''));
        
        confirmBox.style.left = (elementWidth) + 'px';
        confirmBox.style.top = (elementHeight - confirmBoxHeight) + 'px';

        const check = document.createElement('div');
        check.classList.add('check');
        check.innerHTML = '&#x2713;'; // checkmark
        confirmBox.appendChild(check);

        const cross = document.createElement('div');
        cross.classList.add('cross');
        cross.innerHTML = '&#x2717;'; // x mark
        confirmBox.appendChild(cross);

        const confirm = () => {
            this.positionLocked = true;
            confirmBox.remove();
        }

        const cancel = () => {
            this.remove();
        }

        check.addEventListener('click', confirm);
        cross.addEventListener('click', cancel);
    }
}

customElements.define('ww2-map-element', MapElement);